<template>
  <div class="h100">
    <router-view v-slot="{Component}">
      <transition :name="setTransitionName" mode="out-in">
        <keep-alive :include="state.keepAliveNameList">
          <component :is="Component" :key="state.refreshRouterViewKey" :style="{ minHeight }" class="w100"/>
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>
<script lang="ts" setup>
import {computed, getCurrentInstance, nextTick, onBeforeMount, onUnmounted, reactive, watch} from "vue";
import {useStore} from "@renderer/store";
import {useRoute} from "vue-router";

// 定义接口来定义对象的类型
interface ParentViewState {
  refreshRouterViewKey: null | string;
  keepAliveNameList: string[];
}

const props = defineProps({
  minHeight: {
    type: String,
    default: '',
  },
})
const {proxy} = <any>getCurrentInstance();
const route = useRoute();
const store = useStore();
const state = reactive<ParentViewState>({
  refreshRouterViewKey: null,
  keepAliveNameList: [],
});
const setTransitionName = computed(() => {
  return store.state.themeConfig.themeConfig.animation;
});
// 获取布局配置信息
const getThemeConfig = computed(() => {
  return store.state.themeConfig.themeConfig;
});
// 获取组件缓存列表(name值)
const getKeepAliveNames = computed(() => {
  return store.state.keepAliveNames.keepAliveNames;
});
// 页面加载前，处理缓存，页面刷新时路由缓存处理
onBeforeMount(() => {
  state.keepAliveNameList = getKeepAliveNames.value;
  proxy.mittBus.on('onTagsViewRefreshRouterView', (fullPath: string) => {
    state.keepAliveNameList = getKeepAliveNames.value.filter((name: string) => route.name !== name);
    state.refreshRouterViewKey = null;
    nextTick(() => {
      state.refreshRouterViewKey = fullPath;
      state.keepAliveNameList = getKeepAliveNames.value;
    });
  });
});
onUnmounted(() => {
  proxy.mittBus.off('onTagsViewRefreshRouterView');
});
// 监听路由变化，防止 tagsView 多标签时，切换动画消失
watch(
    () => route.fullPath,
    () => {
      state.refreshRouterViewKey = route.fullPath;
    }
);
</script>
<script lang="ts">
export default {
  name: "layoutParentView"
}
</script>

<style scoped>

</style>