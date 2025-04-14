import DefaultNavbar from "../../components/DefaultNavbar";
import PrimaryButton from "../../components/PrimaryButton";
import ChatIcon from "../../components/ChatIcon";
import TextInput from "../../components/TextInput";
import Select from "../../components/Select";
import { useState } from "react";
import { createProject } from "../../api/projectAPI.js";

const PostJob = () => {
  const fieldOptions = [
    { value: "tech", label: "tech" },
    { value: "design", label: "design" },
    { value: "marketing", label: "marketing" },
    { value: "music", label: "music" },
    { value: "writing", label: "writing" },
    { value: "video", label: "video" },
  ];

  const workingTypeOptions = [
    { value: "remote", label: "remote" },
    { value: "onsite", label: "onsite" },
    { value: "hybrid", label: "hybrid" },
  ];

  const [Field, setField] = useState("");
  const [WorkingType, setWorkingType] = useState("");
  const [ExpiredDate, setExpiredDate] = useState("");
  const [Budget, setBudget] = useState("");
  const [Description, setDescription] = useState("");
  const [ProjectName, setProjectName] = useState("");

  const handlePostJob = async (e) => {
    e.preventDefault();

    // Validation
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

      const response = await createProject({
        ProjectName,
        Field,
        ExpiredDate: expiredDateObj,
        WorkingType,
        Budget,
        Description,
      });

      console.log("Project created:", response);
    } catch (error) {
      console.error("Error posting job:", error);
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
