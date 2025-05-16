import { useState, useEffect } from "react";
import { FaStar, FaSearch } from "react-icons/fa";

const JobFilter = ({ onSearch, initialQuery = "", fields = [], jobStates = [] }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({
    budgetMin: "",
    budgetMax: "",
    field: fields?.length ? fields[0]?.value : "",
    skills: [],
    rating: 0,
    workingType: "onsite",
    jobState: jobStates?.length ? jobStates[0]?.value : "",
  });

  const updateFilter = (key, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      return newFilters;
    });
  };

  const handleSkillRemove = (skill) => {
    updateFilter(
      "skills",
      filters.skills.filter((s) => s !== skill)
    );
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  return (
    <div className="bg-white p-5 w-full max-w-4xl rounded-lg drop-shadow-md border -mt-10 mb-5">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-grow relative">
          <input
            type="text"
            placeholder="Tìm kiếm dự án..."
            className="w-full py-2 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-darkPrimary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-darkPrimary"
            onClick={handleSearch}
          >
            <FaSearch />
          </button>
        </div>
        <button
          className="bg-darkPrimary text-white py-2 px-6 rounded-lg hover:bg-lightPrimary transition"
          onClick={handleSearch}
        >
          Tìm kiếm
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Budget */}
        <div className="w-full md:w-auto">
          <label className="text-sm font-medium">Ngân sách</label>
          <div className="flex space-x-2 mt-1">
            <input
              type="number"
              placeholder="Min"
              className="border p-1 w-20 rounded-md text-sm"
              value={filters.budgetMin}
              onChange={(e) => updateFilter("budgetMin", e.target.value)}
            />
            <input
              type="number"
              placeholder="Max"
              className="border p-1 w-20 rounded-md text-sm"
              value={filters.budgetMax}
              onChange={(e) => updateFilter("budgetMax", e.target.value)}
            />
          </div>
        </div>

        {/* Field */}
        {fields.length > 0 && (
          <div className="w-full md:w-auto">
            <label className="text-sm font-medium">Lĩnh vực</label>
            <select
              className="border p-1 rounded-md text-sm mt-1"
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
        )}

        {/* Rating */}
        <div className="w-full md:w-auto">
          <label className="text-sm font-medium">Đánh giá</label>
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
        <div className="w-full md:w-auto">
          <label className="text-sm font-medium">Hình thức làm việc</label>
          <div className="flex space-x-4 text-sm mt-1">
            {["onsite", "remote", "hybrid"].map((type) => (
              <label key={type} className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="workingType"
                  value={type}
                  checked={filters.workingType === type}
                  onChange={() => updateFilter("workingType", type)}
                  className="accent-darkPrimary"
                />
                <span className="capitalize">
                  {type === "onsite" ? "Tại văn phòng" : type === "remote" ? "Từ xa" : "Kết hợp"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Job State */}
        {jobStates.length > 0 && (
          <div className="w-full md:w-auto">
            <label className="text-sm font-medium">Trạng thái</label>
            <select
              className="border p-1 rounded-md text-sm mt-1"
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
        )}
      </div>
    </div>
  );
};

export default JobFilter;
