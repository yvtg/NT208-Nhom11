import React from "react";
import { FiPhone, FiMail } from "react-icons/fi";
import PrimaryButton from "./PrimaryButton";
const UserContactBox = ({ phone, email }) => {
  return (
<<<<<<< HEAD
    <div className="relative w-72 px-10 py-8 border border-gray-300 rounded-2xl bg-white shadow-sm flex flex-col items-start gap-6">
      {/* Button */}
      <PrimaryButton className="self-center font-bold text-base px-20 py-3 rounded-xl shadow-md transition">
        LIÊN HỆ 
      </PrimaryButton>


      {/* Info user */}
      <div className="flex flex-col gap-6 text-base text-black">
        <div className="flex items-center gap-4">
          <FiPhone className="text-2xl" />
          <span className="tracking-wider">{phone}</span>
=======
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-6 items-center w-80">
      <button className="bg-blue-700 text-white font-semibold py-2 px-8 rounded-lg shadow">Liên hệ </button>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center gap-3 text-lg">
          <FiPhone />
          <span>{phone}</span>
>>>>>>> a9fe9fbd897c9c552d6baa64cb6cb313d667972d
        </div>
        <div className="flex items-center gap-4">
          <FiMail className="text-2xl" />
          <span className="tracking-wider">{email}</span>
        </div>
      </div>

    
     
    </div>
  );
};

export default UserContactBox;
