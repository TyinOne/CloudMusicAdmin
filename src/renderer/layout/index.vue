<template>
  <component :is="getThemeConfig.layout"/>
</template>

<script lang="ts" setup>
import {computed, getCurrentInstance} from 'vue';
import {useStore} from '@renderer/store'

const {proxy} = <any>getCurrentInstance();
const store = useStore();
// 获取布局配置信息
const getThemeConfig = computed(() => {
  return store.state.themeConfig.themeConfig;
});
</script>


<script>
export default {
  name: "index"
}
</script>

<style scoped>

</style>