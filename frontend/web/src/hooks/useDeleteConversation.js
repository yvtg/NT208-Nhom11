import { useState } from 'react';
import { deleteConversation as deleteConversationAPI } from '../api/messages';

const useDeleteConversation = () => {
    const [deleteLoading, setLoading] = useState(false);
    const [deleteError, setError] = useState(null);

    const deleteConversation = async (conversationID) => {
        setLoading(true);
        setError(null);
        try {
            const result = await deleteConversationAPI(conversationID);
            return result;
        } catch (err) {
            console.error('Lỗi xoá cuộc hội thoại:', err);
            setError(err.message || 'Lỗi không xác định');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { deleteConversation, deleteLoading, deleteError };
};

export default useDeleteConversation;
