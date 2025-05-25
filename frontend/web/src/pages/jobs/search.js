import DefaultNavbar from "../../components/DefaultNavbar";
import Banner from "../../components/Banner";
import ChatIcon from "../../components/ChatIcon";
import JobSummary from "../../components/JobSummary";
import JobFilter from "../../components/JobFilter";
import { useLocation } from "react-router-dom";
import useSearch from "../../hooks/useSearch";
import Lottie from "lottie-react";
import animationData from "../../lotties/page-not-found.json"

const SearchJob = ({onLogout}) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("q") || "";
    
    const { searchResults, loading, error, handleSearch } = useSearch(searchQuery);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <DefaultNavbar onLogout={onLogout} />

            <div className="relative w-full h-[488px] flex flex-col items-center">
                <Banner />
                <JobFilter onSearch={handleSearch} initialQuery={searchQuery} />
            </div>

            <div className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="h-1/4 flex justify-center">
                        <Lottie
                            animationData={animationData}
                            loop={true}
                            className="w-72 h-72" 
                        />
                    </div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500">
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {searchResults.length > 0 ? (
                            searchResults.map((job) => (
                                <JobSummary key={job.projectid} job={job} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10">
                                {searchQuery 
                                    ? <>
                                        <p>Không tìm thấy dự án</p>
                                    </>
                                    : <p>Nhập từ khóa để tìm kiếm</p>}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <ChatIcon />
        </div>
    );
};

export default SearchJob;
