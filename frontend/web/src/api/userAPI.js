import apiClient from './apiClient.js';

export const getUsers = async () => {
    try {
        const response = await apiClient.get('/api/users');
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
        throw error;
    }
};

export const getUserById = async (id) => {
    try {
        const response = await apiClient.get(`/api/user/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy thông tin người dùng ID ${id}:`, error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('token');
            
            // Tạo headers với token
            const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        
        const response = await apiClient.get('/api/profile', config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng hiện tại:', error);
        throw error;
    }
};

export const updateProfile = async (profileData) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
        };
        
        const response = await apiClient.put('/api/profile', profileData, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin cá nhân:', error);
        throw error;
    }
};

export const updatePassword = async (passwordData) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
        };
        
        const response = await apiClient.put('/api/profile/password', passwordData, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật mật khẩu:', error);
        throw error;
    }
};

export const updateCV = async (cvData) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
        };
        
        const response = await apiClient.put('/api/profile/cv', cvData, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật CV:', error);
        throw error;
    }
};
