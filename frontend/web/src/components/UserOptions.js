import { useState } from "react";

const UserOptions = () => {
    const [language, setLanguage] = useState("English");
    const [currency, setCurrency] = useState("$USD");
    const [showLanguageOptions, setShowLanguageOptions] = useState(false);
    const [showCurrencyOptions, setShowCurrencyOptions] = useState(false);

    const userAvatar = "/images/avatar.png";
    const username = "Username";
    const email = "email@gmail.com";

    return (
        <div className="shadow-md w-60 h-90 bg-white shadow-lightPrimary rounded-b-md border-divideColor p-4">
            {/* User avatar */}
            <div className="flex items-center gap-6 p-4 border-b-2 border-divideColor">
                <img
                    src={userAvatar}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                />
                <div>
                    <p>{username}</p>
                    <p>{email}</p>
                </div>
            </div>

            {/* Profile + Setting */}
            <div className="p-4 border-b-2 border-divideColor">
                <a href="/profile">
                    <p className="text-secondaryText text-lg hover:bg-gray-100 hover:text-PrimaryText rounded-md">Profile</p>
                </a>
                <a href="/settings/change-profile">
                    <p className="text-secondaryText text-lg hover:bg-gray-100 hover:text-PrimaryText rounded-md">Setting</p>
                </a>
            </div>

            {/* Language + Currency */}
            <div className="p-4 border-b-2 border-divideColor">
                <div onClick={() => setShowLanguageOptions(!showLanguageOptions)} className="cursor-pointer">
                    <p className="text-secondaryText text-lg hover:bg-gray-100 hover:text-PrimaryText rounded-md">{language}</p>
                    {showLanguageOptions && (
                        <div>
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => setLanguage("English")}>
                                English
                            </button>
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => setLanguage("Vietnamese")}>
                                Vietnamese
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
                <a href="/">
                    <p className="text-secondaryText text-lg hover:bg-gray-100 hover:text-PrimaryText rounded-md">Logout</p>
                </a>
            </div>
        </div>
    );
};

export default UserOptions;
