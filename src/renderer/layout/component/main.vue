<template>
  <el-main class="layout-main">
    <el-scrollbar
        ref="layoutScrollbarRef"
        :style="{ padding: state.currentRouteMeta.isLink && state.currentRouteMeta.isIframe ? 0 : '', transition: 'padding 0.3s ease-in-out' }"
        class="layout-scrollbar"
    >
      <LayoutParentView
          :style="getThemeConfig.isTagsViewCurrenFull ? {minHeight: '100vh'} : { minHeight: `calc(100vh - ${state.headerHeight})` }"/>
    </el-scrollbar>
  </el-main>
</template>
<script lang="ts" setup>
import LayoutParentView from '@renderer/layout/routerView/parent.vue'
import {computed, getCurrentInstance, onMounted, reactive, watch} from "vue";
import {useRoute} from "vue-router";
import {useStore} from "@renderer/store";

// 定义接口来定义对象的类型
interface MainState {
  headerHeight: string | number;
  currentRouteMeta: any;
}

const {proxy} = <any>getCurrentInstance();
const route = useRoute();
const store = useStore();
const state = reactive<MainState>({
  headerHeight: '',
  currentRouteMeta: {},
});
// 获取布局配置信息
const getThemeConfig = computed(() => {
  return store.state.themeConfig.themeConfig;
});
// 设置 main 的高度
const initHeaderHeight = () => {
  const bool = state.currentRouteMeta.isLink && state.currentRouteMeta.isIframe;
  let {isTagsview} = store.state.themeConfig.themeConfig;
  if (isTagsview) return (state.headerHeight = bool ? `85px` : `114px`);
  else return (state.headerHeight = `51px`);
};
// 初始化获取当前路由 meta，用于设置 iframes padding
const initGetMeta = () => {
  state.currentRouteMeta = route.meta;
};
// 页面加载前
onMounted(async () => {
  await initGetMeta();
  initHeaderHeight();
});
// 监听路由变化
watch(
    () => route.path,
    () => {
      state.currentRouteMeta = route.meta;
      const bool = state.currentRouteMeta.isLink && state.currentRouteMeta.isIframe;
      state.headerHeight = bool ? `85px` : `114px`;
      proxy.$refs.layoutScrollbarRef.update();
    }
);
// 监听 themeConfig 配置文件的变化，更新菜单 el-scrollbar 的高度
watch(store.state.themeConfig.themeConfig, (val) => {
  state.currentRouteMeta = route.meta;
  const bool = state.currentRouteMeta.isLink && state.currentRouteMeta.isIframe;
  state.headerHeight = val.isTagsview ? (bool ? `85px` : `114px`) : '51px';
  if (val.isFixedHeaderChange !== val.isFixedHeader) {
    if (!proxy.$refs.layoutScrollbarRef) return false;
    proxy.$refs.layoutScrollbarRef.update();
  }
});


</script>

<script lang="ts">
export default {
  name: "layoutMain"
}
</script>

<style scoped>

</style>