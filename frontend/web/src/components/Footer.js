import { FaSquareTwitter } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";

const Footer = () => {
    return (
        <div className="flex items-center fixed bottom-0 w-full h-12 bg-lightPrimary text-white sm:px-2 lg:px-10">
            <div className="flex justify-start align-middle">
                <FaSquareTwitter className="w-7 h-7 mx-2 text-white cursor-pointer"/>
                <FaInstagramSquare className="w-7 h-7 mx-2 text-white cursor-pointer"/>
                <FaFacebookSquare className="w-7 h-7 mx-2 text-white cursor-pointer"/>
            </div>

            <div className="fixed right-6">
                <p className="text-white-2 font-bold ">
                    © 2025 
                </p>
            </div>
        </div>
    );
}

export default Footer;