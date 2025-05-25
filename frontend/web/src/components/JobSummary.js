import { timeFromNow, formatTime } from '../utils/dayjs';
import { useNavigate } from 'react-router-dom';


const JobSummary = ({ job }) => {
    const navigate = useNavigate();
    return (
        <div className="cursor-pointer hover:bg-gray-100 bg-white shadow-md rounded-xl p-4 w-80 relative" onClick={() => navigate(`/jobs/${job.projectid}`)}>
            <h3 className="text-lg font-semibold">{job?.projectname}</h3>
                
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{job?.description}</p>

            {/* <div className="flex gap-2 mt-3 flex-wrap">
                {job.tags.map((tag, index) => (
                    <span key={index} className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                        {tag}
                    </span>
                ))}
            </div> */}

            <div className="flex justify-between items-center mt-3">
                <p className="text-gray-500 text-xs">{timeFromNow(job?.uploadeddate)}</p>
                <p className="text-black font-bold">${job?.budget}</p>
            </div>
        </div>
    );
};

export default JobSummary;
