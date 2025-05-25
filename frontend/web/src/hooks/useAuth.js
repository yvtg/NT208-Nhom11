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
                // Kiểm tra và lấy userID từ token
                const userId = decoded.userid || decoded.UserID || decoded.user_id;
                if (userId) {
                    setUserId(userId);
                } else {
                    console.error("Token không chứa thông tin userID");
                }
            } catch (error) {
                console.error("Token không hợp lệ:", error);
                // Xóa token không hợp lệ
                localStorage.removeItem('token');
            }
        }
        setIsLoading(false);
    }, []);

    return { userID, isLoading };
};

export default useAuth;