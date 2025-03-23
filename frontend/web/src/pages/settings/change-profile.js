import DefaultNavbar from "../../components/DefaultNavbar"
import PrimaryButton from "../../components/PrimaryButton";
import SettingBar from "../../components/SettingBar";
import TextInput from "../../components/TextInput";
import ChatIcon from "../../components/ChatIcon"

const ChangePassword = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <DefaultNavbar />

            <SettingBar className="mt-24"/>

            <div className="flex flex-col items-center justify-center flex-grow">
                <div className="rounded-md border-divideColor shadow-lg shadow-lightPrimary p-11 bg-white lg:w-1/2 sm:w-auto">
                    <div className="space-y-4">
                        {/*Avatar*/}
                        <TextInput 
                            label="Avatar"
                            type="avatar"
                        />



                        <TextInput 
                            label="Full Name"
                            type="text"
                        />
                        <TextInput 
                            label="Email"
                            type="email"
                        />
                        <TextInput 
                            label="Phone"
                            type="phone"
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

export default ChangePassword;