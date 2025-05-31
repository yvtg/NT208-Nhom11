import React from "react";
import { useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar } from "react-icons/fa"; 

const UserInfo = ({ username, title, email, avatar, rating, userID }) => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={() => navigate(`/users/${userID}`)}>
            <div className="relative flex-shrink-0">
                <img
                src={avatar || "/images/avatar.png"}
                alt="avatar"
                className="w-24 h-24 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-md bg-gray-100"
                />
            </div>
            <div className="flex flex-col justify-center text-center sm:text-left">
                <h2 className="text-3xl sm:text-2xl font-semibold text-gray-900 mb-1">{username}</h2>
                <p className="text-gray-600 mb-1 text-sm sm:text-base">{email}</p>
                <p className="text-lg sm:text-base text-indigo-600 font-medium">{title}</p>
            </div>
        </div>
    );
};

export default UserInfo;
