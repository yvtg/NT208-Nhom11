import { FaSearch, FaBell, FaUserCircle, FaPaperPlane } from "react-icons/fa";

const DefaultNavbar = () => {
    return (
        <nav className="bg-white shadow-md py-2 sm:px-2 lg:px-10 flex justify-between items-center rounded-lg fixed top-0 left-0 w-full z-50">
        {/* Logo */}
        <div className="text-2xl text-darkPrimary lobster  font-lobster">SkillLink</div>

        {/* Thanh tìm kiếm */}
        <div className="flex-1 lg:mx-6 sm:mx-2">
            <div className="relative">
                <input
                    type="text"
                    placeholder="SEARCH"
                    className="w-full px-4 py-2 rounded-full shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <FaSearch className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500" />
            </div>
        </div>

        {/* Menu */}
        <div className="hidden md:flex justify-center space-x-6 text-gray-700 font-semibold">
            <a href="#" className="hover:text-blue-600 pt-1">Home</a>
            <a href="#" className="hover:text-blue-600 pt-1">Check CV</a>
            <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">Post</button>
        
                {/* Nút icon */}
                <div className="flex space-x-3 items-center">
                    <FaPaperPlane className="text-gray-700 text-xl cursor-pointer hover:text-blue-600" />
                    <FaBell className="text-gray-700 text-xl cursor-pointer hover:text-blue-600" />
                    <FaUserCircle className="text-gray-700 text-xl cursor-pointer hover:text-blue-600" />
                </div>
        
                {/* Nút đăng nhập / đăng ký */}
                <div className="space-x-2 px-4">
                    <button className="border border-blue-500 text-blue-500 px-3 py-1 rounded-md hover:bg-blue-100">
                    Sign in
                    </button>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">
                    Sign up
                    </button>
                </div>
        </div>
        </nav>
    );
};

export default DefaultNavbar;
