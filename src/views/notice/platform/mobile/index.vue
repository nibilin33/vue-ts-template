<template>
    <div>移动端界面哈哈哈哈哈
     <van-button type="default">默认按钮</van-button>
    <van-button type="primary">主要按钮</van-button>
    <van-button type="info">信息按钮</van-button>
    <van-button type="warning">警告按钮</van-button>
    <van-button type="danger">危险按钮</van-button>
    </div>
</template>
<script>
import { Button } from '@vant-ui';

export default {
    components: {
        [Button.name]: Button,
    },
};
</script>
<style src="@vant-theme/button/index.less" lang="less">
</style>
