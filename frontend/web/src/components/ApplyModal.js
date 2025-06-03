import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { applyToProject } from '../api/projectAPI';

const ApplyModal = ({ project, onClose, userData }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [cvFile, setCvFile] = useState(null);
    const [hasSelectedNewCv, setHasSelectedNewCv] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userData) {
            setFullName(userData.username || '');
            setEmail(userData.email || '');
            setPhone(userData.phonenumber || '');
        }
    }, [userData]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log('File selected:', file);
        setCvFile(file);
        setHasSelectedNewCv(!!file);
        console.log('hasSelectedNewCv after selection:', !!file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Submitting form...');
        console.log('Current state - cvFile:', cvFile);
        console.log('Current state - hasSelectedNewCv:', hasSelectedNewCv);
        console.log('Current state - userData?.cv_url:', userData?.cv_url);

        if (!hasSelectedNewCv && !userData?.cv_url) {
            console.log('Validation failed: No new CV and no existing CV.');
            setError('Vui lòng tải lên CV mới hoặc đảm bảo bạn có CV đã lưu trong hồ sơ.');
            return;
        }

        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('introduction', introduction);

        if (hasSelectedNewCv && cvFile) {
             console.log('Appending new CV file to FormData.');
             formData.append('cvFile', cvFile);
        } else if (userData?.cv_url) {
             console.log('Appending useExistingCv flag to FormData.');
             formData.append('useExistingCv', 'true');
        }

        // Log FormData contents - Note: Directly inspecting FormData values is tricky
        // This loop helps visualize what's being appended
        console.log('FormData contents before API call:');
        for (let [key, value] of formData.entries()) {
             console.log(`${key}:`, value);
        }

        try {
            console.log('Calling applyToProject API...');
            await applyToProject(project.projectid, formData);
            console.log('applyToProject API call successful.');
            alert('Hồ sơ của bạn đã được gửi thành công!');
            onClose();
        } catch (err) {
            console.error('Error submitting application:', err);
            setError(err.message || 'Đã xảy ra lỗi khi nộp hồ sơ.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto p-4 sm:p-6">
            <div className="bg-white rounded-lg shadow-xl p-6 w-[80%] sm:w-[80%] md:w-[500px] lg:w-[600px] mx-auto relative">
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800" disabled={isLoading}>
                    <IoClose size={24} />
                </button>

                <h2 className="text-2xl font-bold text-darkPrimary mb-4">Ứng tuyển {project?.projectname}</h2>

                <form onSubmit={handleSubmit}>
                    {/* Upload CV Section */}
                    <div className="mb-4 border border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Chọn CV để ứng tuyển</h3>
                        {userData?.cv_url && !hasSelectedNewCv && (
                            <div className="bg-gray-50 border border-darkPrimary rounded-md p-3 mb-3 text-left">
                                <p className="text-darkPrimary-800 font-medium">CV ứng tuyển gần nhất: {userData.cv_url.split('/').pop()} <span className="text-blue-600 cursor-pointer">Xem</span></p>
                                <p className="text-sm text-gray-700">Họ và tên: {userData.username}</p>
                                <p className="text-sm text-gray-700">Email: {userData.email}</p>
                                <p className="text-sm text-gray-700">Số điện thoại: {userData.phonenumber}</p>
                            </div>
                        )}

                        <div>
                            <input type="file" id="cvUpload" className="hidden" onChange={handleFileChange} accept=".doc,.docx,.pdf" disabled={isLoading} />
                            <label htmlFor="cvUpload" className={`cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                {hasSelectedNewCv ? 'Chọn lại CV' : 'Tải lên CV từ máy tính, chọn hoặc kéo thả'}
                            </label>
                            {cvFile && hasSelectedNewCv && <p className="mt-2 text-sm text-darkPrimary-600">Đã chọn tệp mới: {cvFile.name}</p>}
                            {!hasSelectedNewCv && userData?.cv_url && <p className="mt-2 text-sm text-darkPrimary-600">Sử dụng CV đã lưu.</p>}
                            {!hasSelectedNewCv && !userData?.cv_url && <p className="mt-2 text-sm text-darkPrimary-600">Chưa có CV nào được chọn.</p>}
                            <p className="text-xs text-gray-500 mt-1">Hỗ trợ định dạng .doc, .docx, .pdf có kích thước dưới 5MB</p>
                            {error && error.includes('CV') && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        </div>
                    </div>

                    {/* Personal Info Section */}
                    <div className="mb-4">
                         <h3 className="text-lg font-semibold text-gray-700 mb-2">Thông tin cá nhân</h3>
                         <input
                            type="text"
                            placeholder="Họ và tên"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring focus:ring-darkPrimary-200"
                            required
                            disabled={isLoading}
                         />
                         <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring focus:ring-darkPrimary-200"
                            required
                            disabled={isLoading}
                         />
                          <input
                            type="tel"
                            placeholder="Số điện thoại"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-darkPrimary-200"
                            required
                            disabled={isLoading}
                         />
                         {error && !error.includes('CV') && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>

                    {/* Introduction Section */}
                     <div className="mb-6">
                         <h3 className="text-lg font-semibold text-gray-700 mb-2">Thư giới thiệu</h3>
                         <textarea
                            placeholder="Viết giới thiệu ngắn gọn về bản thân (điểm mạnh, điểm yếu) và nêu rõ mong muốn, lý do bạn muốn ứng tuyển cho vị trí này."
                            value={introduction}
                            onChange={(e) => setIntroduction(e.target.value)}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-darkPrimary-200"
                            disabled={isLoading}
                         ></textarea>
                     </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100" disabled={isLoading}>
                            Hủy
                        </button>
                        <button type="submit" className="px-6 py-2 bg-darkPrimary text-white rounded-md hover:bg-lightPrimary disabled:opacity-50" disabled={isLoading}>
                            {isLoading ? 'Đang nộp...' : 'Nộp hồ sơ ứng tuyển'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplyModal; 