import { useState } from "react";

const JobFilterTab = ({ onSelect }) => {
    const [activeTab, setActiveTab] = useState("Phù hợp nhất");

    const tabs = ["Best Match", "Newest", "Save"];

    return (
        <div className="w-full bg-white rounded-xl shadow-sm p-1">
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab);
                            onSelect(tab);
                        }}
                        className={`flex-1 min-w-[120px] px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                            activeTab === tab 
                            ? "bg-darkPrimary text-white shadow-md" 
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default JobFilterTab;
