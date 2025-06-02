import { TiTickOutline } from "react-icons/ti";
import SecondaryButton from "./SecondaryButton";


const SuccessNoti = ({className, onClick, title, message, btnMsg}) => {
    return(
        <div className={className}>
            <TiTickOutline className="text-darkPrimary text-2xl"/>
            <h1 className="text-2xl text-darkPrimary font-semibold">{title} 🎉</h1>
            <p>{message}</p>
            {onClick &&
            <SecondaryButton className="mt-6" onClick={onClick}>{btnMsg}</SecondaryButton>}
        </div>
    );
};

export default SuccessNoti;