import DefaultNavbar from "../../components/DefaultNavbar";
import Banner from "../../components/Banner";
import ChatIcon from "../../components/ChatIcon";
import HirerInfo from "../../components/HirerInfo";
import JobDetail from "../../components/JobDetail";
import Searchbar from "../../components/Searchbar";
import PrimaryButton from "../../components/PrimaryButton";
import JobSummary from "../../components/JobSummary";

const JobPage = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <DefaultNavbar />

            <div className="relative w-full h-[250px]">
                <Banner />
                <div className="absolute top-3 right-10">
                    <Searchbar />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 max-w-[90%] mx-auto mt-5">
                <div className="w-full lg:w-[90%] ">
                     <JobDetail />
                </div>

                <div className=" lg:w-[30%] flex flex-col justify-start items-end space-y-4">
                    <PrimaryButton className="w-full h-[50px] font-bold text-2xl rounded-full">
                         APPLY NOW
                    </PrimaryButton>
                    <HirerInfo />
                    <JobSummary />
                </div>
            </div>

            <ChatIcon />
        </div>
    );
};

export default JobPage;
