import {
    isToday, isTomorrow,
    isThisYear, isDate,
    format,
    differenceInHours,
    differenceInMinutes,
} from 'date-fns';

export const formatDateRule = (timestamp: string|number) => {
    const date = new Date(timestamp);
    if (!timestamp && !isDate(date)) {
        return '';
    }
    if (isToday(date)) {
        return '今天 HH:mm';
    }
    if (isTomorrow(date)) {
        return '明天 HH:mm';
    }
    if (isThisYear(date)) {
        return 'MM-dd HH:mm';
    }
    return 'yyyy-MM-dd HH:mm';
};
export class Timer {
    private timestamp: string|number= new Date().valueOf()

    constructor(timestamp: string|number) {
        this.timestamp = timestamp;
    }

    formatTime() {
        return format(new Date(this.timestamp), formatDateRule(this.timestamp));
    }

    countDownTime(targetTime: string|number) {
        const hours = differenceInHours(this.timestamp, targetTime);
        const min = differenceInMinutes(this.timestamp, targetTime);
        return `倒计时：${hours} 小时 ${min} 分钟`;
    }
}
