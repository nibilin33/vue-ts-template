<template>
  <div id="wrapper">
      <h4 style="color:red;">{{error}}</h4>
    设置加载URL：<input
      @keydown.enter="setUrl"
      style="width:90%"
      v-model="pageUrl"/>
    <button class="border" @click="setUrl">设置</button>
    <hr/>
    <button class="border" :disabled="!ready" @click="sendMsg({
      param: {
        notify:'notify_language_changed',
        lang: 'English'
      }
    })">英文</button>
    <button class="border" :disabled="!ready"
    @click="sendMsg({
      param: {
        notify:'notify_language_changed',
        lang: 'Chinese_S'
      }
    })">中文</button>
    <hr/>
    <button
      class="border"
      :disabled="!ready"
      @click="setTheme('Default')">正常模式</button>
    <button :disabled="!ready"
        class="border"
      @click="setTheme('Dark')">深色模式</button>
    <br/>
    高亮色：<button
      class="size"
      v-for="(item,index) in colorButtons"
      :key="index"
      @click="setColor(item)"
      :style="{background:`#${item}`}"></button>
      <el-button>show theme</el-button>
    <webview id="webview" src="file:///J:/gitlab/ume-2.3-for-testlocal/server/dist/pc/index.html"></webview>
  </div>
</template>

<script>
import {
    Button,
} from '@yealink-ui';
import Theme from '@/utils/theme';

export default {
    name: 'landing-page',
    components: {
        [Button.name]: Button,
    },
    data() {
        return {
            pageUrl: '',
            ready: false,
            error: '',
            param: {
                theme: 'Default',
                color: '',
            },
            colorButtons: [
                'BE0707',
                'EF7304',
                'A6CE51',
                '29C28F',
                '1EC8D2',
                '238CEB',
                '5A63C7',
                '00AA84',
                '00BE93',
            ],
        };
    },
    mounted() {
    },
    methods: {
        setUrl() {
            if (!this.pageUrl) {
                this.error = '请输入链接';
                return;
            }
            this.error = '';
            const webview = document.getElementById('webview');
            webview.loadURL(this.pageUrl);
            webview.style.height = '80vh';
            webview.addEventListener('dom-ready', () => {
                const { webContents } = webview.getWebContents();
                webContents.on('did-finish-load', () => {
                    this.ready = true;
                });
            });
        },
        setTheme(theme) {
            this.param.theme = theme;
            this.sendMsg({
                param: {
                    notify: 'notify_theme_changed',
                    ...this.param,
                },
            });
        },
        setColor(color) {
            this.param.color = color;
            this.sendMsg({
                param: {
                    notify: 'notify_theme_changed',
                    ...this.param,
                },
            });
        },
        sendMsg(msg) {
            const webview = document.getElementById('webview');
            const { webContents } = webview.getWebContents();
            webContents.executeJavaScript(`receiveMessageFromPlatformFunc('${JSON.stringify(msg)}')`);
        },
    },
};
</script>

<style scoped lang="scss">
.border{
    border: 1px solid #ccc;
}
.size {
  width:20px;
  height: 20px;
  margin-right: 20px;
}
</style>
