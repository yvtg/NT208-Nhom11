import { useEffect, useState } from "react";
import DefaultNavbar from "../components/DefaultNavbar";
import ChatIcon from "../components/ChatIcon";
import Banner from "../components/Banner";
import UserInfo from "../components/UserInfo";
import JobSummary from "../components/JobSummary";
import JobFilterTab from "../components/JobFilterTab";
import { getProjects } from "../api/projectAPI.js";
import useAuth from "../hooks/useAuth";
import { getCurrentUser } from "../api/userAPI";
const DashBoard = ({ onLogout }) => {
  const [selectedFilter, setSelectedFilter] = useState("Best Match");

  // const [projects, setProjects] = useState();
  // useEffect(() => {
  //   const fetchProjects = async () => {
  //     try {
  //       const response = await getProjects();
  //       setProjects(response);
  //       return response.data;
  //     } catch (error) {
  //       console.error("Error fetching projects:", error);
  //     }
  //   };
  //   fetchProjects();
  // });

  const { userID, isLoading } = useAuth();
  const [userData, setUserData] = useState();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUserData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <DefaultNavbar onLogout={onLogout} />

      <div className="relative w-full h-[488px] flex flex-col items-center">
        <Banner />

        <div className="relative flex justify-between w-4/5 mt-5">
          <div className="w-full lg:w-[90%]">
            <JobFilterTab onSelect={setSelectedFilter} />
            <JobSummary filter={selectedFilter} />
          </div>

          <div className="w-2/4 flex justify-end mt-[-50px]">
            <UserInfo username={userData?.username} email={userData?.email} avatar={userData?.avatarurl} rating="0" />
          </div>
        </div>
      </div>

      <ChatIcon />
    </div>
  );
};

export default DashBoard;
