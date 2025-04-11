import { useState } from "react";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";

const MessageInput = ({ conversationID, socket, setMessages  }) => {
    const [message, setMessage] = useState("");

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        try {
            const newMessage = {
                conversationID,
                content: message,
            };

            socket.current.emit("sendMessage", newMessage);

            setMessages(prev => [...prev, newMessage]);
            setMessage("");
        } catch (error) {
            alert("Failed to send message. Please try again.");
        }
    };

    return (
        <div className="p-4 bg-lightPrimary border-t border-gray-300 flex items-center space-x-2 shadow-sm">

            {/* Gửi file */}
            <button className="p-2 text-Primary hover:text-darkPrimary hover:shadow-md">
                <IoDocumentAttachOutline className="w-8 h-8"/>
            </button>

            {/* Nhập tin nhắn */}
            <input
                type="text"
                placeholder="Nhập tin nhắn..."
                className="flex-1 p-2 rounded-lg border border-Primary focus:outline-none focus:ring-1 focus:ring-darkPrimary"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            {/* Gửi tin nhắn */}
            <button className="p-2 text-Primary hover:text-darkPrimary hover:shadow-md" onClick={handleSendMessage}>
                <IoIosSend className="w-8 h-8"/>
            </button>
        </div>
    );
};

export default MessageInput;