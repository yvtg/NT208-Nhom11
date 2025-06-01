//TODO: còn lỗi khi click chỗ khác thì mấy ô dropdown ko mất đi

import { FaSearch, FaBell, FaUserCircle, FaPaperPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useRef } from "react";
import { HiMenu, HiX } from "react-icons/hi";

import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import TertiaryButton from "./TertiaryButton";
import UserOptions from "./UserOptions";
import ConversationList from "./ConversationList"
import useConversations from "../hooks/useConversations"
import Spinner from "./Spinner";
import Searchbar from "./Searchbar";

const DefaultNavbar = ({ className, onLogout  }) => {
    const navigate = useNavigate();
    // khi click vào avatar
    const [showOption, setShowOption] = useState(false);
    // khi click vào icon tin nhắn
    const [showConversation, setShowConversation] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { conversations, loading, error, refresh } = useConversations(showConversation);

    // dropdown
    const optionRef = useRef(null);
    const conversationRef = useRef(null);
    const menuRef = useRef(null);
    
    const toggleOption = () => setShowOption(!showOption);
    const toggleConversation = () => setShowConversation(!showConversation);

    // click chuột ra ngoài -> tắt dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (optionRef.current && !optionRef.current.contains(e.target)) {
                setShowOption(false);
            }

            if (conversationRef.current && !conversationRef.current.contains(e.target)) {
                setShowConversation(false);
            }

            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (error) return <div>Lỗi: {error}</div>;

    return (
        <div className={className}>
            {loading?<Spinner /> : <></>}
            <nav className="bg-lightPrimary shadow-md py-2 sm:px-2 lg:px-10 flex flex-col md:flex-row justify-between items-center rounded-lg fixed top-0 left-0 w-full z-50">
                {/* Top section - Logo and Icons */}
                <div className="w-full md:w-auto flex justify-between items-center px-4 md:px-0">
                    {/* Logo */}
                    <div className="text-2xl text-darkPrimary lobster font-lobster cursor-pointer" 
                        onClick={() => navigate("/dashboard")}
                    >
                        SkillLink
                    </div>

                    {/* Mobile Icons */}
                    <div className="flex items-center space-x-4 md:hidden">
                        <FaPaperPlane 
                            onClick={toggleConversation} 
                            className="text-2xl text-darkPrimary cursor-pointer hover:text-lightPrimary" 
                        />
                        <FaBell className="text-2xl cursor-pointer text-darkPrimary hover:text-lightPrimary" />
                        <FaUserCircle 
                            onClick={toggleOption} 
                            className="text-2xl text-darkPrimary cursor-pointer hover:text-lightPrimary" 
                        />
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-darkPrimary hover:text-lightPrimary"
                        >
                            {isMenuOpen ? (
                                <HiX className="h-6 w-6" />
                            ) : (
                                <HiMenu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Desktop Search and Menu */}
                <div className="hidden md:flex items-center justify-center flex-1 max-w-3xl mx-8">
                    <Searchbar />
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6 text-darkPrimary font-semibold">
                    <a href="/dashboard">
                        <TertiaryButton>Trang chủ</TertiaryButton>
                    </a>
                    <a href="/check-cv">
                        <SecondaryButton>Kiểm tra CV</SecondaryButton>
                    </a>
                    <a href="/jobs/post">
                        <PrimaryButton>Đăng dự án</PrimaryButton>
                    </a>

                    {/* Desktop Icons */}
                    <div className="flex space-x-3 items-center">
                        <FaPaperPlane 
                            onClick={toggleConversation} 
                            className="text-2xl text-darkPrimary cursor-pointer hover:text-lightPrimary" 
                        />
                        <FaBell className="text-2xl cursor-pointer text-darkPrimary hover:text-lightPrimary" />
                        <FaUserCircle 
                            onClick={toggleOption} 
                            className="text-2xl text-darkPrimary cursor-pointer hover:text-lightPrimary" 
                        />
                    </div>
                </div>

                {/* Mobile Menu */}
                <div 
                    ref={menuRef}
                    className={`md:hidden w-full bg-white shadow-lg ${isMenuOpen ? 'block' : 'hidden'}`}
                >
                    <div className="px-4 py-3 border-b border-gray-200">
                        <Searchbar />
                    </div>
                    <div className="flex flex-col space-y-2 px-4 py-3">
                        <a href="/dashboard" className="w-full">
                            <TertiaryButton className="w-full justify-center">Trang chủ</TertiaryButton>
                        </a>
                        <a href="/check-cv" className="w-full">
                            <SecondaryButton className="w-full justify-center">Kiểm tra CV</SecondaryButton>
                        </a>
                        <a href="/jobs/post" className="w-full">
                            <PrimaryButton className="w-full justify-center">Đăng dự án</PrimaryButton>
                        </a>
                    </div>
                </div>
            </nav>

            {/* Option */}
            {showOption && (
                <div ref={optionRef} className="absolute right-4 z-50">
                    <UserOptions onLogout={onLogout} />
                </div>
            )}

            {/* Danh sách tin nhắn */}
            {showConversation && (
                <div ref={conversationRef} className="absolute right-4 z-50">
                    {conversations && conversations.length > 0 ? (
                        <ConversationList
                            conversations={conversations}
                            onSelectConversation={(id) => navigate('/messages/'+id)}
                        />
                    ) : (
                        <div className="absolute top-[56px] right-20 shadow-lg w-64 bg-white rounded-lg border border-gray-200 p-4 z-40 text-center">
                            <p className="text-gray-600">Chưa có tin nhắn nào</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DefaultNavbar;
