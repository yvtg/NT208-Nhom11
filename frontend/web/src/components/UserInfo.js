import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa"; 

const UserInfo = ({ username, title, email, avatar, rating }) => {
    return (
        <div className="flex items-center gap-8 bg-white p-4 rounded-lg shadow-lg">
            <div className="relative">
                <img
                    src={avatar || "/images/avatar.png"}
                    alt="avatar"
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg bg-gray-200"
                />
            </div>
            <div className="flex flex-col justify-center">
                <div className="text-2xl font-bold mb-1">{username}</div>
                <p>{email}</p>
                <div className="text-lg text-gray-600 mb-1">{title}</div>
            </div>

            {/* <div className="flex items-center mt-4">
                {Array.from({ length: 5 }, (_, index) => (
                    index < rating ? (
                        <FaStar key={index} className="text-yellow-400 text-lg" />
                    ) : (
                        <FaRegStar key={index} className="text-gray-400 text-lg" />
                    )
                ))}
            </div> */}
        </div>
    );
};

export default UserInfo;
