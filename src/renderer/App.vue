<template>
  <el-config-provider>
    <router-view v-show="getThemeConfig.lockScreenTime !== 0"/>
    <Settings ref="settingsRef" v-show="getThemeConfig.lockScreenTime !== 0"/>
  </el-config-provider>
</template>

<script setup lang="ts">
import {computed, getCurrentInstance, onBeforeMount, ref} from 'vue';
import {useRoute} from 'vue-router';
import {useStore} from '@renderer/store';
import Settings from '@renderer/layout/navBars/breadcrumb/settings.vue';
import setIntroduction from '@renderer/utils/setIconfont';
import {ThemeConfigState} from "@renderer/store/interface";

const {proxy} = <any>getCurrentInstance();
const settingsRef = ref();
const route = useRoute();
const store = useStore();

const getThemeConfig = computed(() => {
  return themConfig().themeConfig;
});

const themConfig = (): ThemeConfigState => {
  return store.state.themeConfig
}

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