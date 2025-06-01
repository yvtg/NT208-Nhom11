import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Searchbar = ({ className }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/jobs/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <div className={`w-full ${className}`}>
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Tìm kiếm dự án" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-2 text-sm md:text-base rounded-full shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkPrimary"
                />
                <button 
                    type="button" 
                    onClick={handleSubmit}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-darkPrimary transition-colors"
                >
                    <FaSearch className="text-sm md:text-base" />
                </button>
            </div>
        </div>
    );
};

export default Searchbar;
