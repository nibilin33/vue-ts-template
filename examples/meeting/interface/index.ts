interface rtmpOption {
    sharpness: string,
    videoSetting: string,
    detail: string,
    rtmpLayout: string
}
export interface advanceSetting {
    automaticCall: boolean, // 自动呼叫
    disconnectedInvitation: boolean, // 断线重连
    broadcastInteraction: boolean, // 广播互动
    RTMPLive: boolean,
    RTMPLiveOption: rtmpOption, // rtmp直播参数
    defaultSpeechMode: string, // (YMS2.1)发言模式
    autoMuteEnable: boolean, // 入会自动禁言
    autoRecording: boolean, // 自动录制
}

export class AdvanceParams implements advanceSetting {
    automaticCall = true;

    disconnectedInvitation = false;

    broadcastInteraction = false;

    RTMPLive = false;

    RTMPLiveOption = {
        sharpness: '720P',
        videoSetting: 'AVD',
        detail: '',
        rtmpLayout: 'SpeechExcitation',
    };

    defaultSpeechMode = 'freeSpeech';

    autoMuteEnable = false;

    autoRecording = false;
}

export class MeetingTimeParams {
    startDate = '';

    startTime = '';

    startTimestamp = '';

    endTime = '';

    endDate = '';

    endTimestamp = '';

    utcOffset = 0;
}

/**
 * 周期模式：日，周，月，年
 * @interface CyclePattern
 */
interface CyclePattern {
    recurrenceType: string,
    interval: number,
}

export interface DayPattern extends CyclePattern {
    dailyType : number,
}

export interface WeekPattern extends CyclePattern {
    daysOfWeeks: Array<string>,
}

export interface MonthPattern extends CyclePattern {
    dayOfMonth?: Array<string>,
    dayOfWeekIndex?: string,
    dayOfWeek?:number,
}

export interface YearPattern extends CyclePattern {
    dayOfMonth?: string,
    monthOfYear: number,
    dayOfWeekIndex?: number,
    dayOfWeek?:string,
}

export class RepeatParams {
    startDate = '';

    range = '';

    repeatNum = 1;

    endDate = '';
}
