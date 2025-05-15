import DefaultNavbar from "../../components/DefaultNavbar";
import PrimaryButton from "../../components/PrimaryButton";
import ChatIcon from "../../components/ChatIcon";
import TextInput from "../../components/TextInput";
import Select from "../../components/Select";
import { useState, useEffect } from "react";

const PostJob = () => {
  const [fieldOptions, setFieldOptions] = useState([]);
  const [Field, setField] = useState(""); // Đây sẽ là field_id
  const [WorkingType, setWorkingType] = useState("");
  const [ExpiredDate, setExpiredDate] = useState("");
  const [Budget, setBudget] = useState("");
  const [Description, setDescription] = useState("");
  const [ProjectName, setProjectName] = useState("");

  const workingTypeOptions = [
    { value: "remote", label: "remote" },
    { value: "onsite", label: "onsite" },
    { value: "hybrid", label: "hybrid" },
  ];

  // Load field list từ API khi component mount
  useEffect(() => {
    const fetchFields = async () => {
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

    fetchFields();
  }, []);

  const handlePostJob = async (e) => {
    e.preventDefault();

    if (
      !ProjectName.trim() ||
      !Field ||
      !WorkingType ||
      !ExpiredDate ||
      !Budget.trim() ||
      !Description.trim()
    ) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const expiredDateObj = new Date(ExpiredDate);
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/project/createproject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ProjectName,
          Field, // là field_id
          ExpiredDate: expiredDateObj,
          WorkingType,
          Budget,
          Description,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Project created:", result);
        alert("✅ Project posted successfully!");
        setField("");
        setWorkingType("");
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
                value={ProjectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />

              <Select
                label="Field"
                options={fieldOptions}
                value={Field}
                onChange={(val) => setField(val)}
                placeholder="Select field"
              />

              <TextInput
                label="Expired Date"
                type="datetime-local"
                value={ExpiredDate}
                onChange={(e) => setExpiredDate(e.target.value)}
                required
              />

              <Select
                label="Working type"
                options={workingTypeOptions}
                value={WorkingType}
                onChange={(val) => setWorkingType(val)}
                placeholder="Select working type"
              />

              <TextInput
                label="Budget"
                type="text"
                placeholder="Enter Budget"
                value={Budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />

              <TextInput
                label="Job Description"
                type="textarea"
                placeholder="Enter job description"
                value={Description}
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
