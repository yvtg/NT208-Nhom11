import { formatCurrency, getRawNumber } from "../utils/formatCurrency";

const JobDetail = ({ project }) => {
    return (
        <div className="bg-gray-100 ">
            <div className="bg-white p-8 shadow-lg rounded-lg w-full">
                <div className="flex justify-between">
                    <h2 className="text-3xl font-bold">{project.projectname}</h2>
                    <p className="text-3xl font-semibold text-right">{formatCurrency(project.budget)}</p>
                </div>
                <p className="text-gray-700 mt-4">
                    {project.description}
                </p>
                <div className="flex space-x-2 mt-4">
                    { 
                        project?.skills.map((skill, index) => (
                            <span key={index} className="bg-blue-200 text-blue-700 px-3 py-1 rounded">
                            {skill}
                            </span>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};
export default JobDetail;
