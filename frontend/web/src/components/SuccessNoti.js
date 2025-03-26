import { TiTickOutline } from "react-icons/ti";
import SecondaryButton from "./SecondaryButton";


const SuccessNoti = ({className, onClick}) => {
    return(
        <div className={className}>
            <TiTickOutline className="text-darkPrimary text-2xl"/>
            <h1 className="text-2xl text-darkPrimary font-semibold">Success 🎉</h1>
            <p>You have signup an account successfully</p>
            <p>Now you can continue to advanced features</p>
            <SecondaryButton className="mt-6" onClick={onClick}>Sign In here</SecondaryButton>
        </div>
    );
};

export default SuccessNoti;