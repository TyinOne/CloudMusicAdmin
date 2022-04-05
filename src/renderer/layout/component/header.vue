<template>
  <el-header class="layout-header" :height="setHeaderHeight" v-show="!isTagsViewCurrenFull">
    <NavBarsIndex />
  </el-header>
</template>
<script lang="ts" setup>
import {useStore} from "@renderer/store";
import {computed} from "vue";
import NavBarsIndex from '@renderer/layout/navBars/index.vue'
const store = useStore();
// 设置 header 的高度
const setHeaderHeight = computed(() => {
  let { isTagsview, layout } = store.state.themeConfig.themeConfig;
  if (isTagsview && layout !== 'classic') return '84px';
  else return '50px';
});
// 获取卡片全屏信息
const isTagsViewCurrenFull = computed(() => {
  return store.state.tagsViewRoutes.isTagsViewCurrenFull;
});
</script>
<script lang="ts">
export default {
  name: "layoutHeader"
}
</script>

<style scoped>

</style>