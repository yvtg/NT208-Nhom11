import React, { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useParams } from "react-router-dom";
import useUserProfile from "../hooks/useUserProfile";

const ProfileBar = ({ username, email, avatar, rating = "0" }) => {
    const { userId } = useParams();
    const [activeTab, setActiveTab] = useState('introduce');
    const { userData, loading, error, updateUserSection } = useUserProfile(userId);
    
    console.log("User Data:", JSON.stringify(userData, null, 2));

    const renderTabContent = () => {
        if (loading) {
            return (
                <div className="mt-4 p-4 bg-white rounded-lg shadow animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/4"></div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="mt-4 p-4 bg-red-50 rounded-lg shadow">
                    <p className="text-red-600">{error}</p>
                </div>
            );
        }

        switch (activeTab) {
            case 'introduce':
                return (
                    <div className="mt-4 p-4 bg-white rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Giới thiệu</h3>
                        <p className="text-gray-600">{userData.introduce || 'No introduction available.'}</p>
                    </div>
                );
            case 'skill':
                return (
                    <div className="mt-4 p-4 bg-white rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Kỹ năng</h3>
                        {userData.skills && userData.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {userData.skills.map((skill, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">Chưa có kỹ năng nào.</p>
                        )}
                    </div>
                );
            case 'jobPosted':
                return (
                    <div className="mt-4 p-4 bg-white rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Dự án đã đăng</h3>
                        {userData.postedJobs && userData.postedJobs.length > 0 ? (
                            <div className="space-y-4">
                                {userData.postedJobs.map((job) => (
                                    <div key={job.id} className="border-b pb-4 last:border-b-0">
                                        <h4 className="font-medium">{job.title}</h4>
                                        <p className="text-sm text-gray-600">{job.description}</p>
                                        <div className="text-sm text-gray-500 mt-1">
                                            Posted: {new Date(job.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">Chưa có dự án nào.</p>
                        )}
                    </div>
                );
            case 'jobFinished':
                return (
                    <div className="mt-4 p-4 bg-white rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Dự án đã hoàn thành</h3>
                        {userData.completedJobs && userData.completedJobs.length > 0 ? (
                            <div className="space-y-4">
                                {userData.completedJobs.map((job) => (
                                    <div key={job.id} className="border-b pb-4 last:border-b-0">
                                        <h4 className="font-medium">{job.title}</h4>
                                        <p className="text-sm text-gray-600">{job.description}</p>
                                        <div className="text-sm text-gray-500 mt-1">
                                            Completed: {new Date(job.completedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">Chưa có dự án nào.</p>
                        )}
                    </div>
                );
            case 'cv':
                return (
                    <div className="mt-4 p-4 bg-white rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">CV</h3>
                        {userData.cv ? (
                            <div>
                                <a 
                                    href={userData.cv.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 underline"
                                >
                                    Xem CV
                                </a>
                            </div>
                        ) : (
                            <p className="text-gray-600">Chưa tải CV lên.</p>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-8 animate-pulse">
                <div className="flex items-center gap-8">
                    <div className="w-40 h-40 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 rounded-lg shadow">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }
    const displayUsername = username || userData?.username;
    const displayEmail = email || userData?.email;
    const displayAvatar = avatar || userData?.avatar || "/images/avatar.png";
    const displayRating = rating || userData?.rating || 0;

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center gap-8">
                <div className="relative">
                    <img
                        src={displayAvatar}
                        alt="avatar"
                        className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg bg-gray-200"
                    />
                    {userData?.isOnline && (
                        <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                </div>
                <div className="flex flex-col justify-center">
                    <div className="text-2xl font-bold mb-1">{displayUsername}</div>
                    <div className="text-lg text-gray-600 mb-1">{userData?.title}</div>
                    <div className={`text-sm ${userData?.isOnline ? 'text-green-500' : 'text-gray-500'} mb-4`}>
                        ● {userData?.isOnline ? 'Online' : 'Offline'}
                    </div>
                    <div className="flex gap-2 mt-2">
                        <button 
                            onClick={() => setActiveTab('introduce')}
                            className={`px-2 pb-1 font-semibold ${activeTab === 'introduce' ? 'border-b-2 border-black' : 'text-gray-400'}`}
                        >
                            Giới thiệu
                        </button>
                        <button 
                            onClick={() => setActiveTab('skill')}
                            className={`px-2 pb-1 font-semibold ${activeTab === 'skill' ? 'border-b-2 border-black' : 'text-gray-400'}`}
                        >
                            Kỹ năng
                        </button>
                        <button 
                            onClick={() => setActiveTab('jobPosted')}
                            className={`px-2 pb-1 font-semibold ${activeTab === 'jobPosted' ? 'border-b-2 border-black' : 'text-gray-400'}`}
                        >
                            Dự án đã đăng
                        </button>
                        <button 
                            onClick={() => setActiveTab('jobFinished')}
                            className={`px-2 pb-1 font-semibold ${activeTab === 'jobFinished' ? 'border-b-2 border-black' : 'text-gray-400'}`}
                        >
                            Dự án đã hoàn thành
                        </button>
                        <button 
                            onClick={() => setActiveTab('cv')}
                            className={`px-2 pb-1 font-semibold ${activeTab === 'cv' ? 'border-b-2 border-black' : 'text-gray-400'}`}
                        >
                            CV
                        </button>
                    </div>
                </div>
                
                {/* <div className="flex items-center mt-4">
                    {Array.from({ length: 5 }, (_, index) => (
                        index < displayRating ? (
                            <FaStar key={index} className="text-yellow-400 text-lg" />
                        ) : (
                            <FaRegStar key={index} className="text-gray-400 text-lg" />
                        )
                    ))}
                </div> */}
            </div>
            
            {renderTabContent()}
        </div>
    );
};

export default ProfileBar;
