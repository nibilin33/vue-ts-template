<template>
  <router-view></router-view>
</template>
<script>
export default {
    name: 'meetingindex',
    created() {
        console.log(this.$style['meeting-layout']);
    },
};
</script>
<style src="@yealink-ui-css/icon.css">
</style>
<style src="@yealink-ui-css/button.css">
</style>
<style lang="scss" module scoped>
.meeting-layout{
  font-size:24px;
  color: red;
}
</style>
