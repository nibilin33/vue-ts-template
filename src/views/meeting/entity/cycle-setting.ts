import {
    DayPattern, MonthPattern, RepeatParams, WeekPattern, YearPattern,
} from '../interface';

enum PATERN {
    daily = 'RECURS_DAILY',
    weekly = 'RECURS_WEEKLY',
    monthly = 'RECURS_MONTHLY',
    monthnth = 'RECURS_MONTH_NTH',
    yearly = 'RECURS_YEARLY',
    yearnth = 'RECURS_YEAR_NTH'
}
enum DAY {
    day = 'Day',
    weekend = 'Weekday',
}
enum REPEAT {
    never = 'NONE',
    repeat = 'REPEAT',
    end = 'ENDDAY',
}
export class DayCycle implements DayPattern {
    dailyType = 1;

    recurrenceType = PATERN.daily;

    interval = 1;
}
export class WeekCycle implements WeekPattern {
    recurrenceType = PATERN.weekly;

    interval = 1;

    daysOfWeeks = [];
}
// 两种模式：每月第几天（1-31），每月第x(1-4,-1)个星期x
export class MonthCycle implements MonthPattern {
    interval = 1;

    recurrenceType = PATERN.monthly;

    dayOfMonth = [];

    dayOfWeek = 1;

    dayOfWeekIndex = DAY.day;

    constructor(data:MonthPattern) {
        console.log(data);
    }
}
// 两种模式：每年的几月第几天，每年的几月第x(1-4,-1)个星期x
export class YearCycle implements YearPattern {
    interval = 1;

    monthOfYear = 0;

    dayOfWeek = DAY.day;

    dayOfWeekIndex = 1;

    recurrenceType = PATERN.yearly;

    constructor(data:YearPattern) {
        console.log(data);
    }
}

export class RepeatRange extends RepeatParams {
    private isValid = true;

    constructor() {
        super();
        this.range = REPEAT.never;
    }

    // 选择REPEAT.end 模式的要校验时间范围
    set startDate(data:any) {
    }

    set endDate(data:any) {
    }

    // 获取当月最多天数
    get monthDays() {
        return this.startDate;
    }

    // 不同模式的参数校验
    validParams() {
        return this;
    }

    /**
     * recurrenceRange:1,2,3
     * hasNoEndDate: true,false
     * rangeStartDate: startDate(yyyy-mm-dd)
     * occurrences: 重复次数
     */
    formatParams() {
    }

    setParams(data:any) {
    }
}
