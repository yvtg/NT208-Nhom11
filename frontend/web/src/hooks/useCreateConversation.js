import { useState } from 'react';

const useCreateConversation = () => {
    const [createLoading, setLoading] = useState(false);
    const [createError, setError] = useState(null);

    const createConversation = async (participantID) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        try {
        const res = await fetch('http://localhost:3000/api/chat/conversations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ participantID }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Lỗi khi tạo cuộc hội thoại');
        }

        const data = await res.json();
        return data;
        } catch (err) {
        console.error('Lỗi tạo cuộc hội thoại:', err);
        setError(err.message);
        return null;
        } finally {
        setLoading(false);
        }
    };

    return { createConversation, createLoading, createError };
};

export default useCreateConversation;
