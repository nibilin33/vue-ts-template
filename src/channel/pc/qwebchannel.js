window.sendMessageToPlatformFunc = function (data) {
    if (window.sendMsgJs2Qt) {
        window.sendMsgJs2Qt(data);
    }
};

if (window.initData) {
    window.initData();
}
