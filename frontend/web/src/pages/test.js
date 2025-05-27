import { useNavigate } from "react-router-dom";
import DefaultNavbar from "../components/DefaultNavbar"
import Spinner from "../components/Spinner";
import useCreateConversation from "../hooks/useCreateConversation";


const Test = () => {
    const { createConversation, createLoading, createError } = useCreateConversation();
    const navigate = useNavigate();
    // nữa edit chỗ này /////////////
    const participantID = 2;

    const handleCreate = async () => {
        const data = await createConversation(participantID);
            if (data) {
                console.log('Tạo thành công:', data);
                if (data?.ConversationID) {
                    navigate(`/messages/${data.ConversationID}`);
                }
            }
    };
    return (
        <>
            <DefaultNavbar />
            <div className="flex justify-center items-center mt-24">
                <button  onClick={handleCreate} disabled={createLoading} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                    {
                        createLoading ? <p>đang load</p> : 
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-transparent ">
                            Liên hệ
                        </span>
                    }
                </button>
            </div>
        </>
    );
};

export default Test;