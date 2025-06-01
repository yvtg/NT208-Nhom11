import { useState, useRef, useEffect } from 'react';
import { IoIosSend } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import ChatIcon from "../components/ChatIcon";

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Xin chào! Tôi là trợ lý AI của SkillLink. Tôi có thể giúp gì cho bạn?' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const chatWindowRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const toggleChat = () => {
        setIsOpen(prev => !prev);
        if (!isOpen) {
            setTimeout(scrollToBottom, 100);
        }
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');
        
        // Thêm tin nhắn người dùng ngay lập tức
        setMessages(prev => [...prev, { 
            role: 'user', 
            content: userMessage,
            timestamp: new Date().toISOString()
        }]);
        
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response from chatbot');
            }

            const data = await response.json();
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: data.response,
                timestamp: new Date().toISOString()
            }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: 'Xin lỗi, tôi đang gặp một số vấn đề kỹ thuật. Vui lòng thử lại sau.',
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ChatIcon 
                className="w-6 h-6 text-primary-500 cursor-pointer hover:text-primary-600 transition-colors" 
                onClick={toggleChat} 
            />

            {isOpen && (
                <div 
                    ref={chatWindowRef}
                    className="fixed bottom-20 right-4 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col z-40"
                >
                    <div className="p-3 bg-primary-500 text-black rounded-t-lg flex justify-between items-center">
                        <h3 className="font-semibold">Trợ lý AI SkillLink </h3>
                        <button 
                            onClick={toggleChat}
                            className="hover:text-gray-200 transition-colors p-1"
                        >
                            <IoClose size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl p-3 ${
                                        message.role === 'user'
                                            ? 'bg-primary-500 text-black ml-4'
                                            : 'bg-white text-gray-800 shadow-sm mr-4'
                                    }`}
                                >
                                    <div className="text-sm whitespace-pre-wrap break-words">
                                        {message.content}
                                    </div>
                                    <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-primary-100' : 'text-gray-500'}`}>
                                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white rounded-2xl p-3 shadow-sm">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 border-t border-gray-200 bg-white">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                                placeholder="Nhập tin nhắn..."
                                className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading || !inputMessage.trim()}
                                className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <IoIosSend size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBot; 