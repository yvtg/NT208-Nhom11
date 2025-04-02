import DefaultNavbar from "../components/DefaultNavbar";
import Searchbar from "../components/Searchbar";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";

import { useRef, useEffect, useState } from "react";

const Message = () => {
    // danh sach tin nhan
    const messages = [
        { id: 1, name: 'ten', message: 'tin nhannnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn' },
    ];

    // Trạng thái cho tin nhắn trong khung tin nhắn
    const [chatMessages, setChatMessages] = useState([
        { id: 1, sender: "ten", content: "Xin chào!", isSent: false },
        { id: 2, sender: "me", content: "Chào bạn!", isSent: true },
    ]);

    // Trạng thái cho tin nhắn mới
    const [newMessage, setNewMessage] = useState("");

    // Ref để cuộn tự động đến tin nhắn mới nhất
    const messagesEndRef = useRef(null);

    // Hàm cuộn tự động đến tin nhắn mới nhất
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Cuộn tự động mỗi khi danh sách tin nhắn thay đổi
    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    // Hàm xử lý gửi tin nhắn
    const handleSendMessage = () => {
        if (newMessage.trim() === "") return; // Không gửi nếu tin nhắn rỗng

        const newMsg = {
        id: chatMessages.length + 1,
        sender: "me",
        content: newMessage,
        isSent: true,
        };

        setChatMessages([...chatMessages, newMsg]);
        setNewMessage(""); // Xóa ô nhập liệu sau khi gửi
    };

    // Xử lý gửi tin nhắn khi nhấn Enter
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
        handleSendMessage();
        }
    };

    return (
        <div className="relative flex flex-col min-h-screen bg-gray-100">
            <DefaultNavbar className="fixed top-0 left-0 right-0 z-50" />


            <div className="flex h-screen">
                {/* Danh sách tin nhắn */}
                <div className="pt-20 w-1/4 bg-gray-50 border-r border-darkPrimary-300 flex flex col">
                    <div className="flex flex-col h-full">
                        {/* Thanh search */}
                        <div className="w-1/4 p-4 fixed top-16 bg-gray-50 z-40">
                            <Searchbar />
                        </div>
                        
                        {/* Danh sách tin nhắn */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 mt-20">
                        {messages.map((msg) => (
                            <div
                            key={msg.id}
                            className="flex items-center space-x-4 p-3 hover:bg-gray-200 rounded-lg cursor-pointer w-full transition-colors duration-200"
                            >
                            <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-800 truncate">{msg.name}</p>
                                <p className="text-sm text-gray-500 truncate">{msg.message}</p>
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>

                {/* Khung tin nhắn */}
                <div className="w-3/4 flex flex-col pt-16">
                    {/* Khu vực hiển thị tin nhắn (trống) */}
                    <div className="flex-1 bg-white flex flex-col-reverse pb-4 px-4">
                        {chatMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.isSent ? "justify-end" : "justify-start"}`}
                        >
                            <div
                            className={`max-w-xs p-3 rounded-lg ${
                                msg.isSent ? "bg-Primary text-white" : "bg-gray-200 text-gray-800"
                            }`}
                            >
                            <p>{msg.content}</p>
                            </div>
                        </div>
                        ))}

                        {/* Ref để cuộn tự động */}
                        <div ref={messagesEndRef} />
                    </div>

                        {/* Thanh nhập liệu */}
                        <div className="p-4 bg-lightPrimary border-t border-gray-300 flex items-center space-x-2 shadow-sm">
                            <button className="p-2 text-Primary hover:text-darkPrimary hover:shadow-md">
                                <IoDocumentAttachOutline className="w-8 h-8"/>
                            </button>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="flex-1 p-2 rounded-lg border border-Primary focus:outline-none focus:ring-1 focus:ring-darkPrimary"
                            />
                            <button className="p-2 text-Primary hover:text-darkPrimary hover:shadow-md">
                                <IoIosSend className="w-8 h-8"/>
                            </button>
                        </div>
                </div>
            </div>

        </div>
    );
};

export default Message;
