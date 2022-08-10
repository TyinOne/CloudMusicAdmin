<template>
  <component :is="getThemeConfig.layout"/>
</template>


<script lang="ts">
import {useStore} from '@renderer/store'
import {computed, defineAsyncComponent, getCurrentInstance, onBeforeMount, onUnmounted} from 'vue';
import {Local} from "@renderer/utils/storage";

export default {
  name: "index",
  components: {
    defaults: defineAsyncComponent(() => import('@renderer/layout/main/defaults.vue')),
    classic: defineAsyncComponent(() => import('@renderer/layout/main/classic.vue')),
    transverse: defineAsyncComponent(() => import('@renderer/layout/main/transverse.vue')),
    columns: defineAsyncComponent(() => import('@renderer/layout/main/columns.vue')),
  },
  setup() {
    const {proxy} = <any>getCurrentInstance();
    const store = useStore();
    // 获取布局配置信息
    const getThemeConfig = computed(() => {
      return store.state.themeConfig.themeConfig;
    });
    // 窗口大小改变时(适配移动端)
    const onLayoutResize = () => {
      if (!Local.get('oldLayout')) Local.set('oldLayout', getThemeConfig.value.layout);
      const clientWidth = document.body.clientWidth;
      if (clientWidth < 1000) {
        getThemeConfig.value.isCollapse = false;
        proxy.mittBus.emit('layoutMobileResize', {
          layout: 'defaults',
          clientWidth,
        });
      } else {
        proxy.mittBus.emit('layoutMobileResize', {
          layout: Local.get('oldLayout') ? Local.get('oldLayout') : getThemeConfig.value.layout,
          clientWidth,
        });
      }
    };
    // 页面加载前
    onBeforeMount(() => {
      onLayoutResize();
      window.addEventListener('resize', onLayoutResize);
    });
    // 页面卸载时
    onUnmounted(() => {
      window.removeEventListener('resize', onLayoutResize);
    });
    return {
      getThemeConfig,
    };
  }
}
</script>

<style scoped>

</style>