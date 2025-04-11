import { IoDocumentAttachOutline } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import { useState } from "react";

const MessageInput = ({ conversationID, socket, refreshMessages }) => {

    // nội dung đang gõ
    const [inputMessage, setInputMessage] = useState("");

    const handleSendMessages = async () => {
        if (!inputMessage.trim()) return;

        try {
            const newMessage = {
                conversationID,
                content: inputMessage,
            };

            socket.current.emit("sendMessage", newMessage);
            setInputMessage(""); // xóa nội dung đang gõ
            refreshMessages();
        } catch (error) {
            alert(error);
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
            />

            {/* Gửi tin nhắn */}
            <button className="p-2 text-Primary hover:text-darkPrimary hover:shadow-md" onClick={handleSendMessages}>
                <IoIosSend className="w-8 h-8"/>
            </button>
        </div>
    );
};


export default MessageInput;