import { useEffect, useRef } from 'react';
import useMessages from '../hooks/useMessages';
import MessageItem from './MessageItem';


function MessageComponent( { conversationID, socket, onSetMessages } ) {
    const { messages, loading, error, setMessages } = useMessages(conversationID);
    console.log("Messages: ", messages)


    // Ref để cuộn tự động đến tin nhắn mới nhất
    const messagesEndRef = useRef(null);
    // Hàm cuộn tự động đến tin nhắn mới nhất
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (onSetMessages) onSetMessages(setMessages);
    }, [setMessages, onSetMessages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);



    useEffect(() => {
        if (!socket.current || !conversationID) return;

        const currentSocket = socket.current; // Lưu lại tham chiếu hiện tại để tránh lỗi khi cleanup

        currentSocket.emit("joinConversation", conversationID);

        const handleReceiveMessage = (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            scrollToBottom();
        };

        currentSocket.on("receiveMessage", handleReceiveMessage);

        return () => {
            currentSocket.off("receiveMessage", handleReceiveMessage);
        };
    }, [conversationID, socket, setMessages]);


    if (loading) return <div>Loading messages...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {(Array.isArray(messages) ? messages : []).map((message) => (
            <MessageItem key={message.MessageID} message={message} />
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}

export default MessageComponent;