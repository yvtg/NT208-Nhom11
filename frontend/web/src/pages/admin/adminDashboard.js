import { useState, useEffect } from 'react';
import DefaultNavbar from '../../components/DefaultNavbar';
import UserInfo from '../../components/UserInfo';
import JobSummary from '../../components/JobSummary';
import { getAllUsers, deleteUser } from '../../api/userAPI';
import { getProjects, deleteProject } from '../../api/projectAPI';
import useAuth from '../../hooks/useAuth';
import { FaDeleteLeft } from "react-icons/fa6";

const AdminDashboard = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [usersData, projectsData] = await Promise.all([
                getAllUsers(),
                getProjects()
            ]);
            setUsers(usersData);
            setProjects(projectsData);
        } catch (error) {
            setError('Lỗi khi tải dữ liệu: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteUser = async (userID) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            try {
                await deleteUser(userID);
                setUsers(users.filter(user => user.userid !== userID));
            } catch (error) {
                alert('Lỗi khi xóa người dùng: ' + error.message);
            }
        }
    };

    const handleDeleteProject = async (projectID) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa dự án này?')) {
            try {
                await deleteProject(projectID);
                setProjects(projects.filter(project => project.projectid !== projectID));
            } catch (error) {
                alert('Lỗi khi xóa dự án: ' + error.message);
            }
        }
    };

    const renderUsersTab = () => (
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map(user => (
                <div key={user.userid} className="relative">
                    <UserInfo
                        username={user.username}
                        email={user.email}
                        avatar={user.avatarurl}
                        userID={user.userid}
                    />
                    <button
                        onClick={() => handleDeleteUser(user.userid)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                        <FaDeleteLeft />
                    </button>
                </div>
            ))}
        </div>
    );

    const renderProjectsTab = () => (
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
                <div key={project.projectid} className="relative">
                    <JobSummary job={project} />
                    <button
                        onClick={() => handleDeleteProject(project.projectid)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                        <FaDeleteLeft />
                    </button>
                </div>
            ))}
        </div>
    );

    const renderPaymentsTab = () => (
        <div className=" text-center p-8">
            <h2 className="text-2xl font-semibold text-gray-700">Quản lý thanh toán</h2>
            <p className="text-gray-500 mt-4">Tính năng đang được phát triển...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <DefaultNavbar onLogout={onLogout} />
            
            <div className="pt-24 container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-wrap gap-4 mb-6">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                activeTab === 'users'
                                    ? 'bg-darkPrimary text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Quản lý người dùng
                        </button>
                        <button
                            onClick={() => setActiveTab('projects')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                activeTab === 'projects'
                                    ? 'bg-darkPrimary text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Quản lý dự án
                        </button>
                        <button
                            onClick={() => setActiveTab('payments')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                activeTab === 'payments'
                                    ? 'bg-darkPrimary text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Quản lý thanh toán
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">{error}</div>
                    ) : (
                        <div className="mt-6">
                            {activeTab === 'users' && renderUsersTab()}
                            {activeTab === 'projects' && renderProjectsTab()}
                            {activeTab === 'payments' && renderPaymentsTab()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
