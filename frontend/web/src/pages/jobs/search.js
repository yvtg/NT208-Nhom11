import DefaultNavbar from "../../components/DefaultNavbar";
import Banner from "../../components/Banner";
import ChatIcon from "../../components/ChatIcon";
import JobSummary from "../../components/JobSummary";
import JobFilter from "../../components/JobFilter";

const SearchJob = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <DefaultNavbar />

            <div className="relative w-full h-[488px] flex flex-col items-center">
                <Banner />
                <JobFilter></JobFilter>

             </div>

            <ChatIcon />
        </div>
            );
                    };

export default SearchJob;
