import { useNavigate, useLocation } from "react-router-dom";

const SettingBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Xác định tab hiện tại dựa trên đường dẫn
    const isActive = (path) => location.pathname === path;

    return (
        <div className="w-[50%] max-w-lg
        mx-auto border-b border-gray-300 bg-gray-50 rounded-md 
        p-4 flex justify-between fixed top-16
        left-1/2 -translate-x-1/2">
            <button
                className={`px-4 py-2 ${isActive("/settings/change-profile") ? "text-darkPrimary font-semibold border-b-2 border-darkPrimary " : "text-gray-400"}`}
                onClick={() => navigate("/settings/change-profile")}
            >
                Profile
            </button>
            <button
                className={`px-4 py-2 ${isActive("/settings/change-cv") ? "text-darkPrimary font-semibold border-b-2 border-darkPrimary" : "text-gray-400"}`}
                onClick={() => navigate("/settings/change-cv")}
            >
                CV
            </button>
            <button
                className={`px-4 py-2 ${isActive("/settings/change-password") ? "text-darkPrimary font-semibold border-b-2 border-darkPrimary" : "text-gray-400"}`}
                onClick={() => navigate("/settings/change-password")}
            >
                Change password
            </button>
        </div>
    );
};

export default SettingBar;
