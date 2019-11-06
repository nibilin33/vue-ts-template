import { get } from 'lodash';
// 网页性能跟踪，以及打印一些可以排查到问题的日志
window.trace = function (data:any) {
    console.log(data);
    console.log({
        jsMemory: get(window, 'performance.memory.jsHeapSizeLimit'),
        domTiming: get(window, 'performance.timing.domComplete') - get(window, 'performance.timing.domLoading'),
        requestTiming: get(window, 'performance.timing.responseEnd') - get(window, 'performance.timing.requestStart'),
    });
};
