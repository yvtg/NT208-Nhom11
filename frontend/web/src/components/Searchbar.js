import { FaSearch } from "react-icons/fa";

const Searchbar = ({ className }) => {
    return (
        <div className={` bg-white relative flex items-center border-2 border-darkPrimary rounded-full px-4 py-2 w-full  mx-auto ${className}`}>
            <input 
                type="text" 
                placeholder="SEARCH" 
                className="outline-none text-darkPrimary font-semibold uppercase bg-transparent px-2 flex-1"
            />
            <FaSearch className="text-darkPrimary cursor-pointer" />
        </div>
    );
};

export default Searchbar;
