import DefaultNavbar from "../../components/DefaultNavbar"
import SettingBar from "../../components/SettingBar";
import TextInput from "../../components/TextInput";
import ChatIcon from "../../components/ChatIcon";
import PrimaryButton from "../../components/PrimaryButton";
import { useState, useEffect } from "react";
import Toaster from "../../components/Toaster";
import { updateCV } from "../../api/userAPI";
import useGetFields from "../../hooks/useGetFields";
import { storage } from "../../firebase/firebaseconfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const uploadCVToFirebase = async (file) => {
    if (!file) return "";

    const storageRef = ref(storage, `cv/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
}

//TODO: Nào có firebase thì thêm change cv
const ChangeCV = ({ onLogout }) => {
    
    // các thông tin cần cập nhật
    const [title, setTitle] = useState("");
    const [personalWebsite, setPersonalWebsite] = useState("");
    const [cvFile, setCvFile] = useState("");
    const [fieldId, setFieldId] = useState("");
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState("");
    const [introduce, setIntroduce] = useState("");

    const [message, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState(""); // success, danger, warning
    const [isLoading, setIsLoading] = useState(false);

    // lấy field từ custom hook
    const { fieldOptions, isLoading: fieldsLoading, error: fieldsError } = useGetFields();

    // Hiển thị thông báo lỗi nếu không thể lấy danh sách lĩnh vực
    useEffect(() => {
        if (fieldsError) {
            setToastType("danger");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    }, [fieldsError]);

    // thêm skill
    const handleAddSkill = (e) => {
        if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
            e.preventDefault();
            const newSkill = skillInput.trim();
            if (newSkill && !skills.includes(newSkill)) {
                setSkills([...skills, newSkill]);
            }
            setSkillInput("");
        }
    };

    // xóa skill = back space
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
            handleAddSkill(e);
        } else if (e.key === 'Backspace' && skillInput === '' && skills.length > 0) {
            // Xóa skill cuối cùng khi bấm backspace và input trống
            e.preventDefault();
            const newSkills = [...skills];
            newSkills.pop();
            setSkills(newSkills);
        }
    };

    //  xóa skill
    const handleRemoveSkill = (skillToRemove) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    // xóa tất cả skills
    const handleRemoveAllSkills = () => {
        setSkills([]);
    };

    const handleChangeCV = async () => {
        try{
            setIsLoading(true);

            let cvUrl = "";
            if(cvFile)
            {
                cvUrl = await uploadCVToFirebase(cvFile);
            }
            
            // cập nhật thông tin CV
            const updatedData = await updateCV({
                title: title,
                personal_website: personalWebsite,
                cv_url: cvUrl,
                field_id: fieldId,
                skills: skills.join(', '), 
                introduce: introduce
            });

            setMessage(updatedData.message || "Cập nhật thông tin thành công");
            setToastType("success");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setIsLoading(false);
        } catch (error) {
            console.error("Lỗi cập nhật CV:", error);
            setMessage(error.response?.data?.message || error.message || "Đã xảy ra lỗi");
            setToastType("danger");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setIsLoading(false);
        }
    }


    return (
        <div className="min-h-screen flex flex-col">
            <DefaultNavbar onLogout={onLogout}/>

            <SettingBar className="mt-24"/>

            {/* Toast thông báo kết quả cập nhật thông tin */}
            {showToast && (
                <div className="fixed bottom-5 right-5 z-50">
                    {toastType === "success" && (
                        <Toaster type="success" message={message} />
                    )}
                    {toastType === "danger" && (
                        <Toaster type="error" message={message} />
                    )}
                </div>
            )}

            <div className="flex flex-col items-center justify-center flex-grow px-4 sm:px-6 lg:px-8 mt-20">
                <div className="w-full max-w-2xl rounded-md border-divideColor shadow-lg shadow-lightPrimary p-4 sm:p-6 lg:p-11 bg-white">
                    <div className="space-y-4">
                        {/* Title */}
                        <TextInput
                            label="Chức danh"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        {/* Personal website */}
                        <TextInput 
                            label="Website cá nhân"
                            type="link"
                            value={personalWebsite}
                            onChange={(e) => setPersonalWebsite(e.target.value)}
                        />

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <label className="w-full sm:w-1/3 text-gray-700 font-medium">File CV</label>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => setCvFile(e.target.files[0])}
                                className="w-full sm:w-2/3 px-3 py-2 border border-darkPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-darkPrimary"
                            />
                        </div>

                        {/* fields */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <label className="w-full sm:w-1/3 font-medium text-gray-700">Lĩnh vực</label>
                            <select 
                                className="w-full sm:w-2/3 px-4 py-2 border border-darkPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-darkPrimary resize-none"
                                value={fieldId}
                                onChange={(e) => setFieldId(e.target.value)}
                                disabled={fieldsLoading}
                            >
                                <option value="">Chọn lĩnh vực</option>
                                {fieldsLoading ? (
                                    <option value="" disabled>Đang tải...</option>
                                ) : (
                                    fieldOptions.map((field) => (
                                        <option key={field.field_id} value={field.field_id}>
                                            {field.field_name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                        
                        {/* skills */}
                        <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                            <label className="w-full sm:w-1/3 font-medium text-gray-700">Kỹ năng</label>
                            <div className="w-full sm:w-2/3">
                                <div className="px-4 py-2 border border-darkPrimary rounded-md focus-within:ring-2 focus-within:ring-darkPrimary mb-2">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {skills.map((skill, index) => (
                                            <div key={index} className="flex items-center bg-lightPrimary rounded-md px-3 py-1">
                                                <span className="text-sm">{skill}</span>
                                                <button 
                                                    type="button" 
                                                    className="ml-2 text-gray-500 hover:text-gray-700"
                                                    onClick={() => handleRemoveSkill(skill)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        <input
                                            type="text"
                                            className="outline-none flex-grow min-w-[100px] bg-transparent text-sm"
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                        />
                                    </div>
                                </div>
                                {skills.length > 0 && (
                                    <div className="flex justify-end">
                                        <button 
                                            type="button"
                                            className="text-sm text-red-500 hover:text-red-700"
                                            onClick={handleRemoveAllSkills}
                                        >
                                            Xóa tất cả
                                        </button>
                                    </div>
                                )}
                                <div className="text-xs text-gray-500 mt-1">
                                    {skills.length} kỹ năng đã được thêm
                                </div>
                            </div>
                        </div>

                        {/* introduce */}
                        <TextInput
                            label="Giới thiệu"
                            type="textarea"
                            value={introduce}
                            onChange={(e) => setIntroduce(e.target.value)}
                        />

                    </div>
                    <div className="flex justify-center mt-8 sm:mt-10">
                        <PrimaryButton 
                            className="w-full sm:w-auto flex justify-center px-3 py-1 text-base sm:text-lg"
                            onClick={handleChangeCV}
                            disabled={isLoading}
                        > 
                            {isLoading ? "Đang cập nhật..." : "Cập nhật"} 
                        </PrimaryButton>
                    </div>
                </div>
            </div>
            <ChatIcon></ChatIcon>
        </div>
    );
}

export default ChangeCV;