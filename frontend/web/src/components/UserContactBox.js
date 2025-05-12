import React from "react";
import { FiPhone, FiMail } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";

const UserContactBox = ({ phone, email, linkedin }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-6 items-center w-80">
      <button className="bg-blue-700 text-white font-semibold py-2 px-8 rounded-lg shadow">CONTACT</button>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center gap-3 text-lg">
          <FiPhone />
          <span>{phone}</span>
        </div>
        <div className="flex items-center gap-3 text-lg">
          <FiMail />
          <span>{email}</span>
        </div>
        <div className="flex items-center gap-3 text-lg">
          <FaLinkedin />
          <span>{linkedin}</span>
        </div>
      </div>
    </div>
  );
};

export default UserContactBox; 