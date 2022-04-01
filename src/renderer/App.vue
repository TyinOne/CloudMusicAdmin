<template>
  <template>
    <el-config-provider>
      <router-view v-show="getThemeConfig.lockScreenTime !== 0" />
      <Settings ref="settingsRef" v-show="getThemeConfig.lockScreenTime !== 0" />
    </el-config-provider>
  </template>
</template>

<script setup lang="ts">
import { computed, ref, getCurrentInstance, onBeforeMount, onMounted, onUnmounted, nextTick, defineComponent, watch, reactive, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from '@renderer/store';
import { Local, Session } from '@renderer/utils/storage';
import Settings from '@renderer/layout/navBars/breadcrumb/setings.vue';
import setIntroduction from '@renderer/utils/setIconfont';

const { proxy } = <any>getCurrentInstance();
const settingsRef = ref();
const route = useRoute();
const store = useStore();
const getThemeConfig = computed(() => {
  return store.state.themeConfig.themeConfig;
});

onBeforeMount(() => {
  // 设置批量第三方 icon 图标
  setIntroduction.cssCdn();
  // 设置批量第三方 js
  setIntroduction.jsCdn();
});






</script>
<script lang="ts">
export default {
  name: "App"
}
</script>

<style scoped>

</style>