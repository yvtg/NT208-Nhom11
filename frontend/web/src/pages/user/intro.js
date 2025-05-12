import React, { useEffect, useState } from "react";
import DefaultNavbar from "../../components/DefaultNavbar";
import Banner from "../../components/Banner";
import ChatIcon from "../../components/ChatIcon";
import Searchbar from "../../components/Searchbar";
import UserInfo from "../../components/UserInfo";
import UserContactBox from "../../components/UserContactBox";
import axios from "axios";

const IntroPage = () => {
    const [user, setUser] = useState(null);
    const userId = 1; 
    const token = localStorage.getItem("token");

    useEffect(() => {
        axios.get(`/api/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    }, [userId]);

    return (
        <div className="min-h-screen bg-gray-100">
            <DefaultNavbar />
            <div className="relative w-full h-[220px]">
                <Banner />
                <div className="absolute top-3 right-10">
                    <Searchbar />
                </div>
            </div>
            <div className="flex gap-8 px-16 ">
                <div className="flex-1 bg-white rounded-2xl shadow-lg p-10 min-h-[350px] flex flex-col pt-24 ">
                    <UserInfo
                        username={user?.username || "Username"}
                        title={user?.title || "Title"}
                        email={user?.email || "email@gmail.com"}
                        avatar={user?.avatarurl || undefined}
                        rating={user?.rating || 0}
                    />
                    <div className="border-b border-gray-300 my-6" />
                    <div className="text-sm text-gray-700 pl-2">
                        <p>{user?.introduce }</p>
                    </div>
                </div>
                <div className="w-[350px] flex-shrink-0 pt-24 ">
                    <UserContactBox
                        phone={user?.phonenumber || "+84 123 456 789"}
                        email={user?.email || "email@gmail.com"}
                        linkedin={user?.linkedin || "username"}
                    />
                </div>
            </div>
            <ChatIcon />
        </div>
    );
};

export default IntroPage;
