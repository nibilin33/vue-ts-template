// 为会议预约组件构造数据
class MeetingPanel {
    // 返回时间跨度数组，eg；['2019/10/1','2019/10/2']
    static getDateMap(startDate:string, totalDay:number) {
    }

    /**
     * @desc  获取目标时间在面板的刻度
     * @param {Array<string>} dayMap eg:['2019/10/1','2019/10/2']
     * @param {number} timestamp
     * @param {number} granularity 刻度间隔，默认30分钟一格
     * @param {number} offset 时区偏移量
     * @param {string} range start,end 作为判断是否超出当前刻度范围的判断依据
     * @memberof MeetingPanel
     */
    static getTimeIndex(
        dayMap:Array<string>,
        timestamp:number,
        granularity:number = 30,
        offset:number = 0,
        range:string,
    ) {
    }
}
