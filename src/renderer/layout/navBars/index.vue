<template>
  <div class="layout-navbars-container">
    <BreadcrumbIndex />
    <TagsView v-if="setShowTagsView" />
  </div>
</template>

<script setup lang="ts">
import {useStore} from "@renderer/store";
import {computed} from "vue";
import BreadcrumbIndex from '@renderer/layout/navBars/breadcrumb/index.vue'
import TagsView from '@renderer/layout/navBars/tagsView/tagsView.vue'

const store = useStore();
// 是否显示 tagsView
const setShowTagsView = computed(() => {
  let { layout, isTagsview } = store.state.themeConfig.themeConfig;
  return layout !== 'classic' && isTagsview;
});

</script>

<script lang="ts">
export default {
  name: "layoutNavBars"
}
</script>

<style scoped>
.layout-navbars-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>