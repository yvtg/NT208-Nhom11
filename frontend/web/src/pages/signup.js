import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StartNavbar from "../components/StartNavbar";
import PrimaryButton from "../components/PrimaryButton";
import TextInput from "../components/TextInput";
import ChatIcon from "../components/ChatIcon";
import SuccessNoti from "../components/SuccessNoti";
import Footer from "../components/Footer";
import { FaFacebook, FaGoogle, FaGithub } from "react-icons/fa";
import {
    auth,
    db,
    createUserWithEmailAndPassword,
    setDoc,
    doc,
    googleProvider,
    facebookProvider,
    signInWithPopup,
    GithubAuthProvider,
    } from "../firebase/firebaseconfig";




    const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();


    const handleSignup = async (e) => {
        e.preventDefault();

            // Kiểm tra mật khẩu có hợp lệ không
        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (password !== confirmPassword) {
        setError("Mật khẩu không khớp!");
        return;
        }

        // Kiểm tra số điện thoại
        const phoneError = validatePhoneNumber(phone);
        if (phoneError) {
            setError(phoneError);
            return;
        }

        setError("");
        try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, "Users", user.uid), {
            Username: username,
            Email: email,
            Phone: phone,
        });
        setShowSuccess(true);
        } catch (err) {
        setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 mt-30 pt-20">
            <StartNavbar />
            <div className="flex flex-col items-center justify-center flex-grow">
                <div className="rounded-md border shadow-lg p-11 bg-white max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 text-center font-Roboto_Mono">Sign Up</h2>
                <div className="flex items-center justify-center space-x-6 my-4">
                    <FaFacebook className="text-blue-600 text-4xl cursor-pointer" onClick={handleFacebookSignup} />
                    <FaGoogle className="text-red-500 text-4xl cursor-pointer" onClick={handleGoogleSignup} />
                    <FaGithub className="text-black text-4xl cursor-pointer" onClick={handleGithubSignup} />
                </div>
                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-2 text-gray-500 text-sm">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form onSubmit={handleSignup}>
                    <div className="space-y-4">
                    <TextInput label="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <TextInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <TextInput label="Phone Number" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    <TextInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <TextInput label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    <div className="flex justify-center mt-6">
                    <PrimaryButton className="w-auto flex justify-center px-3 py-1 text-lg" type="submit">Sign Up</PrimaryButton>
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