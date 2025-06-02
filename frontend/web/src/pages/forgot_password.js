import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StartNavbar from "../components/StartNavbar";
import PrimaryButton from "../components/PrimaryButton";
import TextInput from "../components/TextInput";
import ChatIcon from "../components/ChatIcon";
import SuccessNoti from "../components/SuccessNoti";
import Footer from "../components/Footer";
import apiClient from "../api/apiClient";


const ForgotPassword = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    // gui mail de reset mat khau
    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const res = await apiClient.post('/api/auth/forgot-password', { email });
            if (res)
                setShowSuccess(true);
        } catch (error) {
            setError("Có lỗi xảy ra.");
            console.log(error)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 mt-30 pt-20">
            <StartNavbar />
            <div className="flex flex-col items-center justify-center flex-grow">
                <div className="rounded-md border shadow-lg p-11 bg-white max-w-md w-full">
                <h1>Vui lòng nhập email để đặt lại  mật khẩu</h1>
                <form onSubmit={handleClick}>
                    <div className="space-y-4 mt-2">
                    <TextInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <p className="text-red-500">{error}</p>
                    <div className="flex justify-center mt-6">
                    <PrimaryButton className="w-auto flex justify-center px-3 py-1 text-lg" type="submit">Gửi</PrimaryButton>
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
                            <SuccessNoti title="Đã gửi mail đặt lại mật khẩu" 
                                        message="Nếu tài khoản liên kết với email này đã được đăng ký vui lòng check mail để có thể đặt lại mật khẩu!" 
                                        onClick={() => navigate("/")}
                                        btnMsg="Về trang chủ" />
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default ForgotPassword;