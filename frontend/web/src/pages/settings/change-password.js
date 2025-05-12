import { useState } from "react";
import { updatePassword } from "../../api/userAPI";
import DefaultNavbar from "../../components/DefaultNavbar"
import PrimaryButton from "../../components/PrimaryButton";
import SettingBar from "../../components/SettingBar";
import TextInput from "../../components/TextInput";
import ChatIcon from "../../components/ChatIcon"

//TODO: Thêm OTP + gửi mail

const ChangePassword = () => {

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

    const closeToast = () => {
        setShowToast(false);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <DefaultNavbar />

            <SettingBar className="mt-24"/>

            {/* Toast thông báo kết quả đổi mật khẩu */}
            {showToast && (
                <div className="fixed bottom-5 right-5 z-50">
                    {toastType === "success" && (
                        <div id="toast-success" className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-sm" role="alert">
                            <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
                                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                </svg>
                                <span className="sr-only">Check icon</span>
                            </div>
                            <div className="ms-3 text-sm font-normal">{message}</div>
                            <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8" onClick={closeToast} aria-label="Close">
                                <span className="sr-only">Close</span>
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                            </button>
                        </div>
                    )}
                    {toastType === "danger" && (
                        <div id="toast-danger" className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-sm" role="alert">
                            <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg">
                                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
                                </svg>
                                <span className="sr-only">Error icon</span>
                            </div>
                            <div className="ms-3 text-sm font-normal">{error}</div>
                            <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8" onClick={closeToast} aria-label="Close">
                                <span className="sr-only">Close</span>
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-col items-center justify-center flex-grow">
                <div className="rounded-md border-divideColor shadow-lg shadow-lightPrimary p-11 bg-white lg:w-1/2 sm:w-auto">
                    <div className="space-y-4">
                        <TextInput 
                        label="Current password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)} />
                        
                        <TextInput 
                        label="New password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)} />

                        <TextInput 
                        label="Confirm password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} />

                        {/* <TextInput 
                        label="OTP"
                        type="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)} /> */}
                    </div>
                    <div className="flex justify-center mt-10">
                        <PrimaryButton 
                            className={`w-auto flex justify-center items-center px-3 py-1 text-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`} 
                            onClick={handleChangePassword}
                            disabled={isLoading}
                        > 
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang xử lý...
                                </>
                            ) : 'Change'}
                        </PrimaryButton>
                    </div>

                </div>
            </div>
            <ChatIcon></ChatIcon>
        </div>
    );
}

export default ChangePassword;