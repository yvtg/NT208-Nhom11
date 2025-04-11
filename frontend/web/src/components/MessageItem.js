// components/MessageItem.jsx
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';
import useAuth from '../hooks/useAuth';

dayjs.extend(relativeTime);
dayjs.locale('en');


const MessageItem = ({ message }) => {
  const { userID, isLoading } = useAuth();
  const isCurrentUser = message.SenderID === userID;
  
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4 px-4 lg:px-12`}>
      {/* Container tin nhắn */}
      <div className={`flex max-w-xs lg:max-w-md ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
        {/* Avatar (ẩn với tin nhắn của current user) */}
        {!isCurrentUser && (
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center mr-2 mt-1">
            {message.SenderName?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}

        {/* Nội dung tin nhắn */}
        <div>
          {/* Tên người gửi (chỉ hiện với tin nhắn người khác) */}
          {!isCurrentUser && (
            <div className="text-xs font-medium text-gray-500 mb-1 ml-1">
              {message.SenderName}
            </div>
          )}

          {/* Bubble tin nhắn */}
          <div
            className={`px-4 py-2 rounded-lg ${
              isCurrentUser
                ? 'bg-Primary text-white rounded-tr-none'
                : 'bg-gray-200 text-gray-800 rounded-tl-none'
            }`}
          >
            <p className="text-sm">{message.Content}</p>
          </div>

          {/* Thời gian */}
          <div
            className={`text-xs mt-1 ${
              isCurrentUser ? 'text-right text-gray-500' : 'text-left text-gray-400'
            }`}
          >
            {dayjs(message.CreatedAt).fromNow()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;