// hooks/useMessages.js
import { useState, useEffect, useCallback } from 'react';

const useMessages = (conversationID) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMessages = useCallback(async () => {
        if (!conversationID) return;
        
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:3000/api/chat/messages/${conversationID}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("DATA: ",data);
            if (Array.isArray(data)) {
                setMessages(data);
                } else if (Array.isArray(data.messages)) {
                setMessages(data.messages);
                } else {
                setMessages([]); 
                console.warn("Unexpected message data format:", data);
            }

        } catch (err) {
        setError(err.message);
        console.error('Error fetching messages:', err);
        } finally {
        setLoading(false);
        }
    }, [conversationID]);

    // Tự động fetch messages khi conversationID thay đổi
    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    // Hàm refresh thủ công
    const refreshMessages = () => {
        fetchMessages();
    };

    return { messages, loading, error, refreshMessages, setMessages };
};

export default useMessages;