import dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/vi';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

dayjs.locale('vi');

// Chuyển UTC -> giờ VN
const toLocalTime = (dateString) => {
    return dayjs.utc(dateString).tz('Asia/Ho_Chi_Minh');
};

// Dạng: "vài phút trước"
const timeFromNow = (dateString) => {
    return toLocalTime(dateString).fromNow();
};

// Dạng: "14:30 24/05/2025"
const formatTime = (dateString, format = 'HH:mm DD/MM/YYYY') => {
    return toLocalTime(dateString).format(format);
};

export { dayjs, toLocalTime, timeFromNow, formatTime };
