import { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import Spinner from './Spinner';


function MessageComponent( { conversationID, socket, messages, loading, error, refreshMessages, setMessages, avatarURL, conversationName  } ) {


    // Ref để cuộn tự động đến tin nhắn mới nhất
    const messagesEndRef = useRef(null);
    // Hàm cuộn tự động đến tin nhắn mới nhất
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);



    useEffect(() => {
        if (!socket.current || !conversationID) return;

        const currentSocket = socket.current; // Lưu lại tham chiếu hiện tại để tránh lỗi khi cleanup

        currentSocket.emit("joinConversation", conversationID);

        const handleReceiveMessage = () => {
            refreshMessages();
            scrollToBottom();
        };

        currentSocket.on("receiveMessage", handleReceiveMessage);

        return () => {
            currentSocket.off("receiveMessage", handleReceiveMessage);
        };
    }, [conversationID, socket, setMessages, refreshMessages]);

    if (error) return <div>Error: {error}</div>;

    return (
        <div className='flex flex-col justify-end min-h-full'>
            {loading?<Spinner /> : <></>}
            {messages.map((message, index) => (
                <MessageItem key={message.MessageID || message._id || index} message={message}
                avatarURL={avatarURL} conversationName={conversationName}/>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}

export default MessageComponent;