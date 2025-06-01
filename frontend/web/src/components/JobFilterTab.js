import { useState } from "react";

const JobFilterTab = ({ onSelect }) => {
    const [activeTab, setActiveTab] = useState("Best Match");

    const tabs = ["Best Match", "Newest", "Save"];

    return (
        <div className="flex space-x-4 border-b border-gray-300 mt-6">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => {
                        setActiveTab(tab);
                        onSelect(tab);
                    }}
                    className={`px-4 py-2 font-semibold ${
                        activeTab === tab ? "border-b-2 border-black" : "text-gray-400"
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default JobFilterTab;
