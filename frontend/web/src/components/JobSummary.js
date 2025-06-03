import { timeFromNow, formatTime } from '../utils/dayjs';
import { useNavigate } from 'react-router-dom';


const JobSummary = ({ job, className }) => {
    const navigate = useNavigate();
    return (
        <div
        className={`cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white shadow-md rounded-2xl p-5 w-full relative ${className}`}
        onClick={() => navigate(`/jobs/${job.projectid}`)}
        >
            <h3 className="text-xl font-semibold text-gray-800 truncate">{job?.projectname}</h3>

            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{job?.description}</p>

            <div className="flex gap-2 mt-4 flex-wrap">
                {job?.skills?.slice(0, 3).map((tag, index) => (
                <span
                    key={index}
                    className="bg-lightPrimary text-darkPrimary text-xs px-3 py-1 rounded-full font-medium"
                >
                    {tag}
                </span>
                ))}
                {job?.skills?.length > 3 && (
                <span className="text-gray-400 text-xs">+{job.skills.length - 3} tags</span>
                )}
            </div>

            <div className="flex justify-between items-center mt-5">
                <p className="text-gray-400 text-xs">{job?.formattedUploadDate}</p>
                <p className="text-green-600 font-bold text-sm">{job?.formattedBudget}</p>
            </div>
        </div>
    );
};

export default JobSummary;
