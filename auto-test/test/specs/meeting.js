const logger = require('@wdio/logger').default;

const log = logger('会议预约输出');

const assert = require('assert');

const tools = require('../tools/meeting');
// project = UCPC2 AND issuetype = 测试用例 AND component in (预约会议-会议室会议, 预约会议-周期会议, 预约会议-视频会议) AND 用例级别 in (中, 高) ORDER BY cf[11503] ASC, created ASC
describe('会议预约页面元素检查', async () => {
    beforeEach(async () => {
        await browser.url('http://localhost:8080/ume/meeting?type=room');
    });
    it('should have form-panel', async () => {
        const panel = await tools.waitReady();
        const btn = await tools.getFooterButtons(0, panel);
        await browser.pause(1000);
        log.info('case 1 end');
    });
    it('change time-panel', async () => {
        await tools.waitReady();
        const startDate = await $('.el-date-editor:nth-child(1) > .el-input__inner');
        startDate.click();
        const startDatePicker = await $('.el-date-table__row:nth-child(6) > .available:nth-child(3) span');
        startDatePicker.click();
        const startTime = await $('.el-date-editor:nth-child(3) > .el-input__inner');
        startTime.click();
        const startTimePicker = await $('.time-select-item:nth-child(51)');
        startTimePicker.click();
        await browser.pause(5000);
        log.info('case 2 end');
    });
});

describe('会议室-列表刷新', async () => {
    beforeEach(async () => {
        await browser.url('http://localhost:8080/ume/meeting?type=room');
        await tools.waitReady();
    });
    it('勾选取消', async () => {
        await browser.pause(2000);
        const room = await tools.getRoomItem(0);
        room.click();
        await browser.pause(2000);
        const refresh = await tools.getRefreshButton();
        log.info(refresh);
        refresh.click();
        await browser.pause(2000);
    });
});
describe('预约会议室', async () => {
    beforeEach(async () => {
        await browser.url('http://localhost:8080/ume/meeting?type=room');
    });
    it('get room length', async () => {
        await tools.waitReady();
        await browser.pause(2000);
        const room = await tools.getRoomItem(0);
        room.click();
        await browser.pause(5000);
        log.info(rooms.length);
    });
    it('add person', async () => {
        await tools.waitReady();
        const addBtn = await $('.el-icon-circle-plus-outline');
        addBtn.click();
        await tools.getElDialog();
        await tools.expandTree();
        await tools.checkedTree();
        await browser.pause(3000);
    });
});

describe('周期模式', async () => {
    beforeEach(async () => {
        await browser.url('http://localhost:8080/ume/meeting?type=room');
        await tools.waitReady();
        const rebtn = await tools.getRecurrenceBtn();
        rebtn.click();
        await tools.getElDialog();
    });
    // 1: 按天， 2：按周， 3：按月， 4： 按年
    it('按天', async () => {
        const btn = await tools.getCycleRadios(1);
        btn.click();
        await browser.pause(1000);
        const radios = await tools.setDayMode();
        radios[1].click();
        const increase = await $('.meeting-day-cycle .el-input__inner');
        increase.setValue(3);
        await browser.pause(1000);
        log.info(radios[0]);
    });
    it('按周', async () => {
        const btn = await tools.getCycleRadios(2);
        btn.click();
        await browser.pause(1000);
        const increase = await $('.meeting-day-week .el-input__inner');
        increase.setValue(3);
        const checkbox = await tools.setWeekMode(0);
        checkboxs.click();
        log.info(checkboxs.length);
        await browser.pause(1000);
    });
    it('按月', async () => {
        const btn = await tools.getCycleRadios(3);
        btn.click();
        await browser.pause(1000);
    });
    it('按年', async () => {
        const btn = await tools.getCycleRadios(4);
        btn.click();
        await browser.pause(5000);
    });
});
