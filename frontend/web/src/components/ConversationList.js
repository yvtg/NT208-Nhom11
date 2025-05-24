/**
 * hiển thị danh sách tin nhắn
**/
import { timeFromNow, formatTime } from '../utils/dayjs';
import useAuth from '../hooks/useAuth';
import Spinner from './Spinner';

const ConversationList = ({ conversations, onSelectConversation }) => {
    console.log(conversations)
    const { userID, isLoading } = useAuth();
    return (
        <div className="absolute top-[56px] right-20 shadow-lg w-64 bg-white rounded-lg border border-gray-200 p-2 z-40">
            {isLoading ? <Spinner /> : <></>}
            {conversations.map((conversation, index) => (
                <div
                    key={conversation.conversationid || index}
                    className="conversation-item p-3 hover:bg-gray-50 cursor-pointer rounded-md transition-colors duration-150"
                    onClick={() => onSelectConversation(conversation.conversationid)}
                >
                    <div className="flex items-start">
                        {/* Avatar */}
                        <div className="flex-shrink-0 mr-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
                                {conversation.avatarurl ? (
                                    //TODO: lỗi chỗ avatar
                                    <img
                                        src={conversation.avatarurl}
                                        alt={conversation.conversationname || "Ảnh đại diện"}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span>{conversation.conversationname?.charAt(0).toUpperCase() || '?'}</span>
                                )}
                            </div>
                        </div>
                        {/* Nội dung */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <div className="conversation-name font-medium text-gray-900 truncate max-w-[180px]">
                                    {/* Tên cuộc hội thoại */}
                                    {conversation.conversationname}
                                </div>
                                <div className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                                    {timeFromNow(conversation.lastmessagetime)}
                                </div>
                            </div>
                            {/* Tin nhắn gần đây nhất */}
                            <div className="conversation-last-message text-sm text-gray-500 mt-1 truncate">
                                <span>{conversation.senderid===userID?"Bạn: ":""}</span>
                                {conversation.lastmessage}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ConversationList;
