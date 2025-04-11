import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import DefaultNavbar from "../components/DefaultNavbar";
import Searchbar from "../components/Searchbar";
import MessageComponent from "../components/MessageComponent";
import MessageInput from "../components/MessageInput";

import useSocket from "../hooks/useSocket";
import useConversations from "../hooks/useConversations";
import useMessages from "../hooks/useMessages";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi'; 

dayjs.extend(relativeTime);
dayjs.locale('vi'); 

const Message = () => {

    // conversation
    const { id } = useParams(); // id = conversationID trên URL
    const [conversationID, setConversationID] = useState(id || null);
    const [showConversations] = useState(true);
    const { conversations, conversationLoading, conversationError, conversationRefresh } = useConversations(showConversations);
    
    // messages
    const { messages, messagesLoading, messagesError, refreshMessages, setMessages } = useMessages(conversationID);
    

    const navigate = useNavigate();
    
    // khởi tạo socket
    const socket = useSocket();


    return (
        <div className="relative flex flex-col min-h-screen bg-gray-100">
            <DefaultNavbar className="fixed top-0 left-0 right-0 z-50" />


            <div className="flex h-screen">
                {/* Sidebar conversation */}
                <div className="pt-3 w-1/4 bg-white border-r border-gray-200 flex flex-col h-screen overflow-y-auto">
                    {/* Search bar */}
                    <div className="p-4 sticky top-16 bg-white z-10 border-b border-gray-200">
                        <Searchbar />
                    </div>
                    
                    {/* Conversation list */}
                    <div className="pt-16 flex-1 overflow-y-auto">
                    {conversationLoading ? (
                        <div className="flex justify-center items-center h-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                        </div>
                    ) : conversationError ? (
                        <div className="text-red-500 p-4 text-center">{conversationError}</div>
                    ) : conversations.length === 0 ? (
                        <div className="text-gray-500 p-4 text-center">Không có cuộc trò chuyện nào</div>
                    ) : (
                        conversations.map((conversation) => (
                            <div
                                key={conversation.ConversationID}
                                className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 border-b border-gray-100 ${
                                conversationID === conversation.ConversationID ? 'bg-lightPrimary' : ''
                                }`}
                                onClick={() => {
                                    setConversationID(conversation.ConversationID);
                                    navigate(`/messages/${conversation.ConversationID}`);
                                }}
                            >
                                <div className="flex items-start gap-3">
                                    {/* TODO: nhớ thêm avatar */}
                                    {/* Avatar (thêm vào nếu có) */}
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-darkPrimary">
                                        {conversation.SenderName.charAt(0)}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                                {conversation.SenderName}
                                            </h3>
                                            <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                                {dayjs(conversation.CreatedAt).fromNow()}
                                            </span>
                                        </div>
                                        
                                        <p className="text-sm text-gray-500 truncate mt-1">
                                        {conversation.LastMessage}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

                {/* Khung tin nhắn */}
                <div className="w-3/4 flex flex-col h-screen pt-16">
                    {/* Khu vực hiển thị tin nhắn */}
                    <div className="flex-1 bg-white overflow-y-auto pb-4 px-4">
                        <MessageComponent 
                            conversationID={conversationID}
                            socket={socket}
                            messages={messages}
                            loading={messagesLoading}
                            error={messagesError}
                            refreshMessages={refreshMessages}
                            setMessages={setMessages}
                        />
                    </div>

                    {/* gửi tin nhắn */}
                    <MessageInput
                        conversationID={conversationID}
                        socket={socket}
                        refreshMessages={refreshMessages}
                    />
                </div>
            </div>

        </div>
    );
};

export default Message;
