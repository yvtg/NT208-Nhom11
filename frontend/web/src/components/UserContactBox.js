import React from "react";
import { FiPhone, FiMail } from "react-icons/fi";
import PrimaryButton from "./PrimaryButton";

const UserContactBox = ({ phone, email }) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800">Thông tin liên hệ</h3>
        <p className="text-sm text-gray-500 mt-1">Liên hệ trực tiếp với freelancer</p>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Button */}
        <PrimaryButton 
          className="w-full font-medium text-base py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        >
          LIÊN HỆ NGAY
        </PrimaryButton>

        {/* Info user */}
        <div className="mt-6 space-y-4">
          <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <FiPhone className="text-xl text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
              <p className="text-gray-800 font-medium break-words">{phone || 'Chưa cập nhật'}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <FiMail className="text-xl text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="text-gray-800 font-medium break-words">{email || 'Chưa cập nhật'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserContactBox;
