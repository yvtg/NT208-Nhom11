import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import StartNavbar from "../components/StartNavbar";
import PrimaryButton from "../components/PrimaryButton";
import TextInput from "../components/TextInput";
import ChatIcon from "../components/ChatIcon";
import Footer from "../components/Footer"; 
import SecondaryButton from "../components/SecondaryButton";
import OAuthButtons from "../components/OAuthButtons";

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

const Login = ({ setAuthenticated }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Handle OAuth callback
    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');
        
        if (error) {
            setError(error);
            return;
        }

        if (token) {
            try {
                localStorage.setItem("token", token);
                setAuthenticated(true);
                navigate("/dashboard");
            } catch (err) {
                console.error("Error handling OAuth callback:", err);
                setError("Có lỗi xảy ra khi xử lý đăng nhập. Vui lòng thử lại.");
            }
        }
    }, [searchParams, setAuthenticated, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Validate username
        if (!username.trim()) {
            setError("Tên người dùng không được để trống.");
            return;
        }

        // Validate password
        if (!password.trim()) {
            setError("Mật khẩu không được để trống.");
            return;
        }

        // Send login request to API
        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || "Đăng nhập thất bại!");
                return;
            }

            const data = await response.json();
            if (data?.token) {
                localStorage.setItem("token", data.token);
                setAuthenticated(true);
                navigate("/dashboard");
            }
        } catch (error) {
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
                    {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                    <form onSubmit={handleLogin}>
                        <div className="pt-6 space-y-6 w-full max-w-lg">
                            <TextInput
                                type="text"
                                placeholder="Enter your username"
                                label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextInput
                                type="password"
                                placeholder="Enter your password"
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-center mt-6">
                            <PrimaryButton
                                className="w-60 flex justify-center px-3 py-1 text-lg"
                                type="submit"
                            >
                                Login
                            </PrimaryButton>  
                        </div>
                    </form>

                    {/* "Forgot password?" */}
                    <div className="text-right text-sm text-blue-400 mt-2 cursor-pointer hover:underline">
                        Forgot your password?
                    </div>

                    {/* OAuth Buttons */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập với</span>
                            </div>
                        </div>
                        <OAuthButtons />
                    </div>

                    {/* Divider */}
                    <div className="flex items-center my-4">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-2 text-gray-500 text-sm">OR</span>
                        <div className="flex-grow border-t border-gray-300"></div> 
                    </div>

                    <div className="flex justify-center mt-6">
                        <SecondaryButton 
                            className="w-60 flex justify-center px-3 py-1 text-lg"
                            onClick={() => navigate("/register")}
                        >
                            Sign Up
                        </SecondaryButton>
                    </div>
                </div>
            </div>

            <ChatIcon />
            <Footer />
        </div>
    );
};

export default Login;
