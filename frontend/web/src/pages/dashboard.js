import { useEffect, useState } from "react";
import DefaultNavbar from "../components/DefaultNavbar";
import ChatIcon from "../components/ChatIcon";
import Banner from "../components/Banner";
import ProfileBar from "../components/ProfileBar";
import JobSummary from "../components/JobSummary";
import JobFilterTab from "../components/JobFilterTab";
import { getProjects } from "../api/projectAPI.js";
import useAuth from "../hooks/useAuth";
import { getCurrentUser } from "../api/userAPI";
import UserInfo from "../components/UserInfo.js"

const DashBoard = ({ onLogout }) => {
  const [selectedFilter, setSelectedFilter] = useState("Best Match");
  const { userID, isLoading } = useAuth();
  const [userData, setUserData] = useState();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const TIMEOUT_DURATION = 10000; // 10 seconds

  const fetchWithTimeout = async (promise, timeoutMs) => {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
    });
    return Promise.race([promise, timeoutPromise]);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Gọi tất cả API cùng lúc
      const [userResponse, projectsResponse] = await Promise.all([
        fetchWithTimeout(getCurrentUser(), TIMEOUT_DURATION),
        fetchWithTimeout(getProjects(), TIMEOUT_DURATION)
      ]);

      // Cập nhật state với dữ liệu mới
      if (userResponse) setUserData(userResponse);
      if (projectsResponse) setProjects(projectsResponse);

      setRetryCount(0);
    } catch (error) {
      console.error("Error fetching data:", error);
      
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
        setTimeout(fetchData, delay);
      } else {
        setError(error.message || 'Failed to fetch data after multiple attempts');
      }
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Debug log để kiểm tra dữ liệu
  useEffect(() => {
    console.log('Projects:', projects);
    console.log('Selected Filter:', selectedFilter);
  }, [projects, selectedFilter]);

  // Hàm format ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Hàm format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Hàm lọc projects theo filter
  const getFilteredProjects = () => {
    if (!projects) return [];
    
    switch (selectedFilter) {
      case "Best Match":
        return projects
          .filter(project => project.status === "open")
          .sort((a, b) => b.averagerating - a.averagerating);
      case "Newest":
        return projects
          .filter(project => project.status === "open")
          .sort((a, b) => new Date(b.uploadeddate) - new Date(a.uploadeddate));
      case "Save":
        return projects
          .filter(project => project.status === "open")
          .sort((a, b) => parseFloat(b.budget) - parseFloat(a.budget));
      default:
        return projects.filter(project => project.status === "open");
    }
  };

  // Hàm xử lý dữ liệu project trước khi hiển thị
  const processProjectData = (project) => {
    return {
      ...project,
      formattedUploadDate: formatDate(project.uploadeddate),
      formattedExpireDate: formatDate(project.expireddate),
      formattedBudget: formatCurrency(project.budget),
      workingTypeText: project.workingtype === "onsite" ? "Tại văn phòng" : "Làm việc từ xa",
      daysLeft: Math.ceil((new Date(project.expireddate) - new Date()) / (1000 * 60 * 60 * 24))
    };
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 mb-4">
      <DefaultNavbar onLogout={onLogout} />

      <div className="relative w-full min-h-[488px] flex flex-col items-center">
        <Banner />

        <div className="relative flex flex-col lg:flex-row justify-between w-full px-4 lg:px-16 mt-5 gap-4">
          {/* Cột chính - Danh sách công việc */}
          <div className="w-full lg:w-3/4">
            <JobFilterTab onSelect={setSelectedFilter} />

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-500">Đang tải dữ liệu...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-red-500">{error}</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-500">Không có dự án nào</p>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {getFilteredProjects().map((project) => (
                  <JobSummary
                    key={project.projectid}
                    filter={selectedFilter}
                    job={processProjectData(project)}
                    className="w-full"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Cột bên - Thông tin người dùng */}
          <div className="w-full lg:w-1/4">
            <div className="sticky top-24">
              <UserInfo
                username={userData?.username}
                email={userData?.email}
                avatar={userData?.avatarurl}
                rating="0"
                userID={userID}
              />
            </div>
          </div>
        </div>
      </div>

      <ChatIcon />
    </div>

  );
};

export default DashBoard;
