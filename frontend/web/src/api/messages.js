import apiClient from "./apiClient";

// Lấy danh sách cuộc hội thoại
export const getConversations = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await apiClient.get(`/api/chat/conversations`, {
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
        const response = await apiClient.get(`/api/chat/messages/${conversationID}`, {
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
        const response = await apiClient.post(`/api/chat/messages`, {
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
        const response = await apiClient.post(`/api/chat/conversations`, {
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
        const response = await apiClient.delete(`/api/chat/conversations/${conversationID}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Lỗi khi xóa cuộc hội thoại';
    }
};
