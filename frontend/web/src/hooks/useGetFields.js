import { useState, useEffect } from 'react';
import { getFields } from '../api/projectAPI';

const useGetFields = () => {
    const [fieldOptions, setFieldOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFields = async () => {
        setIsLoading(true);
        try {
            const fieldsData = await getFields();
            setFieldOptions(fieldsData);
            setError(null);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách lĩnh vực:", error);
            setError("Không thể lấy danh sách lĩnh vực");
        } finally {
            setIsLoading(false);
        }
        };

        fetchFields();
    }, []);

    return { fieldOptions, isLoading, error };
};

export default useGetFields;
