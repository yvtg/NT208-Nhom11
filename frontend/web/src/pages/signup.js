import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StartNavbar from "../components/StartNavbar";
import PrimaryButton from "../components/PrimaryButton";
import TextInput from "../components/TextInput";
import ChatIcon from "../components/ChatIcon";
import SuccessNoti from "../components/SuccessNoti";
import Footer from "../components/Footer";
import OAuthButtons from "../components/OAuthButtons";


    const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();

    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^(0[1-9][0-9]{8})$/;  // Định dạng số điện thoại Việt Nam (10 chữ số, bắt đầu bằng 0)
        
        if (!phoneRegex.test(phone)) 
        {
            return "Số điện thoại không hợp lệ! Hãy nhập số có 10 chữ số và bắt đầu bằng 0.";
        }

        return "";  // Nếu hợp lệ
    };

    const validatePassword = (password) => {
        const minLength = /.{8,}/;
        const upperCase = /[A-Z]/;
        const number = /[0-9]/;
        const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

        if (!minLength.test(password)) return "Mật khẩu phải có ít nhất 8 ký tự.";
        if (!upperCase.test(password)) return "Mật khẩu phải chứa ít nhất một chữ cái viết hoa.";
        if (!number.test(password)) return "Mật khẩu phải chứa ít nhất một số.";
        if (!specialChar.test(password)) return "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.";

        return ""; // Nếu mật khẩu hợp lệ
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email))
        {
            return "Email không hợp lệ."
        }

        return "";
    };

    const handleSignup = async (e) => {
        e.preventDefault();

            // Kiểm tra mật khẩu có hợp lệ không
        const passwordError = validatePassword(password);
        if (passwordError) 
        {
            setError(passwordError);
            return;
        }

        if (password !== confirmPassword) 
        {
            setError("Mật khẩu không khớp!");
            return;
        }

        // Kiểm tra số điện thoại
        const phoneError = validatePhoneNumber(phone);
        if (phoneError) 
        {
            setError(phoneError);
            return;
        }

        const emailError = validateEmail(email);
        if (emailError)
        {
            setError(emailError);
            return;
        }

        setError("");

        try 
        {
            const res = await fetch("http://localhost:3000/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                    confirmPassword,
                    email,
                    phone,
                }),
            });
        
            const data = await res.json();
        
            if (!res.ok) 
            {
                setError(data.error || "Đăng ký thất bại!");
            } 
            else 
            {
              setShowSuccess(true); // show success notification
            }
        } 
        catch (err) 
        {
            console.error("Signup error:", err);
            setError("Lỗi kết nối đến máy chủ!");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 mt-30 pt-20">
            <StartNavbar />
            <div className="flex flex-col items-center justify-center flex-grow">
                <div className="rounded-md border shadow-lg p-11 bg-white max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 text-center font-Roboto_Mono">Đăng ký</h2>
                
                  {/* OAuth Buttons */}
                <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                            </div>
                        </div>
                        <OAuthButtons />
                    </div>
                    
                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-2 text-gray-500 text-sm">Hoặc</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form onSubmit={handleSignup}>
                    <div className="space-y-4 mt-2">
                    <TextInput label="Tên đăng nhập" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <TextInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <TextInput label="Số điện thoại" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    <TextInput label="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <TextInput label="Nhập lại mật khẩu" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    <div className="flex justify-center mt-6">
                    <PrimaryButton className="w-auto flex justify-center px-3 py-1 text-lg" type="submit">Đăng ký</PrimaryButton>
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
                            <SuccessNoti message="Đăng ký thành công!" onClick={() => navigate("/login")} />
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default SignUp;