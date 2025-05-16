import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchProjects } from '../api/searchAPI';

const useSearch = (initialQuery = '') => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSearch = async (query) => {
        if (!query.trim()) return;
        
        setLoading(true);
        try {
            const data = await searchProjects(query);
            setSearchResults(data);
            // Nếu đang ở trang search, cập nhật URL
            if (window.location.pathname === '/jobs/search') {
                navigate(`/jobs/search?q=${encodeURIComponent(query)}`);
            } else {
                // Nếu đang ở trang khác, chuyển hướng đến trang search
                navigate(`/jobs/search?q=${encodeURIComponent(query)}`);
            }
        } catch (error) {
            setError("Có lỗi xảy ra khi tìm kiếm dự án");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialQuery) {
            handleSearch(initialQuery);
        }
    }, [initialQuery]);

    return {
        searchResults,
        loading,
        error,
        handleSearch
    };
};

export default useSearch; 