class MeetingTool {
    static async waitReady() {
        const panel = await $('.form-panel');
        panel.waitUntil();
        return panel;
    }

    static async getThemeInput() {
        const elForm = await $('.el-form');
        elForm.waitUntil();
        const input = await elForm.$$('.el-input__inner');
        const themeInput = await $(input[0]);
        return themeInput;
    }

    static async getFooterButtons(index, panel) {
        const Buttons = await panel.$$('.form-panel__footer button');
        const btn = await $(Buttons[index]);
        return btn;
    }

    static async getElDialog() {
        const priviewContent = await $('.el-dialog__wrapper');
        priviewContent.waitForExist(5000);
        return priviewContent;
    }

    static async getElDialogFooterBtns(index, dialog) {
        const Buttons = await dialog.$$('.el-dialog__footer button');
        const btn = await $(Buttons[index]);
        return btn;
    }

    static async getRoomItem(index) {
        const rooms = await $$('//div[contains(@id, "room")]');
        if (index > rooms.length) {
            index = rooms.length - 1;
        }
        const room = await rooms[index].$('.el-checkbox__inner');
        return room;
    }

    static async expandTree() {
        const loading = await $('.nl-tree');
        await loading.waitForExist(5000);
        const expand = await $$('.nl-tree .infinite-tree-toggler');
        expand.forEach(async (it) => {
            const item = await $(it);
            item.click();
        });
        await browser.pause(2000);
    }

    static async checkedTree() {
        const alltoggler = await $$('//span[@class="el-icon-caret-right"]');
        alltoggler.forEach(async (item) => {
            await item.click().waitUntil(function () {
                return this.getProperty('className').then(text => text.indexOf('caret-bottom') > -1);
            }, 5000);
        });
        await browser.pause(300);
        const staffs = await $$('//span[contains(@class, "STAFF")]');
        staffs.forEach(async (item) => {
            await item.click();
            await browser.pause(200);
        });
    }

    static async getRecurrenceBtn() {
        const btn = await $('.el-button--medium:nth-child(3) > span');
        return btn;
    }

    static async getCycleRadios(index) {
        const radio = await $(`.left:nth-child(${index}) > .el-radio__label`);
        return radio;
    }

    static async setDayMode(type, value = 1) {
        const radio = await $$('.meeting-day-cycle > label.el-radio');
        return radio;
    }

    static async setWeekMode(index) {
        const checkbox = await $$('.meeting-day-week > .el-checkbox-group > label');
        return checkbox[index];
    }

    static async getRefreshButton() {
        const btn = await $$('.reservation-room__btns .el-button');
        return btn[0];
    }

    // todo: 周期模式组合整理
    static async setRecurrenceMode() {
        // const type = await $('.el-col > .el-radio:nth-child(7) > .el-radio__label');
        // type.click();
        // const typeType = await $('.el-date-editor:nth-child(8) > .el-input__inner');
        // typeType.click();
        // const endDate = await $('.el-date-table__row:nth-child(6) > .available:nth-child(7) span');
        // endDate.click();
        // const btnCancel = await tools.getElDialogFooterBtns(0, dialog);
        // btnCancel.click();
    }
}

module.exports = MeetingTool;
