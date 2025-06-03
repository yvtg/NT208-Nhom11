import React from "react";
import { useParams } from "react-router-dom";
import DefaultNavbar from "../../components/DefaultNavbar";
import Banner from "../../components/Banner";
import ChatIcon from "../../components/ChatIcon";
import Searchbar from "../../components/Searchbar";
import ProfileBar from "../../components/ProfileBar";
import UserContactBox from "../../components/UserContactBox";
import useUserProfile from "../../hooks/useUserProfile";

const IntroPage = ({ onLogout }) => {
  const { id } = useParams();
  const { userData, loading, error } = useUserProfile(id);

  if (loading) return <div>Đang tải dữ liệu người dùng...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  console.log(userData)
  return (
    <div className="min-h-screen bg-gray-100">
      <DefaultNavbar onLogout={onLogout} />

      <div className="container mx-auto px-4 sm:px-6 py-8 pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="sticky top-24">
              <ProfileBar user={userData} />
            </div>
          </div>

          <div className="lg:col-span-1 w-full">
            <div className="sticky top-24">
              <UserContactBox
                phone={userData?.phonenumber || userData?.phone}
                email={userData?.email}
                id={id}
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