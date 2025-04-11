import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { FaInfoCircle } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";

import DefaultNavbar from "../components/DefaultNavbar";
import MessageComponent from "../components/MessageComponent";
import MessageInput from "../components/MessageInput";


import useSocket from "../hooks/useSocket";
import useConversations from "../hooks/useConversations";
import useMessages from "../hooks/useMessages";
import useDeleteConversation from "../hooks/useDeleteConversation";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi'; 

dayjs.extend(relativeTime);
dayjs.locale('vi'); 

const Message = ( { onLogout }) => {

    const { deleteConversation, deleteLoading, deleteError } = useDeleteConversation();

    
    // conversation
    const { id } = useParams(); // id = conversationID trên URL
    const [conversationID, setConversationID] = useState(Number(id) || null);
    console.log("----------", conversationID)
    const [showConversations] = useState(true);
    const { conversations, conversationLoading, conversationError, conversationRefresh } = useConversations(showConversations);
    
    // messages
    const { messages, messagesLoading, messagesError, refreshMessages, setMessages } = useMessages(conversationID);
    
    
    const navigate = useNavigate();
    
    // khởi tạo socket
    const socket = useSocket();
    
    // lấy cuộc hội thoại đang chọn
    const selectedConversation = conversations.find(
        (conv) => conv.ConversationID === Number(conversationID)
    ) || conversations[conversationID];
    
    // xóa cuộc hội thoại
    const handleDelete = async () => {
        const confirmed = window.confirm("Bạn có chắc muốn xoá cuộc hội thoại này?");
        if (!confirmed) return;

        const result = await deleteConversation(conversationID);
        if (result) {
            // Làm gì đó sau khi xoá, ví dụ: reload danh sách
            conversationRefresh();
        }
    };

    console.log("selected Conversation +++", selectedConversation)


    return (
        <div className="relative flex flex-col min-h-screen bg-gray-100">
            <DefaultNavbar className="fixed top-0 left-0 right-0 z-50" onLogout={onLogout} />


            <div className="flex h-screen">
                {/* Sidebar conversation */}
                <div className="pt-3 w-1/4 bg-white border-r border-gray-200 flex flex-col h-screen overflow-y-auto">
                    
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
                                        <div className="flex-shrink-0 mr-3">
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
                                                {conversation.AvatarURL ? (
                                                    //TODO: lỗi chỗ avatar
                                                    <img
                                                        src={conversation.AvatarURL}
                                                        alt={conversation.ConversationName || "Ảnh đại diện"}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span>{conversation.ConversationName?.charAt(0).toUpperCase() || '?'}</span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="text-lg font-medium text-gray-900 truncate">
                                                    {conversation.ConversationName}
                                                </h3>
                                                <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                                    {dayjs(conversation.CreatedAt).add(7, 'hour').fromNow()}
                                                </span>
                                            </div>
                                            
                                            <p className="text-md text-gray-500 truncate mt-1">
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
                    {/* Khung info người chat */}
                    {selectedConversation ? (
                        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between space-x-4">
                            {/* Avatar */}
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
                                {selectedConversation.AvatarURL ? (
                                    <img
                                    src={selectedConversation.AvatarURL}
                                    alt={selectedConversation.ConversationName || "Ảnh đại diện"}
                                    className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span>
                                    {selectedConversation.ConversationName?.charAt(0).toUpperCase() || "?"}
                                    </span>
                                )}
                                </div>
                                {/* Name */}
                                <h2 className="text-lg font-semibold text-gray-800">
                                {selectedConversation.ConversationName || "Người dùng"}
                                </h2>
                            </div>
                            {/* Tùy chọn */}
                            <div className="flex">
                                {/* xóa tin nhắn */}
                                <MdDeleteSweep className="text-2xl text-red-500 cursor-pointer hover:text-red-300 mr-4"
                                                onClick={handleDelete} />
                                {/* xem trang cá nhân  */}
                                <FaInfoCircle className="text-2xl text-darkPrimary cursor-pointer hover:text-lightPrimary mr-4" />
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border-b border-gray-200 p-4">
                            <p className="text-gray-500">Chọn một cuộc trò chuyện để bắt đầu</p>
                        </div>
                    )}
                    
                    {/* Khu vực hiển thị tin nhắn */}
                    <div className="flex-1 bg-white overflow-y-auto pb-4 px-4">
                        {selectedConversation ?
                            <MessageComponent 
                                conversationID={conversationID}
                                socket={socket}
                                messages={messages}
                                loading={messagesLoading}
                                error={messagesError}
                                refreshMessages={refreshMessages}
                                setMessages={setMessages}
                                avatarURL={selectedConversation.AvatarURL || ""}
                                conversationName={selectedConversation.ConversationName || ""}
                            /> : <></>
                        }
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
