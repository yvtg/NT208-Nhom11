import { useCallback } from 'react';
import axios from 'axios';

const useMarkAsRead = () => {
    const markAsRead = useCallback(async (conversationId) => {
        try {
            await axios.post(`/api/conversations/${conversationId}/read`);
            return true;
        } catch (error) {
            console.error('Error marking messages as read:', error);
            return false;
        }
    }, []);

    return { markAsRead };
};

export default useMarkAsRead; 