const PrimaryButton = ({ children, onClick, className, type = "button", disabled }) => {

    return (
        <button
            type={type}
            onClick={onClick}
            className={`bg-darkPrimary
                text-white px-3 py-1 rounded-md 
                hover:bg-lightPrimary hover:text-PrimaryText 
                drop-shadow-md drop-shadow-lighPrimary whitespace-nowrap ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default PrimaryButton;
