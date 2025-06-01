import { useState } from "react";
import { updatePassword } from "../../api/userAPI";
import DefaultNavbar from "../../components/DefaultNavbar"
import PrimaryButton from "../../components/PrimaryButton";
import SettingBar from "../../components/SettingBar";
import TextInput from "../../components/TextInput";
import ChatIcon from "../../components/ChatIcon"
import Toaster from "../../components/Toaster";
//TODO: Thêm OTP + gửi mail

const ChangePassword = ({onLogout}) => {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState(""); // success, danger, warning
    const [isLoading, setIsLoading] = useState(false);

    const handleChangePassword = async () => {
        try {
            setIsLoading(true);
            
            if (newPassword !== confirmPassword) {
                setError("Mật khẩu mới không khớp");
                setToastType("danger");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
                setIsLoading(false);
                return;
            }

            const updatedData = await updatePassword({
                oldPassword: currentPassword,
                newPassword: newPassword,
                confirmPassword: confirmPassword,
            });
            console.log("Password changed successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setError("");
            setMessage("Đổi mật khẩu thành công");
            setToastType("success");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setIsLoading(false);
        } catch (error) {
            setError(error.response.data.message);
            setToastType("danger");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <DefaultNavbar onLogout={onLogout}/>

            <SettingBar className="mt-24"/>

            {/* Toast thông báo kết quả đổi mật khẩu */}
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
                        <TextInput 
                            label="Mật khẩu hiện tại"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)} 
                        />
                        
                        <TextInput 
                            label="Mật khẩu mới"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)} 
                        />

                        <TextInput 
                            label="Nhập lại mật khẩu mới"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                        />
                    </div>
                    <div className="flex justify-center mt-8 sm:mt-10">
                        <PrimaryButton 
                            className={`w-full sm:w-auto flex justify-center items-center px-3 py-1 text-base sm:text-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`} 
                            onClick={handleChangePassword}
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