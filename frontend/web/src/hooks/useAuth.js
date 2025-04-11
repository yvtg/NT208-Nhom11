import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
    const [userID, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
        try {
            const decoded = jwtDecode(token);
            setUserId(decoded.UserID);
        } catch (error) {
            console.error("Invalid token:", error);
        }
        }
        setIsLoading(false);
    }, []);

    return { userID, isLoading };
};

export default useAuth;