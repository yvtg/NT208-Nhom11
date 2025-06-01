import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultNavbar from "../../components/DefaultNavbar"
import PrimaryButton from "../../components/PrimaryButton";
import SettingBar from "../../components/SettingBar";
import TextInput from "../../components/TextInput";
import ChatIcon from "../../components/ChatIcon"
import Toaster from "../../components/Toaster";
import { updateProfile } from "../../api/userAPI";
import { storage } from "../../firebase/firebaseconfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { IoMdReverseCamera } from "react-icons/io";
import { CiUser } from "react-icons/ci";

const uploadAvatarToFirebase = async (file) => {
    if (!file) return "";

    const storageRef = ref(storage, `avatars/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
};

const ChangePassword = ({onLogout}) => {
    const navigate = useNavigate();

    // thông tin cần sửa
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState(""); // success, danger, warning
    const [isLoading, setIsLoading] = useState(false);

    const [uploadImage, setUploadImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChangeProfile = async () => {
        try {
            setIsLoading(true);

            let avatarUrl = "";
            if (uploadImage) {
            avatarUrl = await uploadAvatarToFirebase(uploadImage);
            }

            // câp nhật thông tin
            const updatedData = await updateProfile({
                username: username,
                email: email,
                phone: phone,
                avatarurl: avatarUrl
            });
            
            setUsername(updatedData.username);
            setEmail(updatedData.email);
            setPhone(updatedData.phone);

            setError("");
            setMessage("Cập nhật thông tin thành công");
            setToastType("success");
            setShowToast(true);
            setIsLoading(false);

            setTimeout(() => {
                navigate("../dashboard");
            }, 1500);
        }
        catch (error) {
            const errorMessage = error?.response?.data?.message || error.message || "Đã xảy ra lỗi không xác định";

            setError(errorMessage);
            setToastType("danger");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setIsLoading(false);
        }
    }
    
    return (
        <div className="min-h-screen flex flex-col">
            <DefaultNavbar onLogout={onLogout} />

            <SettingBar className="mt-24"/>

            {/* Toast thông báo kết quả cập nhật thông tin */}
            {showToast && (
                <div className="fixed bottom-5 right-5 z-50">
                    {toastType === "success" && (
                        <Toaster type="success" message={message} />
                    )}
                    {toastType === "danger" && (
                        <Toaster type="error" message={error} />
                    )}
                </div>
            )}

            <div className="flex flex-col items-center justify-center flex-grow px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-2xl rounded-md border-divideColor shadow-lg shadow-lightPrimary p-4 sm:p-6 lg:p-11 bg-white">
                    <div className="space-y-4">
                        {/*Avatar*/}
                        <div className="flex flex-col items-center space-y-4 mb-4">
                            <div className="relative">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-gray-200">
                                    {previewImage ? (
                                        <img 
                                            src={previewImage} 
                                            alt="Preview" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                            <CiUser className="text-gray-400 w-10 h-10 sm:w-14 sm:h-14" />
                                        </div>
                                    )}
                                </div>
                                <label 
                                    htmlFor="avatar-upload" 
                                    className="absolute bottom-0 right-0 bg-darkPrimary text-white p-1.5 sm:p-2 rounded-full cursor-pointer hover:bg-darkPrimary/80 transition-colors"
                                >
                                    <IoMdReverseCamera className="w-4 h-4 sm:w-5 sm:h-5" />
                                </label>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        <TextInput 
                            label="Tên đăng nhập"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextInput 
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextInput 
                            label="Số điện thoại"
                            type="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-center mt-8 sm:mt-10">
                        <PrimaryButton 
                            className={`w-full sm:w-auto flex justify-center items-center px-3 py-1 text-base sm:text-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`} 
                            onClick={handleChangeProfile}
                            disabled={isLoading}
                        > 
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang cập nhật ...
                                </>
                            ) : 'Cập nhật'}
                        </PrimaryButton>
                    </div>
                </div>
            </div>
            <ChatIcon></ChatIcon>
        </div>
    );
}

export default ChangePassword;