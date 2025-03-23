import { useState } from "react";

const FileInput = ({ label }) => {
    const [fileName, setFileName] = useState("Không có tệp nào được chọn");

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
        } else {
            setFileName("No file chosen");
        }
    };

    return (
        <div className="flex items-center gap-4 w-full">

            {/* Ô nhập và nút chọn tệp */}
            <div className="w-full">
                {/* Hiển thị tên file */}
                <input
                    type="text"
                    value={fileName}
                    readOnly
                    className="w-full h-10 border border-darkPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-darkPrimary pr-24" // Chừa khoảng trống bên phải
                />

                {/* Input file ẩn */}
                <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    accept="application/pdf"
                    onChange={handleFileChange}
                />

                {/* Nút Chọn Tệp (bên phải) */}
                <label
                    htmlFor="fileInput"
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-darkPrimary text-white px-4 py-2 rounded-md cursor-pointer"
                >
                    Chọn tệp
                </label>
            </div>
        </div>
    );
};

export default FileInput;
