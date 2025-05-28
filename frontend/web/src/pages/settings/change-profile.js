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

            <div className="flex flex-col items-center justify-center flex-grow">
                <div className="rounded-md border-divideColor shadow-lg shadow-lightPrimary p-11 bg-white lg:w-1/2 sm:w-auto">

                    <div className="space-y-4">
                        {/*Avatar*/}
                        <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Ảnh đại diện</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setUploadImage(e.target.files[0])}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                                    file:rounded-full file:border-0 file:text-sm file:font-semibold 
                                    file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
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
                    <div className="flex justify-center mt-10">
                        <PrimaryButton 
                            className={`w-auto flex justify-center items-center px-3 py-1 text-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`} 
                            onClick={handleChangeProfile}
                            disabled={isLoading}
                        > 
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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