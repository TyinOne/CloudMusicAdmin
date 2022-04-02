<template>
  <component :is="getThemeConfig.layout"/>
</template>

<script lang="ts" setup>
import {computed, defineAsyncComponent, getCurrentInstance} from 'vue';
import {useStore} from '@renderer/store'

const defaults = defineAsyncComponent(() => import('@renderer/layout/main/defaults.vue'))
const classic = defineAsyncComponent(() => import('@renderer/layout/main/classic.vue'))
const transverse = defineAsyncComponent(() => import('@renderer/layout/main/transverse.vue'))
const columns = defineAsyncComponent(() => import('@renderer/layout/main/columns.vue'))

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