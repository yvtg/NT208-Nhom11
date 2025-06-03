import { useState, useEffect } from "react";
import { formatCurrency, getRawNumber } from "../utils/formatCurrency";
import { formatTime } from "../utils/dayjs";
import useGetFields from "../hooks/useGetFields";
import { 
    useUpdateProjectName, 
    useUpdateExpiredDate,
    useUpdateWorkingType,
    useUpdateBudget,
    useUpdateDescription,
    useUpdateSkills 
} from "../hooks/useUpdateProject";
import { MdModeEditOutline } from "react-icons/md";
import useAuth from "../hooks/useAuth";

const JobDetail = ({ project }) => {
    const { fieldOptions, isLoading: fieldsLoading, error: fieldsError } = useGetFields();
    const { userID, isLoading } = useAuth();
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isOwner, setIsOwner] = useState(false);

    // Kiểm tra quyền chỉnh sửa
    useEffect(() => {
        if (userID && project?.ownerid) {
            setCurrentUserId(userID);
            setIsOwner(userID === project.ownerid);
            console.log("userID:", userID);
            console.log("ownerid:", project.ownerid);
            console.log("isOwner:", userID === project.ownerid);
        }
    }, [userID, project?.ownerid]); // Thêm userID vào dependency array

    // Các hook update
    const { updateProjectName, isLoading: isUpdatingName, error: updateNameError } = useUpdateProjectName();
    const { updateExpiredDate, isLoading: isUpdatingDate, error: updateDateError } = useUpdateExpiredDate();
    const { updateWorkingType, isLoading: isUpdatingType, error: updateTypeError } = useUpdateWorkingType();
    const { updateBudget, isLoading: isUpdatingBudget, error: updateBudgetError } = useUpdateBudget();
    const { updateDescription, isLoading: isUpdatingDesc, error: updateDescError } = useUpdateDescription();
    const { updateSkills, isLoading: isUpdatingSkills, error: updateSkillsError } = useUpdateSkills();

    // States cho các trường có thể edit
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [isEditingType, setIsEditingType] = useState(false);
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [isEditingSkills, setIsEditingSkills] = useState(false);

    // Values cho các trường
    const [newProjectName, setNewProjectName] = useState(project?.projectname || '');
    const [newExpiredDate, setNewExpiredDate] = useState(project?.expireddate || '');
    const [newWorkingType, setNewWorkingType] = useState(project?.workingtype || '');
    const [newBudget, setNewBudget] = useState(project?.budget || '');
    const [newDescription, setNewDescription] = useState(project?.description || '');
    const [newSkills, setNewSkills] = useState(project?.skills || []);
    const [skillInput, setSkillInput] = useState('');

    // thêm skill
    const handleAddSkill = (e) => {
        if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
            e.preventDefault();
            const newSkill = skillInput.trim();
            if (newSkill && !newSkills.includes(newSkill)) {
                setNewSkills([...newSkills, newSkill]);
            }
            setSkillInput("");
        }
    };

    // xóa skill = back space
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
            handleAddSkill(e);
        } else if (e.key === 'Backspace' && skillInput === '' && newSkills.length > 0) {
            e.preventDefault();
            const updatedSkills = [...newSkills];
            updatedSkills.pop();
            setNewSkills(updatedSkills);
        }
    };

    // xóa skill
    const handleRemoveSkill = (skillToRemove) => {
        setNewSkills(newSkills.filter(skill => skill !== skillToRemove));
    };

    // xóa tất cả skills
    const handleRemoveAllSkills = () => {
        setNewSkills([]);
    };

    // sửa tên project
    const handleEditNameClick = () => {
        if (!isOwner) {
            alert('Bạn không có quyền chỉnh sửa dự án này');
            return;
        }
        setIsEditingName(true);
        setNewProjectName(project?.projectname || '');
    };

    const handleSaveName = async () => {
        if (!isOwner) {
            alert('Bạn không có quyền chỉnh sửa dự án này');
            return;
        }
        try {
            const updatedProject = await updateProjectName(project.projectid, newProjectName, project);
            project.projectname = updatedProject.projectname;
            setIsEditingName(false);
            alert('Đổi tên dự án thành công!');
        } catch (error) {
            console.error('Lỗi khi cập nhật tên dự án:', error);
            alert('Có lỗi xảy ra khi cập nhật tên dự án');
        }
    };

    const handleCancelName = () => {
        setIsEditingName(false);
        setNewProjectName(project?.projectname || '');
    };

    // sửa ngày hết hạn
    const handleEditDateClick = () => {
        if (!isOwner) {
            alert('Bạn không có quyền chỉnh sửa dự án này');
            return;
        }
        setIsEditingDate(true);
        setNewExpiredDate(project?.expireddate || '');
    };

    const handleSaveDate = async () => {
        if (!isOwner) {
            alert('Bạn không có quyền chỉnh sửa dự án này');
            return;
        }
        try {
            const updatedProject = await updateExpiredDate(project.projectid, newExpiredDate, project);
            project.expireddate = updatedProject.expireddate;
            setIsEditingDate(false);
            alert('Cập nhật ngày hết hạn thành công!');
        } catch (error) {
            console.error('Lỗi khi cập nhật ngày hết hạn:', error);
            alert('Có lỗi xảy ra khi cập nhật ngày hết hạn');
        }
    };

    const handleCancelDate = () => {
        setIsEditingDate(false);
        setNewExpiredDate(project?.expireddate || '');
    };

    // sửa hình thức làm việc
    const handleEditTypeClick = () => {
        if (!isOwner) {
            alert('Bạn không có quyền chỉnh sửa dự án này');
            return;
        }
        setIsEditingType(true);
        setNewWorkingType(project?.workingtype || '');
    };

    const handleSaveType = async () => {
        if (!isOwner) {
            alert('Bạn không có quyền chỉnh sửa dự án này');
            return;
        }
        try {
            const updatedProject = await updateWorkingType(project.projectid, newWorkingType, project);
            project.workingtype = updatedProject.workingtype;
            setIsEditingType(false);
            alert('Cập nhật hình thức làm việc thành công!');
        } catch (error) {
            console.error('Lỗi khi cập nhật hình thức làm việc:', error);
            alert('Có lỗi xảy ra khi cập nhật hình thức làm việc');
        }
    };

    const handleCancelType = () => {
        setIsEditingType(false);
        setNewWorkingType(project?.workingtype || '');
    };

    // sửa ngân sách
    const handleEditBudgetClick = () => {
        if (!isOwner) {
            alert('Bạn không có quyền chỉnh sửa dự án này');
            return;
        }
        setIsEditingBudget(true);
        setNewBudget(project?.budget || '');
    };

    const handleSaveBudget = async () => {
        if (!isOwner) {
            alert('Bạn không có quyền chỉnh sửa dự án này');
            return;
        }
        try {
            const updatedProject = await updateBudget(project.projectid, newBudget, project);
            project.budget = updatedProject.budget;
            setIsEditingBudget(false);
            alert('Cập nhật ngân sách thành công!');
        } catch (error) {
            console.error('Lỗi khi cập nhật ngân sách:', error);
            alert('Có lỗi xảy ra khi cập nhật ngân sách');
        }
    };

    const handleCancelBudget = () => {
        setIsEditingBudget(false);
        setNewBudget(project?.budget || '');
    };

    // Handlers cho mô tả
    const handleEditDescClick = () => {
        if (!isOwner) {
            alert('Bạn không có quyền chỉnh sửa dự án này');
            return;
        }
        setIsEditingDesc(true);
        setNewDescription(project?.description || '');
    };

    const handleSaveDesc = async () => {
        if (!isOwner) {
            alert('Bạn không có quyền chỉnh sửa dự án này');
            return;
        }
        try {
            const updatedProject = await updateDescription(project.projectid, newDescription, project);
            project.description = updatedProject.description;
            setIsEditingDesc(false);
            alert('Cập nhật mô tả thành công!');
        } catch (error) {
            console.error('Lỗi khi cập nhật mô tả:', error);
            alert('Có lỗi xảy ra khi cập nhật mô tả');
        }
    };

    const handleCancelDesc = () => {
        setIsEditingDesc(false);
        setNewDescription(project?.description || '');
    };

    // sửa kỹ năng
    const handleEditSkillsClick = () => {
        if (!isOwner) {
            alert('Bạn không có quyền chỉnh sửa dự án này');
            return;
        }
        setIsEditingSkills(true);
        setNewSkills(project?.skills || []);
    };

    const handleSaveSkills = async () => {
        if (!isOwner) {
            alert('Bạn không có quyền chỉnh sửa dự án này');
            return;
        }
        try {
            const updatedProject = await updateSkills(project.projectid, newSkills, project);
            project.skills = updatedProject.skills;
            setIsEditingSkills(false);
            alert('Cập nhật kỹ năng thành công!');
        } catch (error) {
            console.error('Lỗi khi cập nhật kỹ năng:', error);
            alert('Có lỗi xảy ra khi cập nhật kỹ năng');
        }
    };

    const handleCancelSkills = () => {
        setIsEditingSkills(false);
        setNewSkills(project?.skills || []);
    };

    // nút edit
    const renderEditButton = (onClick) => {
        if (!isOwner) return null;
        return (
            <button
                onClick={onClick}
                className="p-2 text-darkPrimary hover:text-lightPrimary transition-colors"
            >
                <MdModeEditOutline  />
            </button>
        );
    };

    return (
        <div className="w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-gray-200">
                <div className="flex justify-between items-start">
                    {isEditingName ? (
                        // đổi tên //////////////////////
                        <div className="flex-1 mr-4">
                            <input
                                type="text"
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                className="w-full text-3xl font-bold text-gray-800 border-b-2 border-darkPrimary focus:outline-none"
                                disabled={isUpdatingName}
                            />
                            <div className="mt-2 flex gap-2">
                                <button
                                    onClick={handleSaveName}
                                    className="px-4 py-2 bg-darkPrimary text-white rounded-md hover:bg-lightPrimary disabled:opacity-50"
                                    disabled={isUpdatingName}
                                >
                                    {isUpdatingName ? 'Đang lưu...' : 'Lưu'}
                                </button>
                                <button
                                    onClick={handleCancelName}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
                                    disabled={isUpdatingName}
                                >
                                    Hủy
                                </button>
                            </div>
                            {updateNameError && (
                                <p className="mt-2 text-red-500 text-sm">{updateNameError}</p>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <h2 className="text-3xl font-bold text-gray-800">{project?.projectname}</h2>
                            {renderEditButton(handleEditNameClick)}
                        </div>
                    )}
                    {isEditingBudget ? (
                        // đổi ngân sách //////////////////////
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={newBudget}
                                onChange={(e) => setNewBudget(e.target.value)}
                                className="text-2xl font-semibold text-darkPrimary border-b-2 border-darkPrimary focus:outline-none"
                                disabled={isUpdatingBudget}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSaveBudget}
                                    className="px-2 py-1 bg-darkPrimary text-white rounded-md hover:bg-lightPrimary disabled:opacity-50"
                                    disabled={isUpdatingBudget}
                                >
                                    {isUpdatingBudget ? 'Đang lưu...' : 'Lưu'}
                                </button>
                                <button
                                    onClick={handleCancelBudget}
                                    className="px-2 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
                                    disabled={isUpdatingBudget}
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <p className="text-2xl font-semibold text-red-500">{formatCurrency(project?.budget)}</p>
                            {renderEditButton(handleEditBudgetClick)}
                        </div>
                    )}
                </div>
                {isEditingDesc ? (
                    // đổi description //////////////////////
                    <div className="mt-4">
                        <textarea
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            className="w-full text-gray-600 text-lg leading-relaxed border-2 border-darkPrimary rounded p-2 focus:outline-none"
                            rows="4"
                            disabled={isUpdatingDesc}
                        />
                        <div className="mt-2 flex gap-2">
                            <button
                                onClick={handleSaveDesc}
                                className="px-4 py-2 bg-darkPrimary text-white rounded-md hover:bg-lightPrimary disabled:opacity-50"
                                disabled={isUpdatingDesc}
                            >
                                {isUpdatingDesc ? 'Đang lưu...' : 'Lưu'}
                            </button>
                            <button
                                onClick={handleCancelDesc}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
                                disabled={isUpdatingDesc}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-start gap-2 mt-4">
                        <p className="text-gray-600 text-lg leading-relaxed flex-1">
                            {project?.description}
                        </p>
                        {renderEditButton(handleEditDescClick)}
                    </div>
                )}
            </div>

            {/* Skills */}
            <div className="px-8 py-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-700">Kỹ năng yêu cầu</h3>
                    {!isEditingSkills && renderEditButton(handleEditSkillsClick)}
                </div>
                {isEditingSkills ? (
                    <div>
                        <div className="relative">
                            <div className="px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-darkPrimary focus-within:border-transparent transition-all">
                                <div className="flex flex-wrap gap-2">
                                    {newSkills.map((skill, index) => (
                                        <div 
                                            key={index} 
                                            className="flex items-center bg-lightPrimary rounded-full px-3 py-1 text-sm"
                                        >
                                            <span>{skill}</span>
                                            <button 
                                                type="button" 
                                                className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                                                onClick={() => handleRemoveSkill(skill)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    <input
                                        type="text"
                                        className="outline-none flex-grow min-w-[120px] bg-transparent text-sm"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={newSkills.length === 0 ? "Nhập kỹ năng và nhấn Enter" : ""}
                                    />
                                </div>
                            </div>
                            {newSkills.length > 0 && (
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-sm text-gray-500">
                                        {newSkills.length} kỹ năng đã được thêm
                                    </span>
                                    <button 
                                        type="button"
                                        className="text-sm text-red-500 hover:text-red-700 transition-colors"
                                        onClick={handleRemoveAllSkills}
                                    >
                                        Xóa tất cả
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={handleSaveSkills}
                                className="px-4 py-2 bg-darkPrimary text-white rounded-md hover:bg-lightPrimary disabled:opacity-50"
                                disabled={isUpdatingSkills}
                            >
                                {isUpdatingSkills ? 'Đang lưu...' : 'Lưu'}
                            </button>
                            <button
                                onClick={handleCancelSkills}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
                                disabled={isUpdatingSkills}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {project?.skills?.map((skill, index) => (
                            <span key={index} className="bg-lightPrimary text-darkPrimary px-4 py-2 rounded-full text-sm font-medium">
                                {skill}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Job Details Grid */}
            <div className="grid grid-cols-2 gap-6 p-8">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Ngày */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="text-sm font-medium text-gray-500">Thời gian</h3>
                            {!isEditingDate && renderEditButton(handleEditDateClick)}
                        </div>
                        {isEditingDate ? (
                            <div>
                                <input
                                    type="datetime-local"
                                    value={newExpiredDate}
                                    onChange={(e) => setNewExpiredDate(e.target.value)}
                                    className="w-full border-2 border-darkPrimary rounded p-2 focus:outline-none"
                                    disabled={isUpdatingDate}
                                />
                                <div className="mt-2 flex gap-2">
                                    <button
                                        onClick={handleSaveDate}
                                        className="px-4 py-2 bg-darkPrimary text-white rounded-md hover:bg-lightPrimary disabled:opacity-50"
                                        disabled={isUpdatingDate}
                                    >
                                        {isUpdatingDate ? 'Đang lưu...' : 'Lưu'}
                                    </button>
                                    <button
                                        onClick={handleCancelDate}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
                                        disabled={isUpdatingDate}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-700">Ngày đăng: {formatTime(project?.uploadeddate)}</p>
                                <p className="text-red-400">Hết hạn trong {project?.daysLeft} ngày nữa</p>
                            </>
                        )}
                    </div>

                    {/* Hình thức làm việc */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="text-sm font-medium text-gray-500">Hình thức làm việc</h3>
                            {!isEditingType && renderEditButton(handleEditTypeClick)}
                        </div>
                        {isEditingType ? (
                            <div>
                                <select
                                    value={newWorkingType}
                                    onChange={(e) => setNewWorkingType(e.target.value)}
                                    className="w-full border-2 border-darkPrimary rounded p-2 focus:outline-none"
                                    disabled={isUpdatingType}
                                >
                                    <option value="remote">Làm việc từ xa</option>
                                    <option value="onsite">Tại văn phòng</option>
                                    <option value="hybrid">Kết hợp</option>
                                </select>
                                <div className="mt-2 flex gap-2">
                                    <button
                                        onClick={handleSaveType}
                                        className="px-4 py-2 bg-darkPrimary text-white rounded-md hover:bg-lightPrimary disabled:opacity-50"
                                        disabled={isUpdatingType}
                                    >
                                        {isUpdatingType ? 'Đang lưu...' : 'Lưu'}
                                    </button>
                                    <button
                                        onClick={handleCancelType}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
                                        disabled={isUpdatingType}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-700">{project?.workingTypeText}</p>
                        )}
                    </div>

                    {/* Địa điểm làm việc */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Địa điểm làm việc</h3>
                        <p className="text-gray-700">{project?.workingplace || 'Không yêu cầu'}</p>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Lĩnh vực */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Lĩnh vực</h3>
                        <p className="text-gray-700">
                            {fieldOptions?.find(field => field?.field_id === project?.field_id)?.field_name || 'Chưa có lĩnh vực'}
                        </p>
                    </div>

                    {/* Trạng thái */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Trạng thái</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                            ${project?.status === 'open' ? 'bg-green-100 text-green-800' : 
                                project?.status === 'closed' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'}`}>
                                {project?.status === 'open' ? 'Đang tuyển' :
                                project?.status === 'closed' ? 'Đã đóng' :
                                'Không xác định'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;
