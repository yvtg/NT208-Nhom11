import { useState } from "react";
import { FaEye, FaEyeSlash, FaSyncAlt } from "react-icons/fa";
import FileInput from "./FileInput";
import AvatarInput from "./AvatarInput";
import Select from "./Select";

const TextInput = ({ label, type, value, onChange, placeholder }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => setShowPassword(!showPassword);

    const selectOptions = [
        {label:"₫VNĐ", value:"vnd"},
        {label:"$USD", value:"usd"}
    ]

    return (
        <div className="flex items-center gap-4">
            {/* Label */}
            <label className=" w-1/3 text-gray-700 font-medium">{label}</label>

            {/* Input + Icon */}
            <div className="relative w-2/3">

                {type === "textarea" ? (
                    <textarea
                        value={value}
                        placeholder={placeholder}
                        className="w-full p-2 border border-darkPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-darkPrimary resize-none"
                        rows="4"
                    />
                ) : type === "file" ? (
                    <FileInput className="!w-full"/>
                ) : type === "link" ? (
                    <input
                        type="url"
                        value={value}
                        placeholder={placeholder}
                        className=" w-full p-2 border border-darkPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-darkPrimary"
                    /> 
                ) : type === "avatar" ? (
                    <AvatarInput />
                )  : type === "money" ? (
                    <div className="flex gap-2">
                        <input
                            type={type}
                            value={value}
                            placeholder={placeholder}
                            className="flex-1 p-2 border border-darkPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-darkPrimary"
                        />
                        <span className="flex-1">
                            <Select options={selectOptions} />
                        </span>
                    </div>
                ) : ( 
                    <input
                        type={type === "password" && !showPassword ? "password" : type}
                        value={value}
                        placeholder={placeholder}
                        className="w-full p-2 border border-darkPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-darkPrimary"
                    />
                )}

                {/* Icon Ẩn/Hiện Mật Khẩu */}
                {type === "password" && (
                    <span
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-Primary cursor-pointer"
                        onClick={togglePassword}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                )}

                {/* Nút Refresh OTP */}
                {type === "otp" && (
                    <span
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-darkPrimary cursor-pointer"
                        onClick={() => alert("OTP Resend!")}
                    >
                        <FaSyncAlt />
                    </span>
                )}
            </div>
        </div>
    );
};

export default TextInput;
