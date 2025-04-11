import { useState } from 'react';

const useDeleteConversation = () => {
    const [deleteLoading, setLoading] = useState(false);
    const [deleteError, setError] = useState(null);

    const deleteConversation = async (conversationID) => {
        const token = localStorage.getItem('token');
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:3000/api/chat/conversations/${conversationID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Xoá thất bại');
            }

            const result = await response.json();
            return result; // Trả dữ liệu nếu cần
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
