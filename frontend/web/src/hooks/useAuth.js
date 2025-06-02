import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
    const [userID, setUserId] = useState(null);
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log("Token from localStorage:", token);
        
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log("Decoded token:", decoded);
                
                // Kiểm tra và lấy userID từ token
                const userId = decoded.userid || decoded.UserID || decoded.user_id;
                if (userId) {
                    console.log("UserID from token:", userId);
                    setUserId(userId);
                } else {
                    console.error("Token không chứa thông tin userID");
                }

                // Kiểm tra và lấy role từ token
                const userRole = decoded.role || decoded.Role;
                if (userRole) {
                    console.log("Role from token:", userRole);
                    setRole(userRole);
                } else {
                    console.error("Token không chứa thông tin role");
                    setRole('user'); // Mặc định là user nếu không có role
                }
            } catch (error) {
                console.error("Token không hợp lệ:", error);
                // Xóa token không hợp lệ
                localStorage.removeItem('token');
                setRole(null);
            }
        } else {
            setRole(null);
        }
        setIsLoading(false);
    }, []);

    return { userID, role, isLoading };
};

export default useAuth;