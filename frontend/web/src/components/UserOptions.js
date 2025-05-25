import { useState, useEffect } from "react";
import TertiaryButton from "./TertiaryButton";
import { useNavigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import { getCurrentUser } from '../api/userAPI';

const CACHE_KEY = 'user_data_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

const UserOptions = ({ onLogout }) => {
    const [language, setLanguage] = useState("English");
    const [currency, setCurrency] = useState("$USD");
    const [showLanguageOptions, setShowLanguageOptions] = useState(false);
    const [showCurrencyOptions, setShowCurrencyOptions] = useState(false);
    const { userID, isLoading } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();

    // Hàm lấy dữ liệu từ cache
    const getCachedData = () => {
        try {
            const cachedData = localStorage.getItem(CACHE_KEY);
            if (!cachedData) return null;

            const { data, timestamp } = JSON.parse(cachedData);
            const isExpired = Date.now() - timestamp > CACHE_DURATION;

            if (isExpired) {
                localStorage.removeItem(CACHE_KEY);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Error reading cache:', error);
            return null;
        }
    };

    // Hàm lưu dữ liệu vào cache
    const setCachedData = (data) => {
        try {
            const cacheData = {
                data,
                timestamp: Date.now()
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        } catch (error) {
            console.error('Error saving to cache:', error);
        }
    };

    // Hàm xóa cache
    const clearCache = () => {
        try {
            localStorage.removeItem(CACHE_KEY);
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                
                // Kiểm tra cache trước
                const cachedData = getCachedData();
                if (cachedData) {
                    setUserData(cachedData);
                    setLoading(false);
                    return;
                }

                // Nếu không có cache, gọi API
                const data = await getCurrentUser();
                setUserData(data);
                setCachedData(data); // Lưu vào cache
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();

        return () => {
        };
    }, []);

    // Hàm refresh data
    const refreshUserData = async () => {
        try {
            setLoading(true);
            const data = await getCurrentUser();
            setUserData(data);
            setCachedData(data);
            setError(null);
        } catch (error) {
            console.error("Error refreshing user data:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="absolute top-[56px] right-4 shadow-md w-60 bg-white rounded-lg border border-divideColor p-4 z-40">
            {/* User avatar */}
            <div className="flex items-center gap-6 p-4 border-b-2 border-divideColor">
                <img
                    src={userData?.avatarurl || "/images/avatar.png"}
                    alt="Ảnh đại diện"
                    className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                />
                <div>
                    <p>{userData?.username || "Loading..."}</p>
                    <p>{userData?.email || "Loading..."}</p>
                </div>
            </div>

            {/* Profile + Setting */}
            <div className="p-4 border-b-2 border-divideColor">
                <a href={"/users/" + userID}>
                    <p className="text-secondaryText text-lg hover:bg-gray-100 hover:text-PrimaryText rounded-md">Tài khoản</p>
                </a>
                <a href="/settings/change-profile">
                    <p className="text-secondaryText text-lg hover:bg-gray-100 hover:text-PrimaryText rounded-md">Cài đặt</p>
                </a>
            </div>

            {/* Language + Currency */}
            <div className="p-4 border-b-2 border-divideColor">
                <div onClick={() => setShowLanguageOptions(!showLanguageOptions)} className="cursor-pointer">
                    <p className="text-secondaryText text-lg hover:bg-gray-100 hover:text-PrimaryText rounded-md">{language}</p>
                    {showLanguageOptions && (
                        <div>
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => setLanguage("English")}>
                                Tiếng anh
                            </button>
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => setLanguage("Vietnamese")}>
                                Tiếng việt
                            </button>
                        </div>
                    )}
                </div>

                <div onClick={() => setShowCurrencyOptions(!showCurrencyOptions)} className="cursor-pointer">
                    <p className="text-secondaryText text-lg hover:bg-gray-100 hover:text-PrimaryText rounded-md">{currency}</p>
                    {showCurrencyOptions && (
                        <div>
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => setCurrency("$USD")}>
                                $USD
                            </button>
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => setCurrency("₫VNĐ")}>
                                ₫VNĐ
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Logout */}
            <div className="p-4 cursor-pointer">
                <TertiaryButton onClick={onLogout}>Đăng xuất</TertiaryButton>
            </div>
        </div>
    );
};

export default UserOptions;
