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


      <div className="relative w-full h-[220px]">
        <Banner />
        <div className="absolute top-4 right-8">
          <Searchbar />
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 z-40 mt-10">
        <div className="flex justify-between gap-6 z-40">
          <div className="w-[72%] bg-white rounded-2xl shadow-lg p-6 z-40">
            <ProfileBar />
          </div>

          <div className="w-[28%]">
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
