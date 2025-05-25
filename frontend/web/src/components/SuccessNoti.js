import { TiTickOutline } from "react-icons/ti";
import SecondaryButton from "./SecondaryButton";


const SuccessNoti = ({className, onClick}) => {
    return(
        <div className={className}>
            <TiTickOutline className="text-darkPrimary text-2xl"/>
            <h1 className="text-2xl text-darkPrimary font-semibold">Đăng ký thành công 🎉</h1>
            <p>Bạn đã tạo tài khoản mới thành công</p>
            <p>Bây giờ bạn có thể bắt đầu đăng tải hoặc tìm kiếm dự án</p>
            <SecondaryButton className="mt-6" onClick={onClick}>Đăng nhập ngay</SecondaryButton>
        </div>
    );
};

export default SuccessNoti;