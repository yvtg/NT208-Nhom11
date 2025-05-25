// hooks/useMessages.js
import { useState, useEffect, useCallback } from 'react';
import { getMessages } from '../api/messages';

const useMessages = (conversationID) => {
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);

    const fetchMessages = useCallback(async () => {
        if (!conversationID) return;
        
        try {
            setMessagesLoading(true);
            setMessagesError(null);
            
            const data = await getMessages(conversationID);
            setMessages(data);
        } catch (err) {
            setMessagesError(err.message);
            console.error('Error fetching messages:', err);
        } finally {
            setMessagesLoading(false);
        }
    }, [conversationID]);

    // Tự động fetch messages khi conversationID thay đổi
    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    // Hàm refresh 
    const refreshMessages = () => {
        fetchMessages();
    };

    return { messages, messagesLoading, messagesError, refreshMessages, setMessages };
};

export default useMessages;