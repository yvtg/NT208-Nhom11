import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

import { useNavigate } from "react-router-dom";

const StartNavbar = () => {

    const navigate = useNavigate();

    return (
        <nav className="bg-white shadow-md py-2 sm:px-2 lg:px-10 flex justify-between items-center rounded-lg fixed top-0 left-0 w-full z-50">
            {/* Logo */}
            <div className="text-2xl text-darkPrimary lobster font-lobster cursor-pointer" onClick={() => navigate("/")}>SkillLink</div>
            
            {/* Searchbar + Buttons */}
            <div className="hidden md:flex ">
                
                {/* Nút đăng nhập / đăng ký */}
                <div className="space-x-2">
                    <SecondaryButton className="px-4" onClick={() => navigate("/login")}>Sign in</SecondaryButton>
                    <PrimaryButton className="px-4" onClick={() => navigate("/signup")}>Sign up</PrimaryButton>
                </div>
            </div>
        </nav>
    );
};

export default StartNavbar;
