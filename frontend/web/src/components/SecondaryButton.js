const SecondaryButton = ({ children, onClick, className, type = "button" }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`border border-darkPrimary text-darkPrimary 
                px-3 py-1 rounded-md hover:border-[#B0AABD] 
                hover:text-[#B0AABD] 
                drop-shadow-md drop-shadow-lighPrimary ${className}`}
        >
            {children}
        </button>
    );
};

export default SecondaryButton;
