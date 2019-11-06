import { MeetingTimeParams } from '../interface';

class ReservationTimer extends MeetingTimeParams {
    step = 15;

    isSameDay = false;

    constructor(step:number = 15) {
        super();
        this.step = step;
        this.resetParams();
    }

    // 依据时区拆分出startDate,starTime
    set startTimestamp(data:any) {
    }

    // 拆分出endDate,endTime
    set endTimestamp(data:any) {
    }

    // 开始日期不能晚于结束日期
    set startDate(data:any) {
    }

    // 结束日期不能早于开始日期
    set endDate(data:any) {
    }

    // 开始和结束日期为同一天时，如果时间为24:00-step，结束日期+1
    set startTime(data:any) {
    }

    // 开始和结束日期为同一天时，如果时间为0时，开始日期-1,开始时间为24：00-step
    set endTime(data:any) {
    }

    // 修改时区的时候所有时间属性更新
    set utcOffset(data:any) {
    }

    // 默认置为当前时间
    resetParams(date:any = new Date()) {
    }

    // 计算时间差
    diffTimestamps() {
    }
}

export default ReservationTimer;
