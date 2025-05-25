import { useEffect, useRef, useState } from 'react';
import MessageItem from './MessageItem';
import Spinner from './Spinner';
import { FaArrowDown } from 'react-icons/fa';

function MessageComponent({ conversationID, socket, messages, loading, error, refreshMessages, setMessages, avatarURL, conversationName }) {

    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    // Cuộn tự động đến tin nhắn mới nhất
    const scrollToBottom = () => {
        if (!containerRef.current) return;
        
        setTimeout(() => {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
            setShowScrollButton(false);
        }, 100);
    };

    // Kiểm tra vị trí scroll để hiển thị/ẩn nút cuộn xuống
    const handleScroll = () => {
        if (!containerRef.current) return;
        
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollButton(!isNearBottom);
    };

    // Cuộn xuống khi có tin nhắn mới
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Xử lý socket
    useEffect(() => {
        if (!socket || !conversationID) return;

        const currentSocket = socket.current;
        if (!currentSocket) return;

        currentSocket.emit("joinConversation", conversationID);

        const handleReceiveMessage = () => {
            refreshMessages();
            scrollToBottom();
        };

        currentSocket.on("receiveMessage", handleReceiveMessage);

        return () => {
            if (currentSocket) {
                currentSocket.off("receiveMessage", handleReceiveMessage);
            }
        };
    }, [conversationID, socket, setMessages, refreshMessages]);

    if (error) return <div>Error: {error}</div>;

    return (
        <div className="relative h-[calc(100vh-12rem)] pb-9">
            <div 
                ref={containerRef}
                className='h-full overflow-y-auto px-4 py-2'
                style={{ scrollBehavior: 'smooth' }}
                onScroll={handleScroll}
            >
                {loading ? <Spinner /> : null}
                <div className="flex flex-col space-y-4">
                    {messages.map((message, index) => (
                        <MessageItem 
                            key={message.MessageID || message._id || index} 
                            message={message}
                            avatarURL={avatarURL} 
                            conversationName={conversationName}
                        />
                    ))}
                </div>
                <div ref={messagesEndRef} />
            </div>

            {/* Nút cuộn xuống */}
            {showScrollButton && (
                <button
                    onClick={scrollToBottom}
                    className="absolute z-50 bottom-4 right-4 bg-primary-500 text-white p-3 rounded-full shadow-lg hover:bg-primary-600 transition-colors duration-200"
                    title="Cuộn xuống tin nhắn mới nhất"
                >
                    <FaArrowDown className="w-5 h-5 text-darkPrimary" />
                </button>
            )}
        </div>
    );
}

export default MessageComponent;