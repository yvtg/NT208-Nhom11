
const JobDetail = () => {
    return (
        <div className="bg-gray-100 ">
            <div className="bg-white p-8 shadow-lg rounded-lg w-full">
                <h2 className="text-3xl font-bold">JOB TITLE</h2>
                <p className="text-2xl font-semibold text-right">$999999</p>
                <p className="text-gray-700 mt-4">
                   Noi dung mieu ta cong viec 
                </p>
                <div className="flex space-x-2 mt-4">
                    <span className="bg-blue-200 text-blue-700 px-3 py-1 rounded">TAG</span>
                    <span className="bg-blue-200 text-blue-700 px-3 py-1 rounded">TAG</span>
                </div>
            </div>
        </div>
    );
};
export default JobDetail;
