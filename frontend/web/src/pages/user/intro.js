import React from "react";
import DefaultNavbar from "../../components/DefaultNavbar";
import Banner from "../../components/Banner";
import ChatIcon from "../../components/ChatIcon";
import Searchbar from "../../components/Searchbar";
import ProfileBar from "../../components/ProfileBar";
import UserContactBox from "../../components/UserContactBox";
import useUserProfile from "../../hooks/useUserProfile";
import { useParams } from "react-router-dom";

const IntroPage = () => {
  const { userId } = useParams();
  const { userData, loading, error } = useUserProfile(userId);

  return (
    <div className="min-h-screen bg-gray-100">
      <DefaultNavbar />

      <div className="relative w-full h-[220px]">
        <Banner />
        <div className="absolute top-3 right-10">
          <Searchbar />
        </div>
      </div>

      <div className="relative z-10 mx-auto px-4 pt-24">
        <div className="flex justify-between gap-8">
          <div className="w-3/4 bg-white rounded-2xl shadow-lg p-8 pr-10 pt-[-48px]">
            <ProfileBar />
          </div>

          <div className="w-1/4">
            <div className="sticky top-24">
              <UserContactBox
                phone={userData?.phone}
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
