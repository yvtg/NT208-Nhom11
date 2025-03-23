import DefaultNavbar from "../components/DefaultNavbar";
import PrimaryButton from "../components/PrimaryButton";
import TextInput from "../components/TextInput";
import ChatIcon from "../components/ChatIcon";
import { FaFacebook, FaGoogle , FaLinkedin } from "react-icons/fa";
import Footer from "../components/Footer"; 

const SignUp = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100 mt-30 pt-20">
            <DefaultNavbar />

            <div className="flex flex-col items-center justify-center flex-grow ">
                <div className="rounded-md border shadow-lg p-11 bg-white max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 text-center font-Roboto_Mono">
                        Sign Up
                    </h2>
                    
                    {/*sign up with other*/ }
                    <div className="flex items-center justify-center space-x-6 my-4">
      <FaFacebook className="text-blue-600 text-4xl cursor-pointer" />
      <FaGoogle className="text-red-500 text-4xl cursor-pointer" />
      <FaLinkedin className="text-blue-700 text-4xl cursor-pointer" />
                    </div>
                    {/*line OR8*/ }
                    <div className="flex items-center my-4">
  <div className="flex-grow border-t border-gray-300"></div>
  <span className="mx-2 text-gray-500 text-sm">OR</span>
  <div className="flex-grow border-t border-gray-300"> </div> 
                    </div>



                    <div className="space-y-4">
                        <TextInput label="Username" type="text" />
                        <TextInput label="Email" type="email" />
                        <TextInput label="Phone Number" type="text" />
                        <TextInput label="Password" type="password" />
                        <TextInput label="Confirm Password" type="password" />
                        <TextInput label="OTP" type="text" />
                    </div>
                    
                    <div className="flex justify-center mt-6">
                        <PrimaryButton className="w-auto flex justify-center px-3 py-1 text-lg">Sign Up</PrimaryButton>
                    </div>
                </div>
            </div>
            
            <ChatIcon />
            <Footer></Footer>
        </div>
    );
};

export default SignUp;