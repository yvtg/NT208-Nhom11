import DefaultNavbar from "../../components/DefaultNavbar";
import PrimaryButton from "../../components/PrimaryButton";
import ChatIcon from "../../components/ChatIcon";
import TextInput from "../../components/TextInput";
import Select from "../../components/Select";
import { useState, useEffect } from "react";
import { formatCurrency, getRawNumber } from "../../utils/formatCurrency";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

const PostJob = ({onLogout}) => {
  const [fieldOptions, setFieldOptions] = useState([]);
  const [field, setField] = useState(""); // Đây sẽ là field_id

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [workingType, setWorkingType] = useState("");

  const [workingPlace, setWorkingPlace] = useState("");

  const [expiredDate, setExpiredDate] = useState("");

  const [budget, setBudget] = useState("");
  const [rawBudget, setRawBudget] = useState("");

  const [description, setDescription] = useState("");

  const [projectName, setProjectName] = useState("");

  const workingTypeOptions = [
    { value: "remote", label: "remote" },
    { value: "onsite", label: "onsite" },
    { value: "hybrid", label: "hybrid" },
  ];

  // Load field list từ API khi component mount
  useEffect(() => {
    const fetchfields = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/project/getfields`);
        const data = await res.json();
        const options = data.map((field) => ({
          value: field.field_id,
          label: field.field_name,
        }));
        setFieldOptions(options);
      } catch (err) {
        console.error("Failed to fetch fields:", err);
        alert("Failed to load field options.");
      }
    };

    fetchfields();
  }, []);

  // thêm skill
  const handleAddSkill = (e) => {
      if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
          e.preventDefault();
          const newSkill = skillInput.trim();
          if (newSkill && !skills.includes(newSkill)) {
              setSkills([...skills, newSkill]);
          }
          setSkillInput("");
      }
  };

  // xóa skill = back space
  const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
          handleAddSkill(e);
      } else if (e.key === 'Backspace' && skillInput === '' && skills.length > 0) {
          // Xóa skill cuối cùng khi bấm backspace và input trống
          e.preventDefault();
          const newSkills = [...skills];
          newSkills.pop();
          setSkills(newSkills);
      }
  };

  //  xóa skill
  const handleRemoveSkill = (skillToRemove) => {
      setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  // xóa tất cả skills
  const handleRemoveAllSkills = () => {
      setSkills([]);
  };

  const handlePostJob = async (e) => {
    e.preventDefault();

    try {
      const expiredDateObj = new Date(expiredDate);
      const token = localStorage.getItem("token");

      const response = await fetch(`${BACKEND_URL}/api/project/createproject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectName,
          field, // là field_id
          skills,
          expiredDate: expiredDateObj,
          workingType,
          workingPlace,
          budget:rawBudget,
          description,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Project created:", result);
        alert("✅ Project posted successfully!");
        setField("");
        setSkills([]);
        setSkillInput("");
        setWorkingType("");
        setWorkingPlace("");
        setExpiredDate("");
        setBudget("");
        setDescription("");
        setProjectName("");
      } else {
        console.error("Server error:", result);
        alert("❌ Failed to post project: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error posting job:", error);
      alert("❌ An error occurred while posting the project.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DefaultNavbar onLogout={onLogout} />

      <div className="flex flex-col items-center justify-center flex-grow py-8 px-4 sm:px-6 mt-9">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
            Đăng dự án
          </h2>
          <form onSubmit={handlePostJob} className="space-y-6">
            <TextInput
              label="Tên công việc"
              type="text"
              placeholder="Nhập tên công việc"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />

            <Select
              label="Lĩnh vực"
              options={fieldOptions}
              value={field}
              onChange={(val) => setField(val)}
              placeholder="Chọn lĩnh vực"
            />

            {/* Skills Section */}
            <div className="space-y-2">
              <label className="block font-medium text-gray-700">Kỹ năng yêu cầu</label>
              <div className="relative">
                <div className="px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-darkPrimary focus-within:border-transparent transition-all">
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <div 
                        key={index} 
                        className="flex items-center bg-lightPrimary rounded-full px-3 py-1 text-sm"
                      >
                        <span>{skill}</span>
                        <button 
                          type="button" 
                          className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      className="outline-none flex-grow min-w-[120px] bg-transparent text-sm"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={skills.length === 0 ? "Nhập kỹ năng và nhấn Enter" : ""}
                    />
                  </div>
                </div>
                {skills.length > 0 && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">
                      {skills.length} kỹ năng đã được thêm
                    </span>
                    <button 
                      type="button"
                      className="text-sm text-red-500 hover:text-red-700 transition-colors"
                      onClick={handleRemoveAllSkills}
                    >
                      Xóa tất cả
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                label="Ngày hết hạn"
                type="datetime-local"
                value={expiredDate}
                onChange={(e) => setExpiredDate(e.target.value)}
                required
              />

              <Select
                label="Hình thức làm việc"
                options={workingTypeOptions}
                value={workingType}
                onChange={(val) => setWorkingType(val)}
                placeholder="Chọn hình thức"
              />
            </div>

            <TextInput
              label="Ngân sách dự án"
              type="text"
              placeholder="Nhập số tiền"
              value={budget}
              onChange={(e) => {
                const input = e.target.value;
                const formatted = formatCurrency(input);
                const raw = getRawNumber(input);

                setBudget(formatted);
                setRawBudget(raw);
              }}
              required
            />

            <div className="space-y-2">
              <label className="block font-medium text-gray-700">Mô tả công việc</label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-darkPrimary focus:border-transparent transition-all min-h-[150px] resize-y"
                placeholder="Nhập mô tả chi tiết về công việc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-center pt-4">
              <PrimaryButton
                type="submit"
                className="w-full md:w-auto px-8 py-3 text-lg font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                Đăng tải
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
      <ChatIcon />
    </div>
  );
};

export default PostJob;
