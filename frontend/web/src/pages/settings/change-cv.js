import DefaultNavbar from "../../components/DefaultNavbar"
import SettingBar from "../../components/SettingBar";
import TextInput from "../../components/TextInput";
import ChatIcon from "../../components/ChatIcon";
import PrimaryButton from "../../components/PrimaryButton";

const ChangeCV = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <DefaultNavbar />

            <SettingBar className="mt-24"/>

            <div className="flex flex-col items-center justify-center flex-grow">
                <div className="rounded-md border-divideColor shadow-lg shadow-lightPrimary p-11 bg-white sm:w-auto lg:w-1/2">
                    <div className="space-y-4">
                        <TextInput
                            label="Title"
                            type="text"
                        />

                        <TextInput 
                            label="Personal website"
                            type="link"
                        />

                        <TextInput 
                            label="CV file"
                            type="file"
                        />

                        <TextInput 
                            label="Field"
                            type="text"
                        />

                        <TextInput
                            label="Skill"
                            type="text"
                        />

                        <TextInput
                            label="Introduce yourself"
                            type="textarea"
                        />

                    </div>
                    <div className="flex justify-center mt-10">
                        <PrimaryButton className="w-auto flex justify-center px-3 py-1 text-lg"> Change </PrimaryButton>
                    </div>

                </div>
            </div>
            <ChatIcon></ChatIcon>
        </div>
    );
}

export default ChangeCV;