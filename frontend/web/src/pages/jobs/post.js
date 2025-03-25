import DefaultNavbar from "../../components/DefaultNavbar"
import PrimaryButton from "../../components/PrimaryButton";
import ChatIcon from "../../components/ChatIcon";
import TextInput from "../../components/TextInput";
import Select from "../../components/Select";


const PostJob = () => {

    const fieldOptions = [
        {value:"tech", label:"tech"},
        {value:"design", label:"design"},
        {value:"marketing", label:"marketing"},
        {value:"music", label:"music"},
        {value:"writing", label:"writing"},
        {value:"video", label:"video"}
    ]

    const workingTypeOptions = [
        {value:"remote", label:"remote"},
        {value:"onsite", label:"onsite"},
        {value:"hybrid", label:"hybrid"}
    ]


    return (
        <div className="min-h-screen flex flex-col">
            <DefaultNavbar />

            <div className="flex flex-col items-center justify-center flex-grow">
                <div className="rounded-md border-divideColor shadow-lg shadow-lightPrimary p-11 bg-white sm:w-auto lg:w-1/2">
                    <h2 className="flex text-5xl font-bold justify-center items-start mb-10">Post your job</h2>
                    <div className="space-y-4">
                        <TextInput 
                            label="Job title"
                            type="text" />

                        <Select 
                            label="Field"
                            options={fieldOptions}
                        />

                        <TextInput 
                            label="Expired Date"
                            type="datetime-local"
                        />

                        <Select
                            label="Working type"
                            options={workingTypeOptions}
                        />

                        <TextInput 
                            label="Budget"
                            type="money" />

                        <TextInput 
                            label="Job Description"
                            type="textarea" />

                    </div>
                    <div className="flex justify-center mt-10">
                        <PrimaryButton className="w-auto flex justify-center px-3 py-1 text-3xl"> POST </PrimaryButton>
                    </div>

                </div>
            </div>
            <ChatIcon></ChatIcon>
        </div>
    );
};

export default PostJob;

