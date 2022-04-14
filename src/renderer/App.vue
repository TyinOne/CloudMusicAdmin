<template>
  <title-bar v-if="!isWeb"/>
  <title-placeholder v-else/>
  <el-config-provider>
    <router-view v-show="getThemeConfig.lockScreenTime !== 0"/>
    <Settings ref="settingsRef" v-show="getThemeConfig.lockScreenTime !== 0"/>
    <CloseFull/>
  </el-config-provider>
</template>

<script setup lang="ts">
import {computed, getCurrentInstance, nextTick, onBeforeMount, onMounted, onUnmounted, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {useStore} from '@renderer/store';
import Settings from '@renderer/layout/navBars/breadcrumb/settings.vue';
import setIntroduction from '@renderer/utils/setIconfont';
import {Local, Session} from "@renderer/utils/storage";
import other from "@renderer/utils/other";
import CloseFull from '@renderer/layout/navBars/breadcrumb/closeFull.vue'
import TitleBar from '@renderer/components/titleBar/index.vue'
import TitlePlaceholder from '@renderer/components/titleBar/placeholder.vue'

const {proxy} = <any>getCurrentInstance();
const settingsRef = ref();
const route = useRoute();
const store = useStore();
const isWeb = ref(process.env.is_web)
// 获取布局配置信息
const getThemeConfig = computed(() => {
  return store.state.themeConfig.themeConfig;
});

// 布局配置弹窗打开
const openSettingsDrawer = () => {
  settingsRef.value.openDrawer();
};

onBeforeMount(() => {
  // 设置批量第三方 icon 图标
  setIntroduction.cssCdn();
  // 设置批量第三方 js
  setIntroduction.jsCdn();
});
// 页面加载时
onMounted(() => {
  nextTick(() => {
    // 监听布局配置弹窗点击打开
    proxy.mittBus.on('openSettingsDrawer', () => {
      openSettingsDrawer();
    });
    // 获取缓存中的布局配置
    if (Local.get('themeConfig')) {
      store.dispatch('themeConfig/setThemeConfig', Local.get('themeConfig'));
      document.documentElement.style.cssText = Local.get('themeConfigStyle');
    }
    // 获取缓存中的全屏配置
    if (Session.get('isTagsViewCurrenFull')) {
      store.dispatch('tagsViewRoutes/setCurrenFullscreen', Session.get('isTagsViewCurrenFull'));
    }
  });
});
// 页面销毁时，关闭监听布局配置/i18n监听
onUnmounted(() => {
  proxy.mittBus.off('openSettingsDrawer', () => {
  });
});
// 监听路由的变化，设置网站标题
watch(
    () => route.path,
    () => {
      other.useTitle();
    }
);

</script>
<script lang="ts">
export default {
  name: "App"
}
</script>

<style scoped>

</style>