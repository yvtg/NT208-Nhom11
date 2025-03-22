const TertiaryButton = ({ children, onClick, className, type = "button" }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`text-darkPrimary px-3 py-1 
                hover:text-[#B0AABD]
                drop-shadow-md drop-shadow-lighPrimary ${className}`}
        >
            {children}
        </button>
    );
};

export default TertiaryButton;
