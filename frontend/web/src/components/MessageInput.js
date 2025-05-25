import { IoDocumentAttachOutline } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import { useState } from "react";
import { sendMessage } from "../api/messages";

const MessageInput = ({ conversationID, socket, refreshMessages }) => {

    // nội dung đang gõ
    const [inputMessage, setInputMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleSendMessages = async () => {
        if (!inputMessage.trim() || !conversationID || isSending) return;

        try {
            setIsSending(true);
            // Gửi tin nhắn qua API
            const newMessage = await sendMessage(conversationID, inputMessage);
            
            // Emit socket event để thông báo cho người nhận
            if (socket?.current) {
                socket.current.emit("sendMessage", {
                    conversationID,
                    content: inputMessage,
                    messageID: newMessage.id
                });
            }

            setInputMessage(""); // xóa nội dung đang gõ
            refreshMessages();
        } catch (error) {
            console.error("Lỗi gửi tin nhắn:", error);
            alert(error.message || "Không thể gửi tin nhắn");
        } finally {
            setIsSending(false);
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
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessages()}
                disabled={isSending}
            />

            {/* Gửi tin nhắn */}
            <button 
                className={`p-2 text-Primary hover:text-darkPrimary hover:shadow-md ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`} 
                onClick={handleSendMessages}
                disabled={isSending}
            >
                <IoIosSend className="w-8 h-8"/>
            </button>
        </div>
    );
};


export default MessageInput;