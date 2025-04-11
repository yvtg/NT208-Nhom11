//TODO: còn lỗi khi click chỗ khác thì mấy ô dropdown ko mất đi

import { FaSearch, FaBell, FaUserCircle, FaPaperPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import TertiaryButton from "./TertiaryButton";
import UserOptions from "./UserOptions";
import ConversationList from "./ConversationList"
import useConversations from "../hooks/useConversations"

const DefaultNavbar = ({ className, onLogout  }) => {
    
    const navigate = useNavigate();
    // khi click vào avatar
    const [showOption, setShowOption] = useState(false);
    // khi click vào icon tin nhắn
    const [showConversation, setShowConversation] = useState(false);
    const { conversations, loading, error, refresh } = useConversations(showConversation);
    
    const toggleOption = () => setShowOption(!showOption);
    const toggleConversation = () => setShowConversation(!showConversation);

    //TODO: nữa chỉnh lại cái loading và error
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={className}>
            <nav className="bg-lightPrimary shadow-md py-2
                sm:px-2 lg:px-10 flex justify-between 
                items-center rounded-lg fixed top-0 left-0 w-full z-50">
        
                {/* Logo */}
                <div className="text-2xl text-darkPrimary lobster  font-lobster 
                cursor-pointer" onClick={() => navigate("/dashboard")}>SkillLink</div>

                {/* Thanh tìm kiếm */}
                <div className="flex-1 lg:mx-6 sm:mx-2 hidden sm:block md:block lg:block">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="SEARCH"
                            className="w-full px-4 py-2 rounded-full shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <FaSearch className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500" />
                    </div>
                </div>

                {/* Menu */}
                <div className="hidden md:flex justify-center space-x-6 text-darkPrimary font-semibold">
                    <a href="/dashboard"><TertiaryButton>Home</TertiaryButton></a>
                    <a href="/check-cv"><SecondaryButton>Check CV</SecondaryButton></a>
                    <a href="/jobs/post"><PrimaryButton>Post</PrimaryButton></a>
                
                        {/* Nút icon */}
                        <div className="flex space-x-3 items-center">
                            <FaPaperPlane onClick={toggleConversation} className=" text-2xl text-darkPrimary cursor-pointer hover:text-lightPrimary" />
                            <FaBell className=" text-2xl cursor-pointer text-darkPrimary hover:text-lightPrimary" />
                            <FaUserCircle onClick={toggleOption} className=" text-2xl text-darkPrimary cursor-pointer hover:text-lightPrimary" />
                        </div>
                
                </div>
            </nav>

            {/* Option */}
            {showOption && (
                <UserOptions onLogout={onLogout} />
            )}

            {/* Danh sách tin nhắn */}
            {showConversation && (
                <ConversationList
                    conversations={conversations}
                    onSelectConversation={(id) => navigate('/messages/'+id)}
                />
            )}

        </div>
    );
};

export default DefaultNavbar;
