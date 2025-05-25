import { FaPhoneAlt, FaEnvelope, FaLinkedin } from "react-icons/fa";
import PrimaryButton from "./PrimaryButton";
const HirerInfo = ({ project }) => {
    return (
        <div className="bg-white p-5 rounded-lg shadow-md w-80">

            <div className="flex flex-col items-center">
                <img 
                    src="/images/avatar.png" 
                    alt="Hirer Avatar" 
                    className="w-16 h-16 rounded-full mb-2"
                />
                <p className="font-semibold text-lg">{project?.username}</p>
                <p className="text-sm text-gray-500">{project.email}</p>
                {/* Rating stars (chỉnh sửa để hiển thị rating động nếu cần) */}
                <div className="flex my-1">
                    {[...Array(5)].map((_, index) => (
                        <span key={index} className="text-gray-400 text-lg">★</span>
                    ))}
                </div>
                <PrimaryButton>LIÊN HỆ</PrimaryButton>
            </div>

            {/* Infor*/}
            <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                    <FaPhoneAlt className="text-gray-600" />
                    <p className="text-gray-700 text-sm">{project.phonenumber}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <FaEnvelope className="text-gray-600" />
                    <p className="text-gray-700 text-sm">{project.email}</p>
                </div>
            </div>
        </div>
    );
};

export default HirerInfo;
