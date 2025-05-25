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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const toggleChat = () => {
        setIsOpen(prev => !prev);
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
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
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: 'Xin lỗi, tôi đang gặp một số vấn đề kỹ thuật. Vui lòng thử lại sau.' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Chat Icon */}
            <ChatIcon className="w-6 h-6 text-primary-500" onClick={() => setIsOpen(true)} />

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-20 right-4 w-80 h-[450px] bg-white rounded-lg shadow-xl flex flex-col z-40">
                    {/* Header */}
                    <div className="p-3 bg-primary-500 text-white rounded-t-lg flex justify-between items-center">
                        <h3 className="font-semibold text-sm">SkillLink AI Assistant</h3>
                        <button 
                            onClick={toggleChat}
                            className="hover:text-gray-200 transition-colors"
                        >
                            <IoClose size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-lg p-2 text-sm ${
                                        message.role === 'user'
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 rounded-lg p-2 text-sm">
                                    <div className="flex space-x-1">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100" />
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-2 border-t border-gray-200">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Nhập tin nhắn..."
                                className="flex-1 p-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading}
                                className="p-1.5 bg-primary-500 text-black rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
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