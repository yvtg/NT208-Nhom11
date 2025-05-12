import { FaStar, FaRegStar } from "react-icons/fa";

const UserInfo = ({ username, email, avatar, rating }) => {
    return (
        <div className="bg-white p-6 relative rounded-lg drop-shadow-md w-[300px] h-[200px] flex flex-col justify-center">
            <div className="flex items-center">
                <img src={avatar} alt="User Avatar" className="w-14 h-14 rounded-full mr-4" />
                
                <div>
                    <p className="font-semibold text-lg">{username}</p>
                    <p className="text-sm text-gray-500">{email}</p>
                </div>
            </div>

            <div className="flex items-center mt-4">
                {Array.from({ length: 5 }, (_, index) => (
                    index < rating ? (
                        <FaStar key={index} className="text-yellow-400 text-lg" />
                    ) : (
                        <FaRegStar key={index} className="text-gray-400 text-lg" />
                    )
                ))}
            </div>
        </div>
    );
};

export default UserInfo;
