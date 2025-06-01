import React from "react";
import DefaultNavbar from "../../components/DefaultNavbar";
import Banner from "../../components/Banner";
import ChatIcon from "../../components/ChatIcon";
import Searchbar from "../../components/Searchbar";
import ProfileBar from "../../components/ProfileBar";
import UserContactBox from "../../components/UserContactBox";
import useUserProfile from "../../hooks/useUserProfile";
import { useParams } from "react-router-dom";

const IntroPage = ({onLogout}) => {
  const { userId } = useParams();
  const { userData, loading, error } = useUserProfile(userId);

  return (
    <div className="min-h-screen bg-gray-100">
      <DefaultNavbar onLogout={onLogout} />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Profile Section */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="sticky top-24">
              <ProfileBar />
            </div>
          </div>

          {/* Contact Section*/}
          <div className="lg:col-span-1 w-full">
            <div className="sticky top-24">
              <UserContactBox
                phone={userData?.phonenumber}
                email={userData?.email}
              />
            </div>
          </div>
        </div>
      </div>

      <ChatIcon />
    </div>
  );
};

export default IntroPage;
