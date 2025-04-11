/**
 * hiển thị danh sách tin nhắn
**/
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi'; 
import useAuth from '../hooks/useAuth';
import Spinner from './Spinner';

dayjs.extend(relativeTime);
dayjs.locale('vi'); 

const ConversationList = ({ conversations, onSelectConversation }) => {
    console.log(conversations)
    const { userID, isLoading } = useAuth();
    return (
        <div className="absolute top-[56px] right-20 shadow-lg w-64 bg-white rounded-lg border border-gray-200 p-2 z-40">
            {isLoading ? <Spinner /> : <></>}
            {conversations.map((conversation, index) => (
                <div
                    key={conversation.ConversationID || index}
                    className="conversation-item p-3 hover:bg-gray-50 cursor-pointer rounded-md transition-colors duration-150"
                    onClick={() => onSelectConversation(conversation.ConversationID)}
                >
                    <div className="flex items-start">
                        {/* Avatar */}
                        <div className="flex-shrink-0 mr-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
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
                        {/* Nội dung */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <div className="conversation-name font-medium text-gray-900 truncate max-w-[180px]">
                                    {/* Tên cuộc hội thoại */}
                                    {conversation.ConversationName}
                                </div>
                                <div className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                                    {dayjs(conversation.CreatedAt).add(7, 'hour').fromNow()}
                                </div>
                            </div>
                            {/* Tin nhắn gần đây nhất */}
                            <div className="conversation-last-message text-sm text-gray-500 mt-1 truncate">
                                <span>{conversation.SenderID===userID?"Bạn: ":""}</span>
                                {conversation.LastMessage}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ConversationList;
