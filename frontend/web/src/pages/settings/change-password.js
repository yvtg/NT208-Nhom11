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

    const handleChangePassword = async () => {
        try {
            const updatedData = await updatePassword({
                oldPassword: currentPassword,
                newPassword: newPassword,
                confirmPassword: confirmPassword,
            });
            console.log("Password changed successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <DefaultNavbar />

            <SettingBar className="mt-24"/>

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

                    <div class="p-4 mb-4 text-sm text-red-500 rounded-lg bg-red-5" role="alert">
                        {error}
                    </div>
                    </div>
                    <div className="flex justify-center mt-10">
                        <PrimaryButton className="w-auto flex justify-center px-3 py-1 text-lg" onClick={handleChangePassword}> Change </PrimaryButton>
                    </div>

                </div>
            </div>
            <ChatIcon></ChatIcon>
        </div>
    );
}

export default ChangePassword;