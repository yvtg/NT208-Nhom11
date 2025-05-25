import { useEffect, useState } from "react";
import DefaultNavbar from "../components/DefaultNavbar";
import ChatIcon from "../components/ChatIcon";
import Banner from "../components/Banner";
import ProfileBar from "../components/ProfileBar";
import JobSummary from "../components/JobSummary";
import JobFilterTab from "../components/JobFilterTab";
import { getProjects, getFields } from "../api/projectAPI.js";
import useAuth from "../hooks/useAuth";
import { getCurrentUser } from "../api/userAPI";
import UserInfo from "../components/UserInfo.js"

const CACHE_KEYS = {
    USER_DATA: 'user_data_cache',
    PROJECTS: 'projects_cache',
    FIELDS: 'fields_cache'
};
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

const DashBoard = ({ onLogout }) => {
  const [selectedFilter, setSelectedFilter] = useState("Best Match");
  const { userID, isLoading } = useAuth();
  const [userData, setUserData] = useState();
  const [projects, setProjects] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const TIMEOUT_DURATION = 10000; // 10 seconds

  // Hàm lấy dữ liệu từ cache
  const getCachedData = (cacheKey) => {
    try {
      const cachedData = localStorage.getItem(cacheKey);
      if (!cachedData) return null;

      const { data, timestamp } = JSON.parse(cachedData);
      const isExpired = Date.now() - timestamp > CACHE_DURATION;

      if (isExpired) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  };

  // Hàm lưu dữ liệu vào cache
  const setCachedData = (cacheKey, data) => {
    try {
      if (!data) {
        console.warn(`Attempting to cache null data for key: ${cacheKey}`);
        return;
      }

      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  };

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

      // Kiểm tra cache cho từng loại dữ liệu
      const cachedUserData = getCachedData(CACHE_KEYS.USER_DATA);
      const cachedProjects = getCachedData(CACHE_KEYS.PROJECTS);
      const cachedFields = getCachedData(CACHE_KEYS.FIELDS);

      // Tạo mảng các promise cần gọi
      const promises = [];
      const results = {
        userData: cachedUserData,
        projects: cachedProjects || [],
        fields: cachedFields || []
      };

      if (!cachedUserData) {
        promises.push(fetchWithTimeout(getCurrentUser(), TIMEOUT_DURATION).then(data => {
          if (data) {
            results.userData = data;
            setCachedData(CACHE_KEYS.USER_DATA, data);
          }
        }));
      }

      if (!cachedProjects) {
        promises.push(fetchWithTimeout(getProjects(), TIMEOUT_DURATION).then(response => {
          if (response && response.data) {
            results.projects = response.data;
            setCachedData(CACHE_KEYS.PROJECTS, response.data);
          }
        }));
      }

      if (!cachedFields) {
        promises.push(fetchWithTimeout(getFields(), TIMEOUT_DURATION).then(data => {
          if (data) {
            results.fields = data;
            setCachedData(CACHE_KEYS.FIELDS, data);
          }
        }));
      }

      // Nếu có promise nào cần gọi
      if (promises.length > 0) {
        await Promise.all(promises);
      }

      // Kiểm tra và cập nhật state
      if (results.userData) setUserData(results.userData);
      if (results.projects) setProjects(results.projects);
      if (results.fields) setFields(results.fields);

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

  // Debug log để kiểm tra dữ liệu
  useEffect(() => {
    console.log('Projects from state:', projects);
    console.log('Cached projects:', getCachedData(CACHE_KEYS.PROJECTS));
  }, [projects]);

  useEffect(() => {
    console.log('Projects:', projects);
    console.log('Fields:', fields);
    console.log('Selected Filter:', selectedFilter);
  }, [projects, fields, selectedFilter]);

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
      case "Budget":
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
    <div className="flex flex-col min-h-screen bg-gray-100">
      <DefaultNavbar onLogout={onLogout} />

      <div className="relative w-full h-[488px] flex flex-col items-center">
        <Banner />

        <div className="relative flex justify-between w-4/5 mt-5">
          <div className="w-full lg:w-[90%]">
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
              <div className="space-y-4">
                {getFilteredProjects().map((project) => (
                  <JobSummary 
                    key={project.projectid}
                    filter={selectedFilter}
                    project={processProjectData(project)}
                    fields={fields}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="w-3/4 flex justify-end mt-[-50px]">
            <UserInfo 
              username={userData?.username} 
              email={userData?.email} 
              avatar={userData?.avatarurl} 
              rating="0" 
            />
          </div>
        </div>
      </div>

      <ChatIcon />
    </div>
  );
};

export default DashBoard;
