import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

const StartNavbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md py-3 px-4 sm:px-6 lg:px-8 fixed top-0 left-0 w-full z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <div 
                    className="text-2xl md:text-3xl text-darkPrimary lobster font-lobster cursor-pointer hover:opacity-80 transition-opacity" 
                    onClick={() => navigate("/")}
                >
                    SkillLink
                </div>
                
                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-4">
                    <SecondaryButton 
                        className="px-6 py-2 text-sm font-medium" 
                        onClick={() => navigate("/login")}
                    >
                        Đăng nhập
                    </SecondaryButton>
                    <PrimaryButton 
                        className="px-6 py-2 text-sm font-medium" 
                        onClick={() => navigate("/signup")}
                    >
                        Đăng ký
                    </PrimaryButton>
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden text-gray-600 hover:text-darkPrimary transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? (
                        <HiX className="h-6 w-6" />
                    ) : (
                        <HiMenu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-2">
                    <div className="flex flex-col space-y-2 px-4">
                        <SecondaryButton 
                            className="w-full justify-center py-2 text-sm font-medium" 
                            onClick={() => {
                                navigate("/login");
                                setIsMenuOpen(false);
                            }}
                        >
                            Đăng nhập
                        </SecondaryButton>
                        <PrimaryButton 
                            className="w-full justify-center py-2 text-sm font-medium" 
                            onClick={() => {
                                navigate("/signup");
                                setIsMenuOpen(false);
                            }}
                        >
                            Đăng ký
                        </PrimaryButton>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default StartNavbar;
