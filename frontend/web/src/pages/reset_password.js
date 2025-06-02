import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../api/apiClient";
import StartNavbar from "../components/StartNavbar";
import PrimaryButton from "../components/PrimaryButton";
import TextInput from "../components/TextInput";
import ChatIcon from "../components/ChatIcon";
import SuccessNoti from "../components/SuccessNoti";
import Footer from "../components/Footer";

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // xử lý đặt lại mật khẩu
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await apiClient.post('/api/auth/reset-password', { token, password });
            
            if (res)
                setShowSuccess(true);
        } catch (e) {
            console.log(e)
        }
    }

    return(
        <div className="min-h-screen flex flex-col bg-gray-100 mt-30 pt-20">
            <StartNavbar />
            <div className="flex flex-col items-center justify-center flex-grow">
                <div className="rounded-md border shadow-lg p-11 bg-white max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 text-center font-Roboto_Mono">
                    Đặt lại mật khẩu
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 mt-2">
                        <TextInput label="Mật khẩu mới" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <TextInput label="Nhập lại mật khẩu mới" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    <p className="text-red-500">{error}</p>


                    <div className="flex justify-center mt-6">
                        <PrimaryButton className="w-auto flex justify-center px-3 py-1 text-lg" type="submit">Đặt lại</PrimaryButton>
                    </div>
                </form>
                </div>
            </div>

            <ChatIcon />
            <Footer />
            {
                showSuccess && 
                <div className="bg-slate-400 bg-opacity-75 z-40 w-screen h-screen fixed">
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-lightPrimary z-50 p-6 rounded-lg text-center border-2 border-white">
                            <SuccessNoti title="Đặt lại mật khẩu thành công" 
                                        message="Đã đặt lại mật khẩu! Quay về trang đăng nhập để có thể đăng nhập" 
                                        onClick={() => navigate("/login")}
                                        btnMsg="Đăng nhập ngay" />
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default ResetPassword;