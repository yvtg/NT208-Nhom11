import { useNavigate, useLocation } from "react-router-dom";

const SettingBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Xác định tab hiện tại dựa trên đường dẫn
    const isActive = (path) => location.pathname === path;

    return (
        <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[50%] max-w-lg
            mx-auto border-b border-gray-300 bg-gray-50 rounded-md 
            p-2 sm:p-4 flex justify-between fixed top-16
            left-1/2 -translate-x-1/2 z-40">
            <button
                className={`px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base whitespace-nowrap
                    ${isActive("/settings/change-profile") 
                        ? "text-darkPrimary font-semibold border-b-2 border-darkPrimary" 
                        : "text-gray-400 hover:text-gray-600 transition-colors"}`}
                onClick={() => navigate("/settings/change-profile")}
            >
                Tài khoản
            </button>
            <button
                className={`px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base whitespace-nowrap
                    ${isActive("/settings/change-cv") 
                        ? "text-darkPrimary font-semibold border-b-2 border-darkPrimary" 
                        : "text-gray-400 hover:text-gray-600 transition-colors"}`}
                onClick={() => navigate("/settings/change-cv")}
            >
                CV
            </button>
            <button
                className={`px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base whitespace-nowrap
                    ${isActive("/settings/change-password") 
                        ? "text-darkPrimary font-semibold border-b-2 border-darkPrimary" 
                        : "text-gray-400 hover:text-gray-600 transition-colors"}`}
                onClick={() => navigate("/settings/change-password")}
            >
                Đổi mật khẩu
            </button>
        </div>
    );
};

export default SettingBar;
