import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa"; 

const UserInfo = ({ username, title, email, avatar, rating }) => {
    return (
        <div className="flex items-center gap-8">
            <div className="relative">
                <img
                    src={avatar || "/images/avatar.png"}
                    alt="avatar"
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg bg-gray-200"
                />
            </div>
            <div className="flex flex-col justify-center">
                <div className="text-2xl font-bold mb-1">{username}</div>
                <div className="text-lg text-gray-600 mb-1">{title}</div>
                <div className="text-sm text-green-500 mb-4">● last online: 01/01/2025</div>
                <div className="flex gap-2 mt-2">
                    <button className="border-b-2 border-black px-2 pb-1 font-semibold">Giới thiệu</button>
                    <button className="text-gray-400 px-2 pb-1">Kỹ năng</button>
                    <button className="text-gray-400 px-2 pb-1">Công việc đã đăng</button>
                    <button className="text-gray-400 px-2 pb-1">Công việc đã hoàn thành</button>
                    <button className="text-gray-400 px-2 pb-1">CV</button>
                </div>
            </div>

            <div className="flex items-center mt-4">
                {Array.from({ length: 5 }, (_, index) => (
                    index < rating ? (
                        <FaStar key={index} className="text-yellow-400 text-lg" />
                    ) : (
                        <FaRegStar key={index} className="text-gray-400 text-lg" />
                    )
                ))}
            </div>
        </div>
    );
};

export default UserInfo;
