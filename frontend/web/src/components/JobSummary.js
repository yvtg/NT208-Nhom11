const JobSummary = ({ title, description, tags =[ ], updatedAt, salary }) => {
    return (
        <div className="bg-white shadow-md rounded-xl p-4 w-80 relative">
            <h3 className="text-lg font-semibold">{title}</h3>

                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{description}</p>

            <div className="flex gap-2 mt-3 flex-wrap">
                {tags.map((tag, index) => (
                    <span key={index} className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="flex justify-between items-center mt-3">
                <p className="text-gray-500 text-xs">Updated {updatedAt}</p>
                <p className="text-black font-bold">${salary}</p>
            </div>
        </div>
    );
};

export default JobSummary;
