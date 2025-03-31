import { useState } from "react";
import { FaStar } from "react-icons/fa";

const JobFilter = ({ fields, jobStates, onFilterChange }) => {
  const [filters, setFilters] = useState({
    budgetMin: "",
    budgetMax: "",
    field: fields?.length ? fields[0].value : "",
    skills: [],
    rating: 0,
    workingType: "onsite",
    jobState: jobStates?.length ? jobStates[0].value : "",
  });

  const updateFilter = (key, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleSkillRemove = (skill) => {
    updateFilter(
      "skills",
      filters.skills.filter((s) => s !== skill)
    );
  };

  return (
    <div className="bg-white p-5 w-80 rounded-lg drop-shadow-md border">
      <h2 className="font-semibold text-lg">Filter</h2>
      <hr className="my-2" />

      {/* Budget */}
      <div>
        <label className="text-sm font-medium">Budget</label>
        <div className="flex space-x-2 mt-1">
          <input
            type="number"
            placeholder="Min"
            className="border p-1 w-1/2 rounded-md text-sm"
            value={filters.budgetMin}
            onChange={(e) => updateFilter("budgetMin", e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            className="border p-1 w-1/2 rounded-md text-sm"
            value={filters.budgetMax}
            onChange={(e) => updateFilter("budgetMax", e.target.value)}
          />
        </div>
      </div>

      {/* Field */}
      <div className="mt-3">
        <label className="text-sm font-medium">Field</label>
        <select
          className="border p-1 w-full rounded-md text-sm mt-1"
          value={filters.field}
          onChange={(e) => updateFilter("field", e.target.value)}
        >
          {fields.map((field) => (
            <option key={field.value} value={field.value}>
              {field.label}
            </option>
          ))}
        </select>
      </div>

      {/* Skill */}
      <div className="mt-3">
        <label className="text-sm font-medium">Skill</label>
        <div className="border p-2 rounded-md flex flex-wrap gap-2 mt-1">
          {filters.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full cursor-pointer"
              onClick={() => handleSkillRemove(skill)}
            >
              {skill} ✖
            </span>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="mt-3">
        <label className="text-sm font-medium">Rating</label>
        <div className="flex space-x-1 mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`cursor-pointer ${
                filters.rating >= star ? "text-yellow-500" : "text-gray-300"
              }`}
              onClick={() => updateFilter("rating", star)}
            />
          ))}
        </div>
      </div>

      {/* Working Type */}
      <div className="mt-3">
        <label className="text-sm font-medium">Working Type</label>
        <div className="flex flex-col text-sm mt-1">
          {["onsite", "remote", "hybrid"].map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="radio"
                name="workingType"
                value={type}
                checked={filters.workingType === type}
                onChange={() => updateFilter("workingType", type)}
                className="accent-blue-500"
              />
              <span className="capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Job State */}
      <div className="mt-3">
        <label className="text-sm font-medium">Job State</label>
        <select
          className="border p-1 w-full rounded-md text-sm mt-1"
          value={filters.jobState}
          onChange={(e) => updateFilter("jobState", e.target.value)}
        >
          {jobStates.map((state) => (
            <option key={state.value} value={state.value}>
              {state.label}
            </option>
          ))}
        </select>
      </div>

      {/* Apply Button */}
      <button
        className="mt-4 bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700 transition"
        onClick={() => onFilterChange(filters)}
      >
        Apply
      </button>
    </div>
  );
};

export default JobFilter;
