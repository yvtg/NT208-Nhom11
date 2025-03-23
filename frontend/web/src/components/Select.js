const Select = ({ options = [], onChange, label }) => {
    return (
        <div className="flex items-center gap-4">
            
            <label className="w-1/3 text-gray-700 font-medium">{label}</label>

            <div className="relative w-2/3">
                <select
                    className="w-full p-2 border border-darkPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-darkPrimary resize-none
                    cursor-pointer"
                    onChange={(e) => onChange?.(e.target.value)}
                >
                    {options.length === 0 ? (
                    <option disabled>No options available</option>
                    ) : (
                    options.map((option, index) => (
                        <option key={index} value={option.value} className="hover:bg-gray-100 rounded-sm">
                        {option.label}
                        </option>
                    ))
                    )}
                </select>
            </div>
        </div>
    );
};

export default Select;