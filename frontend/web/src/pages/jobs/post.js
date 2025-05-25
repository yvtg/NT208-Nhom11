import DefaultNavbar from "../../components/DefaultNavbar";
import PrimaryButton from "../../components/PrimaryButton";
import ChatIcon from "../../components/ChatIcon";
import TextInput from "../../components/TextInput";
import Select from "../../components/Select";
import { useState, useEffect } from "react";

const PostJob = () => {
  const [fieldOptions, setFieldOptions] = useState([]);
  const [field, setField] = useState(""); // Đây sẽ là field_id

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [workingType, setWorkingType] = useState("");

  const [workingPlace, setWorkingPlace] = useState("");

  const [expiredDate, setExpiredDate] = useState("");

  const [budget, setBudget] = useState("");

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
        const res = await fetch("http://localhost:3000/api/project/getfields");
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

    if (
      !projectName.trim() ||
      !field ||
      skills.length === 0 ||
      !workingType ||
      !workingPlace ||
      !expiredDate ||
      !budget.trim() ||
      !description.trim()
    ) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const expiredDateObj = new Date(expiredDate);
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/project/createproject", {
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
          budget,
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
    <div className="min-h-screen flex flex-col">
      <DefaultNavbar />

      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="rounded-md border-divideColor shadow-lg shadow-lightPrimary p-11 bg-white sm:w-auto lg:w-1/2">
          <h2 className="flex text-5xl font-bold justify-center items-start mb-10">
            Post your job
          </h2>
          <form onSubmit={handlePostJob}>
            <div className="space-y-4">
              <TextInput
                label="Job title"
                type="text"
                placeholder="Enter job title"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />

              <Select
                label="field"
                options={fieldOptions}
                value={field}
                onChange={(val) => setField(val)}
                placeholder="Select field"
              />

              {/* skills */}
              <div className="flex items-start gap-4">
                <label className="w-1/3 mb-2 font-medium text-gray-700">Skills</label>
                <div className="w-2/3">
                    <div className="px-4 py-2 border border-darkPrimary rounded-md focus-within:ring-2 focus-within:ring-darkPrimary mb-2">
                        <div className="flex flex-wrap gap-2 mb-2">
                            {skills.map((skill, index) => (
                                <div key={index} className="flex items-center bg-lightPrimary rounded-md px-3 py-1">
                                    <span>{skill}</span>
                                    <button 
                                        type="button" 
                                        className="ml-2 text-gray-500 hover:text-gray-700"
                                        onClick={() => handleRemoveSkill(skill)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <input
                                type="text"
                                className="outline-none flex-grow min-w-[100px] bg-transparent"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                    </div>
                    {skills.length > 0 && (
                        <div className="flex justify-end">
                            <button 
                                type="button"
                                className="text-sm text-red-500 hover:text-red-700"
                                onClick={handleRemoveAllSkills}
                            >
                                Remove All
                            </button>
                        </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                        {skills.length} skill đã được thêm
                    </div>
                </div>
              </div>

              <TextInput
                label="Expired Date"
                type="datetime-local"
                value={expiredDate}
                onChange={(e) => setExpiredDate(e.target.value)}
                required
              />

              <Select
                label="Working type"
                options={workingTypeOptions}
                value={workingType}
                onChange={(val) => setWorkingType(val)}
                placeholder="Select working type"
              />

              <TextInput
                label="Working place"
                type="text"
                placeholder="Enter Working place"
                value={workingPlace}
                onChange={(e) => setWorkingPlace(e.target.value)}
                required
              />

              <TextInput
                label="budget"
                type="text"
                placeholder="Enter budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />

              <TextInput
                label="Job description"
                type="textarea"
                placeholder="Enter job description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-center mt-10">
              <PrimaryButton
                type="submit"
                className="w-auto flex justify-center px-3 py-1 text-3xl"
              >
                POST
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
