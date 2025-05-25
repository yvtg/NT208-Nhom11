import axios from 'axios';

const API_URL = 'http://localhost:3000/api/chat';

// Lấy danh sách cuộc hội thoại
export const getConversations = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/conversations`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Lỗi khi lấy danh sách cuộc hội thoại';
    }
};

// Lấy tin nhắn của một cuộc hội thoại
export const getMessages = async (conversationID) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/messages/${conversationID}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Lỗi khi lấy tin nhắn';
    }
};

// Gửi tin nhắn mới
export const sendMessage = async (conversationID, content) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/messages`, {
            conversationID,
            content
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Lỗi khi gửi tin nhắn';
    }
};

// Tạo cuộc hội thoại mới
export const createConversation = async (participantID) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/conversations`, {
            participantID
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Lỗi khi tạo cuộc hội thoại';
    }
};

// Xóa cuộc hội thoại
export const deleteConversation = async (conversationID) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/conversations/${conversationID}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Lỗi khi xóa cuộc hội thoại';
    }
};
