
<style lang="scss">
@import "./popover.scss";
</style>

<template>
  <div class="yl-cluster-meeting">
    <div class="border" :style="{padding:scrollBarWidth?'10px 0 10px 0':'10px 10px 10px 0'}">
      <el-row>
        <el-col class="yl-col-250">
          <div class="icon-Yealink">
            <el-select
              ref="ylremote"
              :defaultHoverIndex="0"
              class="yl-remote-select"
              v-model="state"
              @change="handleSelect"
              filterable
              remote
              :placeholder="$t('reservation.placeholder.searchMeetingRoom')"
              :remote-method="querySearch"
            >
              <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.value"
                :value="item.row"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col
          class="yl-col-rest"
          style="overflow-x:auto;"
          :id="contentId+'topbar'"
          ref="topbar"
          :style="{marginLeft:-scrollBarWidth+'px'}"
        >
          <div class="scroll-contrl-area-left" id="scrollareaLeft"></div>
          <div class="table" :style="{width:projectWidth+'px'}">
            <div class="topbar-td" v-for="(day,key) in dayMap" :key="key">{{day}}</div>
          </div>
          <div class="table" :style="{width:projectWidth+scrollBarWidth+'px'}">
            <div>
              <div v-for="cell in timeMap.length*2" class="header-td" :key="cell+'cell'">
                <div class="short-point" v-if="cell%2==0"></div>
                <div class="long-point" v-else></div>
                <div
                  class="high-light-time-line time-scale"
                  v-if="isShowScale(selectStart.index,selectEnd.index,cell)"
                ></div>
              </div>
              <div class="header-td" style="border:0;" :style="{width:scrollBarWidth+'px'}"></div>
            </div>
            <div style="margin-top:-10px;" class="bg-white">
              <div
                v-for="(time,index) in timeMap"
                class="time-td"
                style="width:66px;font-size:13px;"
                :key="index+'point'"
              >
                <span style="padding-top:5px;" :id="contentId+'timeTd'+index">{{time.timePoint}}</span>
              </div>
            </div>
          </div>
          <div class="scroll-contrl-area-right" id="scrollareaRight"></div>
        </el-col>
      </el-row>
      <el-row class="bg-white mg-top-20">
        <el-col
          :style="{height:height+'px'}"
          style="overflow-x:hidden;"
          class="yl-col-250 overflow border-solid-top mg-top-20"
          ref="scrollLeft"
          :id="contentId+'scrollLeft'"
          @scroll.native="scrollYF($event)"
        >
          <div class="table fixed" v-if="isOperate">
            <div class="pd-5">
              <el-checkbox-group v-model="checkedRoom">
                <div
                  v-for="(room,index) in roomList"
                  :id="'room'+index"
                  :key="index"
                  class="tr border-solid-bottom"
                >
                  <div
                    class="room-td"
                    :data-i="index"
                    v-show="isHiddenAble?!room.hide:true"
                    style="display:inline-block;"
                    :class="{'checked-back':isCheckedRoom(room,index)}"
                  >
                    <span class="td-padding"></span>
                    <el-checkbox @change="singleChange($event,index)" :label="index">&nbsp;</el-checkbox>
                    <!-- <input type="checkbox" @change="singleChange($event,index)" :label="index"></input> -->
                    <span v-html="roomRender(room)"></span>
                  </div>
                </div>
              </el-checkbox-group>
            </div>
            <div :style="{height:scrollBarWidth+'px'}"></div>
          </div>
          <div class="table fixed" v-else>
            <div class="pd-5">
              <div
                v-for="(room,index) in roomList"
                :key="index"
                :data-i="index"
                class="tr border-solid-bottom"
              >
                <div class="room-td" v-show="isHiddenAble?!room.hide:true">
                  <span class="td-padding"></span>
                  <span v-html="roomRender(room)"></span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col
          :style="{height:height+'px',marginLeft:-scrollBarWidth+'px'}"
          class="yl-col-rest mg-top-20 overflow border-dotted-top bg-white"
          ref="scrollRight"
          @scroll.native="scrollXF($event)"
        >
          <div class="table" :style="{width:projectWidth+'px'}" :id="scrollerId">
            <div :id="contentId" class="allow-drag border-dotted-left" ref="tableMeeting"></div>
          </div>
        </el-col>

        <div
          v-if="roomList.length == 0 && !loading || isAllhidden"
          style="width:100%;margin:0 auto;position:absolute;text-align:center;"
        >
          <div class="no-meeting"></div>
          <div style="margin-top: 15px;">{{$t('reservation.tip.null')}}</div>
        </div>
        <loading :show="loading" :height="height"></loading>
      </el-row>
      <b-popover :target="currentId" :show.sync="isMouseShow" placement="top" ref="bpopover">
        <div
          class="bf-popcontent"
          @mouseover.stop="mouseOver($event)"
          @mouseleave.stop="mouseLeave($event)"
        >
          <span v-html="tipRender(content)"></span>
          <div class="b-popover-tail">&nbsp;</div>
        </div>
      </b-popover>
    </div>
  </div>
</template>
<script>
import { debounce, difference, throttle } from 'lodash';
import moment from 'moment';
import Clusterize from 'clusterize.js';
import bPopover from './popover';
import loading from './loading';
import pinHelp from './pinyin';

const getTime = function (date) {
    return moment(date).format('HH:mm');
};
const getDate = function (date, add = 0) {
    return moment(new Date(date))
        .add(add, 'day')
        .format('YYYY/MM/DD');
};
const getTimeList = function (granularity = 30) {
    const startTimestamp = new Date(`${getDate(new Date())} 00:00`).valueOf();

    const timestampInterval = granularity * 60 * 1000;

    const intervalNum = (60 * 24) / granularity;

    return Array.from({ length: intervalNum }).map((item, index) => ({ timePoint: getTime(startTimestamp + index * timestampInterval) }));
};
const getTimeListIndex = function (granularity = 30) {
    const startTimestamp = new Date(`${getDate(new Date())} 00:00`).valueOf();

    const timestampInterval = granularity * 60 * 1000;

    const intervalNum = (60 * 24) / granularity;

    return Array.from({ length: intervalNum }).map((item, index) => getTime(startTimestamp + index * timestampInterval));
};
const getZeroTime = timeStamp => timeStamp - (timeStamp % 86400);
export default {
    components: { bPopover, loading },
    name: 'ylReservation',
    props: {
        height: {
            type: Number,
            default: 250,
        },
        granularity: {
            type: Number,
            default: 30,
            validator: v => 60 % v === 0,
        },
        tipRender: {
            type: Function,
            default: v => v,
        },
        roomRender: {
            type: Function,
            default: v => v,
        },
        filterFunction: {
            type: Function,
        },
        isOperate: {
            type: Boolean,
            default: true,
        },
        expandDay: {
            type: Number,
            default: 2,
        },
        startDate: {
            default() {
                return getZeroTime(new Date().valueOf());
            },
        },
        roomList: {
            type: Array,
            default() {
                return [];
            },
        },
        defaultChecked: {
            type: Array,
            default() {
                return [];
            },
        },
        isHiddenAble: {
            type: Boolean,
            default: false,
        },
        setSelectRange: {
            type: Function,
        },
        loading: {
            type: Boolean,
            default: true,
        },
        remoteCheck: {
            type: Function,
        },
    },
    data() {
        return {
            options: [],
            state: '',
            checkedRoom: [],
            currentId: null,
            isMouseShow: true,
            content: '',
            clusterize: null,
            selectStart: {
                i: -1,
                index: -1,
            },
            selectEnd: {
                i: -1,
                index: -1,
            },
            isEnd: true,
            timeMap: [],
            dayMap: [],
            scrollX: 0,
            scrollY: 0,
            scrollBarWidth: 0,
            scrollerId: `scroll${new Date().valueOf()}`,
            contentId: `content${new Date().valueOf()}`,
            pointMap: getTimeListIndex(this.granularity / 2),
            isAllhidden: false,
        };
    },
    computed: {
        totalRoom() {
            return this.roomList.length;
        },
        projectWidth() {
            return 24 * (60 / this.granularity) * 2 * this.expandDay * 33;
        },
        interval() {
            return 60 / this.granularity;
        },
        formatRoom() {
            return this.roomList.map(item => Object.assign({}, item, {
                fullPin: pinHelp.getFullChars(item.value),
                shortPin: pinHelp.getCamelChars(item.value),
            }));
        },
    },
    created() {
    // pinyin.setOptions({ checkPolyphone: false, charCase: 0 });
        this.createDayMap(this.startDate);
        this.createTimeMap();
    },
    mounted() {
        $('body').addClass('body-hidden');
    },
    beforeDestroy() {
        $('body').removeClass('body-hidden');
        this.destroyAll();
    },
    watch: {
        checkedRoom: {
            handler(v, o) {
                if (v.length < 1) {
                    this.clearAllColor();
                    this.clearAllrangeColor();
                    this.resetTarget('selectEnd');
                    this.resetTarget('selectStart');
                }
                console.log(
                    'changeeeeeeeee',
                    v,
                    o,
                    v.toString() != o.toString(),
                    this.checkedRoom,
                );
                if (v.toString() != o.toString()) {
                    this.$emit('checkChange', this.checkedRoom);
                }
                this.addChecked();
            },
        },
        totalRoom: {
            handler(v, o) {
                if (v != o) {
                    if (!this.clusterize) {
                        this.$nextTick(() => {
                            this.getScrollBarWidth();
                        });

                        this.checkedRoom = this.defaultChecked;
                        this.clusterize = this.initCluster();
                        this.addEvent();
                    }
                }
            },
        },
        startDate: {
            handler(newV, oldV) {
                this.createDayMap(newV);
                this.createTimeMap();
            },
        },
    },
    methods: {
        updateIsHidden() {
            this.isAllhidden = this.totalRoom > 0
        && this.roomList.filter(it => it.hide).length == this.totalRoom;
        },
        selectFirst() {
            this.handleSelect(this.options[0].row);
            this.$refs.ylremote.handleClose();
        },
        scrollToTimePoint(date, point) {
            setTimeout(() => {
                const index = this.getTimeIndex(date, point) + 1;
                if (index > -1) {
                    const leftPosition = $(this.$refs.scrollRight.$el).offset().left + this.scrollBarWidth;
                    const scrollLeft = $(this.$refs.scrollRight.$el).scrollLeft()
            + $(`#${this.contentId}td0index${index}`).offset().left;
                    const rightPosition = $(this.$refs.scrollLeft.$el).width();
                    $(this.$refs.scrollRight.$el).scrollLeft(scrollLeft - leftPosition);
                }
            }, 100);
        },
        hiddenClusterTr(indexs) {
            $(`#${this.contentId} .tr`).removeClass('hide-tr');
            $(`#${this.contentId} .tr`).each(function () {
                if (
                    indexs.indexOf(
                        $(this)
                            .children()
                            .first()
                            .data('i'),
                    ) > -1
                ) {
                    $(this).addClass('hide-tr');
                }
            });
            this.$nextTick(() => {
                this.getScrollBarWidth();
            });
        },
        addChecked() {
            $(`#${this.contentId}>.tr`).removeClass('checked-back');
            this.checkedRoom.forEach((num) => {
                $(`#${this.contentId}tr${num}`).addClass('checked-back');
            });
        },
        isCheckedRoom(item, index) {
            return this.checkedRoom.indexOf(index) > -1;
        },

        selectSelectRange(startI, endI, isEmit = true) {
            this.clearAllColor();
            this.clearAllrangeColor();
            this.initArr();
            if (
                startI > -1
        && endI > -1
        && startI <= this.timeMap.length * 2
        && endI <= this.timeMap.length * 2
            ) {
                this.selectStart.index = startI;
                this.selectEnd.index = endI;
                this.leaveEndPaint(isEmit);
            }
        },
        oPCheckedRoomList(key) {
            if (this.checkedRoom.indexOf(key) > -1) {
                return;
            }
            this.checkedRoom.push(key);
            this.addChecked();
            // this.$emit("checkChange", this.checkedRoom)
        },
        handleSelect(item) {
            if (typeof $(`#room${item}`).offset() !== 'undefined') {
                const { top } = $(`#room${item}`).offset();
                const stop = $(this.$refs.scrollLeft.$el).offset().top;
                const lstop = $(this.$refs.scrollLeft.$el).scrollTop();
                const rtop = !lstop ? top - stop : Math.abs(top + lstop) - stop;
                $(this.$refs.scrollLeft.$el).animate(
                    {
                        scrollTop: rtop,
                    },
                    100,
                );
                this.selectStart.i = item;
                this.oPCheckedRoomList(item);
                if (typeof this.setSelectRange === 'function') {
                    this.setSelectRange(
                        this.setTimeRange,
                        this.selectStart.index,
                        this.selectEnd.index,
                    );
                }
                this.$nextTick(() => {
                    this.checkRoomChange(this.checkedRoom, item);
                    this.$emit('checkChange', this.checkedRoom);
                });
            }

            this.state = '';
        },
        isMatch(value, queryString) {
            const mathParam = ['value', 'fullPin', 'shortPin'];
            return mathParam.some(
                it => value[it].toLowerCase().indexOf(queryString.toLowerCase()) > -1,
            );
        },
        querySearch(queryString, cb) {
            if (queryString) {
                this.options = typeof this.filterFunction === 'undefined'
                    ? this.formatRoom.filter(item => this.isMatch(item, queryString))
                    : this.filterFunction(queryString);
            } else {
                this.options = [];
            }
        },
        isShowScale(start, end, cell) {
            if (start < 0 || end < 0) {
                return false;
            }
            if (end < start) {
                end ^= start;
                start ^= end;
                end ^= start;
            }
            return cell >= start && cell <= end;
        },
        createTimeMap() {
            let totalTimeMap = [];
            for (let i = 0; i < this.expandDay; i++) {
                totalTimeMap = [...totalTimeMap, ...getTimeList(this.granularity)];
            }
            this.timeMap = totalTimeMap;
        },
        createDayMap(startDate) {
            this.dayMap = Array.from({ length: this.expandDay }).map((item, index) => getDate(new Date(startDate), index));
        },
        removeAllEvent() {
            $(`#${this.contentId}`).off('mousedown mouseup mouseleave mouseover');
            $(`#${this.contentId} .meeting-card`).off(
                'mouseenter mousemove mouseout',
            );
            $(window).off('mouseup mousemove');
        },
        destroyAll() {
            this.clusterize.destroy();
            this.removeAllEvent();
            this.clusterize = null;
        },
        addEvent() {
            const _this = this;
            $(`#${this.contentId}`)
                .off('mousedown')
                .on('mousedown', (e) => {
                    _this.highLightTimeStart(e);
                });
            $(`#${this.contentId}`)
                .off('mouseup')
                .on('mouseup', (e) => {
                    _this.highLightTimeEnd(e);
                });
            $(window)
                .off('mouseup')
                .on('mouseup', (e) => {
                    console.log('iseND', _this.isEnd);
                    if (!_this.isEnd) {
                        _this.leaveEndPaint();
                    }
                });
            $(`#${this.contentId}`)
                .off('mouseover')
                .on('mouseover', (e) => {
                    if (e.target && e.target.className.includes('td')) {
                        _this.chooseTime(e);
                    }
                });
            $(window)
                .off('mousemove')
                .on('mousemove', (e) => {
                    if (!_this.isEnd) {
                        const scrollLeft = $(_this.$refs.scrollLeft.$el).offset().left;
                        const right = $('#scrollareaRight').position().left + scrollLeft;
                        const left = $('#scrollareaLeft').position().left + scrollLeft;
                        if (Math.abs(right - e.clientX) < 33) {
                            const scrollLeft = _this.$refs.scrollRight.$el.scrollLeft + 33 * 2;
                            $(_this.$refs.scrollRight.$el).scrollLeft(scrollLeft);
                        }
                        if (Math.abs(left - e.clientX) < 33) {
                            const scrollLeft = _this.$refs.scrollRight.$el.scrollLeft - 33 * 2;
                            $(_this.$refs.scrollRight.$el).scrollLeft(scrollLeft);
                        }
                    }
                });
        },
        updateCluster(roomList, startI, endI) {
            if (this.clusterize) {
                this.checkedRoom = this.defaultChecked;
                this.initArr();
                this.clusterize.update(this.createElement(roomList));
                this.selectSelectRange(startI, endI);
            }
        },
        getScrollBarWidth() {
            const element = this.$refs.scrollLeft.$el;
            this.scrollBarWidth = element.offsetWidth - element.clientWidth;
        },
        initCluster(data) {
            return new Clusterize({
                rows: this.createElement(data),
                scrollId: this.scrollerId,
                contentId: this.contentId,
                callbacks: {
                    clusterChanged: () => {
                        this.currentId = null;
                        const _this = this;
                        $(`#${this.contentId} .meeting-card`)
                            .off('mouseenter')
                            .on('mouseenter', (e) => {
                                _this.mouseOver(
                                    e,
                                    $(e.target).data('i'),
                                    $(e.target).data('take'),
                                );
                            });
                        $(`#${this.contentId} .meeting-card`)
                            .off('mousemove')
                            .on('mousemove', (e) => {
                                _this.moveMouse(e);
                            });
                        $(`#${this.contentId} .meeting-card`)
                            .off('mouseout')
                            .on('mouseout', (e) => {
                                console.log(e.relatedTarget);
                                if (!e.relatedTarget.className.includes('b-popover-tail')) {
                                    _this.mouseLeave(e);
                                }
                            });
                    },
                },
            });
        },
        genTakeUp(num, cell) {
            const takeUp = this.roomList[num].takeUpList;
            for (let i = 0; i < takeUp.length; i++) {
                if (takeUp[i].startCell == cell - 1) {
                    return `
                     <div id="${`popover${num}`}"
                        data-i="${num}"
                        data-index="${cell}"
                        data-take="${i}"
                        class="meeting-card ${takeUp[i].valid ? '' : 'valid'}"
                        style="width:${(takeUp[i].endCell
                          - takeUp[i].startCell)
                          * 33}px">
                        </div>
                    `;
                }
            }
            return '';
        },
        createElement(data) {
            let rows = [];
            rows = Array.from({ length: this.totalRoom }).map((item, num) => {
                let td = '';
                for (let cell = 1; cell <= this.timeMap.length * 2; cell++) {
                    td += `<div class="td" id='${
                        this.contentId
                    }td${num}index${cell}' data-i="${num}" data-index="${cell}">
                                                 ${this.genTakeUp(num, cell)}
                                            </div>`;
                }
                return `<div class="tr border-dotted-bottom" id="${this.contentId}tr${num}" data-i=${num}>${td}</div>`;
            });
            return rows;
        },
        initArr() {
            this.resetTarget('selectEnd');
            this.resetTarget('selectStart');
        },
        updateCheckedRoom(value) {
            this.checkedRoom = value;
            this.clearAllColor();
            value.forEach((item) => {
                this.paintColor(this.selectStart.index, this.selectEnd.index, item);
            });
        },
        setTimeRange(v1, v2) {
            const isCheck = this.selectEnd.index < 0;
            this.selectStart.index = v1;
            this.selectEnd.index = v2;
            isCheck && this.checkHighlightBlock();
            this.paintRange(this.selectStart.index, this.selectEnd.index);
        },
        singleChange(e, index) {
            const value = e.target.checked;
            const key = Number(e.target.value);
            console.log('key', key);
            if (value) {
                this.selectStart.i = index;
                if (typeof this.setSelectRange === 'function') {
                    this.setSelectRange(
                        this.setTimeRange,
                        this.selectStart.index,
                        this.selectEnd.index,
                    );
                }

                this.$emit('confirm-checked', key);
                // this.checkRoomChange(key)

                this.$nextTick(() => {
                    const isError = this.checkRoomChange(this.checkedRoom, key);
                    console.log(isError);
                    if (!isError) {
                        typeof this.remoteCheck === 'function' && this.remoteCheck(key);
                    }
                });
            } else {
                this.$emit('cancel-checked', key);
                this.clearColor(this.selectStart.index, this.selectEnd.index, key);
            }
        },
        checkRoomChange(value, key) {
            this.paintColor(this.selectStart.index, this.selectEnd.index, key);
            if (this.checkOverCover()) {
                value.splice(value.indexOf(key), 1);
                this.checkedRoom = value;
                this.clearColor(this.selectStart.index, this.selectEnd.index, key);
                this.$emit('conflict', this.checkedRoom);
                return true;
            }
            return false;
        },
        scrollThrottleR: debounce((e, vm) => {
            vm.$refs.scrollRight.$el.scrollTop = e.target.scrollTop;
        }, 5),
        scrollYF(e) {
            // this.$refs.scrollRight.$el.scrollTop = e.target.scrollTop;
            this.scrollThrottleR(e, this);
        },
        scrollThrottle: debounce((e, vm) => {
            if (vm.scrollX != e.target.scrollLeft) {
                vm.$refs.topbar.$el.scrollLeft = e.target.scrollLeft;
                vm.scrollX = e.target.scrollLeft;
            }

            if (vm.scrollY != e.target.scrollTop) {
                vm.$refs.scrollLeft.$el.scrollTop = e.target.scrollTop;
                vm.scrollY = e.target.scrollTop;
            }
        }, 0),
        scrollXF(e) {
            this.scrollThrottle(e, this);
        },
        moveMouse(e, num) {
            try {
                const value = $('.popover')
                    .css('transform')
                    .split('(')[1]
                    .split(')')[0]
                    .split(',');
                $('.popover').css({
                    transform: `translate3d(${e.pageX
            - $('.bf-popcontent').width() / 2}px,${value[5]}px,0)`,
                });
            } catch (error) {}
        },
        mouseLeave(e) {
            this.isMouseShow = false;
        },
        mouseOver(e, num, takeIndex) {
            if (typeof num !== 'undefined') {
                this.currentId = `popover${num}`;
                this.content = this.roomList[num].takeUpList[takeIndex];
            }
            if (!this.isEnd) {
                this.chooseTime(e);
                return;
            }
            this.isMouseShow = true;
        },
        checkOverCover() {
            if (
                $(`#${this.contentId}`).find('.high-light-check-time-project > .valid')
                    .length
            ) {
                return true;
            }
            console.time('checkover');
            for (let j = 0; j < this.checkedRoom.length; j++) {
                const obj = $(`.meeting-card[data-i=${this.checkedRoom[j]}].valid`);
                for (let k = 0; k < obj.length; k++) {
                    const _this = obj[k];
                    const i = $(_this).data('i');
                    const index = $(_this).data('index');
                    const cell = $(_this).width() / 33;
                    for (let s = 0; s < cell; s++) {
                        if (
                            $(`#${this.contentId}td${i}index${index + s}`).hasClass(
                                'high-light-check-time-project',
                            )
                        ) {
                            return true;
                        }
                    }
                }
            }
            console.timeEnd('checkover');
            return false;
        },
        leaveEndPaint(isEmit = true) {
            this.isEnd = true;
            this.clearAllColor();
            this.clearAllrangeColor();
            this.paintRange(this.selectStart.index, this.selectEnd.index);
            console.log(
                this.checkedRoom,
                'leaveEnd',
                this.selectStart.index,
                this.selectEnd.index,
            );
            this.checkedRoom.forEach((item) => {
                this.paintColor(
                    this.selectStart.index,
                    this.selectEnd.index,
                    item,
                    isEmit,
                );
            });
            if (this.checkOverCover()) {
                const value = this.checkedRoom;
                value.splice(value.indexOf(this.selectStart.index), 1);
                this.checkedRoom = value;
                this.$emit('conflict', this.checkedRoom);
                this.initArr();
                this.clearAllColor();
                this.clearAllrangeColor();
            }
            this.addChecked();
        },
        highLightTimeEnd(e) {
            e.preventDefault();
            if (this.isEnd) {
                return;
            }
            this.isEnd = true;
            const i = $(e.target).data('i');
            const index = $(e.target).data('index');
            this.selectEnd.i = Number(i);
            this.selectEnd.index = Number(index);
            this.paintRange(this.selectStart.index, this.selectEnd.index);
            if (this.checkedRoom.length > 1) {
                this.checkedRoom.forEach((item) => {
                    this.paintColor(this.selectStart.index, this.selectEnd.index, item);
                });
            } else {
                this.paintColor(
                    this.selectStart.index,
                    this.selectEnd.index,
                    this.selectStart.i,
                );
            }
            // this.switchStarEnd();
            if (this.checkOverCover()) {
                const value = this.checkedRoom;
                value.splice(value.indexOf(this.selectStart.index), 1);
                this.checkedRoom = value;
                this.$emit('conflict', this.checkedRoom);
                if ($(e.target).hasClass('meeting-card')) {
                    this.isMouseShow = true;
                }
                this.initArr();
                this.clearAllColor();
                this.clearAllrangeColor();
            }
            console.log('highLightTimeEnd', this.selectStart, this.selectEnd);
        },
        resetTarget(target) {
            this[target] = {
                i: -1,
                index: -1,
            };
        },
        clearAllColor() {
            $(`#${this.contentId} .td.high-light-check-time-project`).removeClass(
                'high-light-check-time-project',
            );
        },
        clearAllrangeColor() {
            $(`#${this.contentId} .td`).removeClass(
                'high-light-range-left high-light-range-right',
            );
        },
        checkHighlightBlock() {
            this.checkedRoom.forEach((i) => {
                if (
                    !$(`#${this.contentId}tr${i} .td`).hasClass(
                        'high-light-check-time-project',
                    )
                ) {
                    this.paintColor(this.selectStart.index, this.selectEnd.index, i);
                }
            });
        },
        paintRange(start, end) {
            if (start < 0 || end < 0 || isNaN(end) || isNaN(start)) {
                return;
            }
            if (end < start) {
                end ^= start;
                start ^= end;
                end ^= start;
            }
            $(`[data-index=${start}].td`).addClass('high-light-range-left');
            $(`[data-index=${end}].td`).addClass('high-light-range-right');
        },
        getTimeIndex(date, point) {
            date = moment(date).format('YYYY/MM/DD');
            const dayIndex = this.dayMap.indexOf(date) * this.timeMap.length;
            const timeIndex = this.pointMap.findIndex(itm => itm == point);
            return dayIndex + timeIndex;
        },
        paintColor(start, end, row, isEmit = true) {
            if (start < 0 || end < 0 || isNaN(end) || isNaN(start)) {
                return;
            }
            if (end < start) {
                end ^= start;
                start ^= end;
                end ^= start;
            }
            for (let s = start; s <= end; s++) {
                console.log(row, s);
                $(`#${this.contentId}td${row}index${s}`).addClass(
                    'high-light-check-time-project',
                );
            }
            if (isEmit) {
                const sdate = this.dayMap[0];
                const edate = this.dayMap[0];
                const eMinus = this.granularity / 2;
                this.$emit('choose-time', {
                    startTime:
            new Date(sdate).valueOf() + (start - 1) * eMinus * 60 * 1000,
                    endTime: new Date(edate).valueOf() + end * eMinus * 60 * 1000,
                });
            }
        },
        clearColor(start, end, row) {
            for (let s = start; s <= end; s++) {
                $(`#${this.contentId}td${row}index${s}`).removeClass(
                    'high-light-check-time-project',
                );
            }
        },
        switchStarEnd() {
            if (this.selectStart.index > this.selectEnd.index) {
                const temp = this.selectStart.index;
                this.selectStart.index = this.selectEnd.index;
                this.selectEnd.index = temp;
            }
        },
        chooseTime(e, num, cell) {
            e.preventDefault();
            if (this.isEnd) {
                return;
            }
            const i = $(e.target).data('i');
            const index = $(e.target).data('index');
            this.selectEnd.i = Number(i);
            this.selectEnd.index = Number(index);
            this.clearAllColor();
            if (this.checkedRoom.length > 1) {
                this.checkedRoom.forEach((item) => {
                    this.paintColor(this.selectStart.index, this.selectEnd.index, item);
                });
            } else {
                this.paintColor(
                    this.selectStart.index,
                    this.selectEnd.index,
                    this.selectStart.i,
                );
            }
        },
        highLightTimeStart(e) {
            e.preventDefault();
            this.isEnd = false;
            this.initArr();
            const i = Number($(e.target).data('i'));
            let index = Number($(e.target).data('index'));
            if ($(e.target).hasClass('meeting-card')) {
                index += Math.floor(e.offsetX / 33);
            }
            if (this.checkedRoom.length <= 1) {
                this.checkedRoom = [];
                this.clearAllColor();
                this.clearAllrangeColor();
            } else if (i != this.selectStart.i || index != this.selectStart.index) {
                this.clearAllColor();
                this.clearAllrangeColor();
            }
            if (isNaN(i)) {
                return;
            }
            $(`#${this.contentId}td${i}index${index}`).addClass(
                'high-light-check-time-project',
            );
            this.oPCheckedRoomList(i);
            this.selectStart.i = Number(i);
            this.selectStart.index = Number(index);
            this.selectEnd.i = -1;
            this.selectEnd.index = -1;
            console.log('start', this.selectStart);
        },
    },
};
</script>
