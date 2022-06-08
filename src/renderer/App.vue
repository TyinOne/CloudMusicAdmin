<template>
  <title-bar v-if="!isWeb"/>
  <el-config-provider>
    <router-view v-show="getThemeConfig.lockScreenTime !== 0"/>
    <!--    <Settings v-show="getThemeConfig.lockScreenTime !== 0" ref="settingsRef"/>-->
    <Download ref="downloadRef"></Download>
    <CloseFull/>
  </el-config-provider>
</template>

<script lang="ts" setup>
import {computed, getCurrentInstance, nextTick, onBeforeMount, onMounted, onUnmounted, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {useStore} from '@renderer/store';
// import Settings from '@renderer/layout/navBars/breadcrumb/settings.vue';
import Download from "@renderer/layout/navBars/breadcrumb/download.vue";
import setIntroduction from '@renderer/utils/setIconfont';
import {Local, Session} from "@renderer/utils/storage";
import other from "@renderer/utils/other";
import CloseFull from '@renderer/layout/navBars/breadcrumb/closeFull.vue'
import TitleBar from '@renderer/components/titleBar/index.vue'

const {proxy} = <any>getCurrentInstance();
// const settingsRef = ref();
const downloadRef = ref();
const route = useRoute();
const store = useStore();
const isWeb = ref(process.env.is_web)
// 获取布局配置信息
const getThemeConfig = computed(() => {
  return store.state.themeConfig.themeConfig;
});
const openDownloadDrawer = () => {
  downloadRef.value.openDrawer()
}

// 布局配置弹窗打开
const openSettingsDrawer = () => {
  // settingsRef.value.openDrawer();
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
    proxy.mittBus.on('openDownloadDrawer', () => {
      openDownloadDrawer();
    });
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
  proxy.mittBus.off('openDownloadDrawer', () => {
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