import { useEffect, useState } from "react";
import DefaultNavbar from "../../components/DefaultNavbar";
import Banner from "../../components/Banner";
import ChatIcon from "../../components/ChatIcon";
import HirerInfo from "../../components/HirerInfo";
import JobDetail from "../../components/JobDetail";
import Searchbar from "../../components/Searchbar";
import PrimaryButton from "../../components/PrimaryButton";
import JobSummary from "../../components/JobSummary";
import { getProjects, getFields } from "../../api/projectAPI.js";
import { useParams } from "react-router-dom";

const CACHE_KEYS = {
    PROJECTS: 'projects_cache',
    FIELDS: 'fields_cache'
};
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

const JobPage = ({ onLogout }) => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    // Hàm xử lý dữ liệu project
    const processProjectData = (project) => {
        if (!project) return null;
        
        return {
            ...project,
            formattedUploadDate: formatDate(project.uploadeddate),
            formattedExpireDate: formatDate(project.expireddate),
            formattedBudget: formatCurrency(project.budget),
            workingTypeText: project.workingtype === "onsite" ? "Tại văn phòng" : "Làm việc từ xa",
            daysLeft: Math.ceil((new Date(project.expireddate) - new Date()) / (1000 * 60 * 60 * 24))
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Kiểm tra cache
                const cachedProjects = getCachedData(CACHE_KEYS.PROJECTS);
                const cachedFields = getCachedData(CACHE_KEYS.FIELDS);

                let projectsData = cachedProjects;
                let fieldsData = cachedFields;

                // Nếu không có trong cache, gọi API
                if (!cachedProjects) {
                    const response = await getProjects();
                    projectsData = response.data;
                    setCachedData(CACHE_KEYS.PROJECTS, projectsData);
                }

                if (!cachedFields) {
                    fieldsData = await getFields();
                    setCachedData(CACHE_KEYS.FIELDS, fieldsData);
                }

                // Tìm project theo ID
                const currentProject = projectsData?.find(p => p.projectid === parseInt(projectId));
                
                if (!currentProject) {
                    throw new Error('Không tìm thấy dự án');
                }

                setProject(processProjectData(currentProject));
                setFields(fieldsData || []);

            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [projectId]);

    console.log(project)

    return (
        <div className="min-h-screen bg-gray-100">
            <DefaultNavbar onLogout={onLogout} />

            <div className="relative w-full h-[250px]">
                <Banner />
                <div className="absolute top-3 right-10">
                    <Searchbar />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 max-w-[90%] mx-auto mt-5">
                <div className="w-full lg:w-[90%]">
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <p className="text-gray-500">Đang tải dữ liệu...</p>
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center h-40">
                            <p className="text-red-500">{error}</p>
                        </div>
                    ) : (
                        <JobDetail project={project} fields={fields} />
                    )}
                </div>

                <div className="lg:w-[30%] flex flex-col justify-start items-end space-y-4">
                    <PrimaryButton className="w-full h-[50px] font-bold text-2xl rounded-full">
                        APPLY NOW
                    </PrimaryButton>
                    <HirerInfo project={project} />
                    <JobSummary project={project} />
                </div>
            </div>

            <ChatIcon />
        </div>
    );
};

export default JobPage;
