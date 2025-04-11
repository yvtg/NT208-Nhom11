import { LuMessageCircleQuestion } from "react-icons/lu";

const ChatIcon = ({ onClick }) => {
    return(
        <LuMessageCircleQuestion 
            onClick={onClick}
            className="fixed bottom-4 right-4 text-[66px] text-darkPrimary cursor-pointer z-50" />
    );
};

export default ChatIcon;