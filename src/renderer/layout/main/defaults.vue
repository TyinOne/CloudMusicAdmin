<template>
  <el-container class="layout-container">
    <Aside/>
    <el-container class="flex-center" :class="{ 'layout-backtop': !isFixedHeader }">
      <Header v-if="isFixedHeader"/>
      <el-scrollbar ref="layoutDefaultsScrollbarRef" :class="{ 'layout-backtop': isFixedHeader }">
        <Header v-if="!isFixedHeader"/>
        <Main/>
      </el-scrollbar>
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
import Main from '@renderer/layout/component/main.vue'
import Aside from '@renderer/layout/component/aside.vue'
import Header from '@renderer/layout/component/header.vue'
import {computed, getCurrentInstance, watch} from "vue";
import {useRoute} from "vue-router";
import {useStore} from "@renderer/store";

const {proxy} = getCurrentInstance() as any;
const store = useStore();
const route = useRoute();
const isFixedHeader = computed(() => {
  return store.state.themeConfig.themeConfig.isFixedHeader;
});
// 监听路由的变化
watch(
    () => route.path,
    () => {
      proxy.$refs.layoutDefaultsScrollbarRef.wrap$.scrollTop = 0;
    }
);
</script>
<script lang="ts">
export default {
  name: "defaults"
}
</script>

<style scoped>

</style>