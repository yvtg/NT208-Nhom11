import apiClient from './apiClient.js';

export const getProjects = async () => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const response = await apiClient.get('/api/project/getproject', config);
        return response.data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
}

export const createProject = async (projectData) => {
    try {
        const response = await apiClient.post('/project/createproject', projectData);
        return response.data;
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
}

export const getFields = async () => {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('token');
        
        // Tạo headers với token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const response = await apiClient.get('/api/project/getfields', config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin fields ', error);
        throw error;
    }
}

export const getMyProject = async () => {
    try {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await apiClient.get(`/api/project/getmyprojects`, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin projects', error);
        throw error;
    }
}

export const getProject = async (projectID) => {
    try {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await apiClient.get(`/api/project/getprojectbyid/${projectID}`, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin projects', error);
        throw error;
    }
}

export const deleteProject = async (projectID) => {
    try {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        
        const response = await apiClient.delete(`/api/project/deleteproject/${projectID}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa dự án:', error);
        throw error;
    }
}

export const applyToProject = async (projectID, applicationData) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                // 'Content-Type': 'multipart/form-data' is often set automatically by the browser for FormData
            }
        };

        // applicationData should be a FormData object
        // Corrected the URL to match backend route
        const response = await apiClient.post(`/api/project/apply/${projectID}`, applicationData, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi nộp hồ sơ ứng tuyển:', error);
        throw error;
    }
}