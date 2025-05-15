import { useState } from "react";
import DefaultNavbar from "../../components/DefaultNavbar"
import PrimaryButton from "../../components/PrimaryButton";
import SettingBar from "../../components/SettingBar";
import TextInput from "../../components/TextInput";
import ChatIcon from "../../components/ChatIcon"
import Toaster from "../../components/Toaster";
import { updateProfile } from "../../api/userAPI";


const ChangePassword = () => {

    //TODO: nào có firebase thì thêm sửa avatar

    // thông tin cần sửa
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState(""); // success, danger, warning
    const [isLoading, setIsLoading] = useState(false);

    const handleChangeProfile = async () => {
        try {
            setIsLoading(true);

            // câp nhật thông tin
            const updatedData = await updateProfile({
                username: username,
                email: email,
                phone: phone,
            });
            
            setUsername(updatedData.username);
            setEmail(updatedData.email);
            setPhone(updatedData.phone);

            setError("");
            setMessage("Cập nhật thông tin thành công");
            setToastType("success");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setIsLoading(false);
        }
        catch (error) {
            setError(error.response.data.message);
            setToastType("danger");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setIsLoading(false);
        }
    }
    
    return (
        <div className="min-h-screen flex flex-col">
            <DefaultNavbar />

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
                        <TextInput 
                            label="Avatar"
                            type="avatar"
                        />

                        <TextInput 
                            label="Username"
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
                            label="Phone"
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
                                    Changing ...
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