<template>
  <div>
    PC端界面哈哈哈哈
    <el-button>默认按钮</el-button>
    <el-button type="primary" @click="show">主要按钮</el-button>
    <el-button type="success" @click="validLog">成功按钮</el-button>
    <el-button type="info" @click="validI18n('zh')">中文</el-button>
    <el-button type="warning" @click="validI18n('en')">英文</el-button>
    <el-button type="danger">翻译结果：{{$t('common.currentLang')}}</el-button>
  </div>
</template>
<script>
import { Button } from '@yealink-ui';
import Axios from '@/api/request';
import { Notice } from '@/views/notice/entity/index';
import { $t } from '@/i18n';
import { setLanguage } from '@/utils/lang';

export default {
    components: {
        [Button.name]: Button,
    },
    methods: {
        show() {
            console.log('click');
            const ax = new Axios();
            Array.from({ length: 10 }).forEach((element) => {
                setTimeout(() => {
                    ax.setPedding('/front/questionnaire/oauth', { error: '' }).post('/front/questionnaire/oauth', { username: 'dddd' });
                }, 10);
            });
        },
        validLog() {
            new Notice().findById();
            trace('validlog');
        },
        validI18n(lang) {
            setLanguage(lang);
        },
    },
};
</script>
