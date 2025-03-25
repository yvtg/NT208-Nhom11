import { useState } from "react";
import { FaCameraRotate } from "react-icons/fa6";

const AvatarInput = () => {
    const [avatar, setAvatar] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setAvatar(imageUrl);
        }
    };

    return (
        <div className="flex items-center gap-4">

            {/* Avatar Container */}
            <div className="relative w-20 h-20">
                {/* Avatar Image */}
                <img
                    src={avatar || "/images/avatar.png"}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full border border-gray-300 object-cover"
                />

                {/* Input File Ẩn */}
                <input
                    type="file"
                    id="avatarInput"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                {/* Nút Chọn Ảnh */}
                <label
                    htmlFor="avatarInput"
                    className="absolute bottom-0 right-0 bg-darkPrimary text-white p-1 rounded-full cursor-pointer border border-white"
                >
                    <FaCameraRotate size={14} />
                </label>
            </div>
        </div>
    );
};

export default AvatarInput;
