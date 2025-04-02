import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StartNavbar from "../components/StartNavbar";
import PrimaryButton from "../components/PrimaryButton";
import TextInput from "../components/TextInput";
import ChatIcon from "../components/ChatIcon";
import { FaFacebook, FaGoogle , FaLinkedin } from "react-icons/fa";
import Footer from "../components/Footer"; 
import SecondaryButton from "../components/SecondaryButton";

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
};

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        const passwordError = validatePassword(password);
        if (passwordError) 
        {
            setError(passwordError);
            return;
        }

        try 
        {
            const response = await fetch("http://localhost:3000/api/auth/login", 
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Username: username, Password: password }),
                credentials: "include", // Quan trọng để nhận cookie từ backend
            });

            const data = await response.json();
            if (response.ok) 
            {
                // Lưu token vào localStorage hoặc cookie
                localStorage.setItem("token", data.token);
                alert("Đăng nhập thành công!");
                navigate("/dashboard"); // Chuyển hướng sau khi đăng nhập
            } 
            else 
            {
                setError(data.message);
            }
        } 
        catch (error) 
        {
            console.error("Login error:", error);
            setError("Lỗi khi đăng nhập, vui lòng thử lại.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center bg-gray-100 mt-30 pt-20">
            <StartNavbar />

            <div className="flex flex-col items-center justify-center flex-grow">
                <div className="rounded-md border shadow-lg p-11 bg-white max-w-md w-full">
                    <h2 className="text-2xl font-bold text-gray-800 text-center font-Roboto_Mono">
                        Login
                    </h2>

                    {/* Form Username & Password */}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <form onSubmit={handleLogin}>
                        <div className="pt-6 space-y-6 w-full max-w-lg">
                            <TextInput type="text" placeholder="Enter your username" label="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                            <TextInput type="password" placeholder="Enter your password" label="Password"value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                    </form>

                    {/* "Forgot password?" */}
                    <div className="text-right text-sm text-blue-400 mt-2 cursor-pointer hover:underline">
                        Forgot your password?
                    </div>

                    <div className="flex justify-center mt-6">
                        <PrimaryButton className="w-60 flex justify-center px-3 py-1 text-lg" onClick={handleLogin}> Login </PrimaryButton>
                    </div>

                    {/*line Don't have acc*/ }
                    <div className="flex items-center my-4">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-2 text-gray-500 text-sm">Don't have an account?</span>
                        <div className="flex-grow border-t border-gray-300"></div> 
                    </div>

                    {/*sign up with other*/ }
                    <div className="flex items-center justify-center space-x-6 my-4">
                        <FaFacebook className="text-blue-600 text-4xl cursor-pointer" />
                        <FaGoogle className="text-red-500 text-4xl cursor-pointer" />
                        <FaLinkedin className="text-blue-700 text-4xl cursor-pointer" />
                    </div>

                    {/*line or*/ }
                    <div className="flex items-center my-4">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-2 text-gray-500 text-sm">OR</span>
                        <div className="flex-grow border-t border-gray-300"> </div> 
                    </div>

                    <div className="flex justify-center mt-6">
                        <SecondaryButton className="w-60 flex justify-center px-3 py-1 text-lg"> Sign Up </SecondaryButton>
                    </div>
                </div>
            </div>

            <ChatIcon />
            <Footer></Footer>
        </div>
    );
};

export default Login;
