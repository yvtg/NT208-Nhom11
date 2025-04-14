import apiClient from './apiClient.js';

export const getProjects = async () => {
    try {
        const response = await apiClient.get('/project/getproject');
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
