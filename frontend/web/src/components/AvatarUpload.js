import { useState } from "react";

function AvatarUpload() {
    const [uploadImage, setUploadImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setUploadImage(file);

        if (file) {
        const reader = new FileReader();
        reader.onload = (event) => setPreviewUrl(event.target.result);
        reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-4 max-w-md mx-auto">
            <label className="block text-sm font-medium text-gray-700">
                Ảnh đại diện
            </label>

            <div className="flex items-center space-x-4">
                {previewUrl ? (
                <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border"
                />
                ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                </div>
                )}

                <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                            file:rounded-full file:border-0 file:text-sm file:font-semibold 
                            file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
            </div>
        </div>
    );
}

export default AvatarUpload;
