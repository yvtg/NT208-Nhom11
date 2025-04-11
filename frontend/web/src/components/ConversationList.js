/**
 * hiển thị danh sách tin nhắn
**/
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en'; 

dayjs.extend(relativeTime);
dayjs.locale('en'); 

const ConversationList = ({ conversations, onSelectConversation }) => {
    return (
        <div className="absolute top-[56px] right-20 shadow-lg w-64 bg-white rounded-lg border border-gray-200 p-2 z-40">
            {conversations.map((conversation, index) => (
                <div
                    key={conversation.ConversationID || index}
                    className="conversation-item p-3 hover:bg-gray-50 cursor-pointer rounded-md transition-colors duration-150"
                    onClick={() => onSelectConversation(conversation.ConversationID)}
                >
                    <div className="flex justify-between items-start">
                        <div className="conversation-name font-medium text-gray-900 truncate max-w-[180px]">
                            {conversation.SenderName}
                        </div>
                        <div className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                            {dayjs(conversation.CreatedAt).fromNow()}
                        </div>
                    </div>
                    <div className="conversation-last-message text-sm text-gray-500 mt-1 truncate">
                        {conversation.LastMessage}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ConversationList;
