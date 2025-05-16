import axios from 'axios';
import apiClient from './apiClient';

export const searchProjects = async (query) => {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('token');
        
        // Tạo headers với token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const response = await apiClient.get(`/api/search`, {
            params: { q: query },
            withCredentials: true
        });
        console.log(response.data)

        return response.data;

    } catch (error) {
        console.error('Lỗi khi tìm kiếm dự án:', error);
        throw error;
    }
};
