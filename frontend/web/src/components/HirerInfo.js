import { FaPhoneAlt, FaEnvelope, FaLinkedin } from "react-icons/fa";
import PrimaryButton from "./PrimaryButton";
const HirerInfo = () => {
    return (
        <div className="bg-white p-5 rounded-lg shadow-md w-80">

            <div className="flex flex-col items-center">
                <img 
                    src="/images/avatar.png" 
                    alt="Hirer Avatar" 
                    className="w-16 h-16 rounded-full mb-2"
                />
                <p className="font-semibold text-lg">username</p>
                <p className="text-sm text-gray-500">email@gmail.com</p>
                {/* Rating stars (chỉnh sửa để hiển thị rating động nếu cần) */}
                <div className="flex my-1">
                    {[...Array(5)].map((_, index) => (
                        <span key={index} className="text-gray-400 text-lg">★</span>
                    ))}
                </div>
                <PrimaryButton>CONTACT</PrimaryButton>
            </div>

            {/* Infor*/}
            <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                    <FaPhoneAlt className="text-gray-600" />
                    <p className="text-gray-700 text-sm">+84 123 456 789</p>
                </div>
                <div className="flex items-center space-x-2">
                    <FaEnvelope className="text-gray-600" />
                    <p className="text-gray-700 text-sm">email@gmail.com</p>
                </div>
                <div className="flex items-center space-x-2">
                    <FaLinkedin className="text-gray-600" />
                    <p className="text-gray-700 text-sm">username</p>
                </div>
            </div>
        </div>
    );
};

export default HirerInfo;
