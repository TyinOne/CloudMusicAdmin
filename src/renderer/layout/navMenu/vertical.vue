<template>
  <el-menu
      :collapse="state.isCollapse"
      :collapse-transition="false"
      :default-active="state.defaultActive"
      :unique-opened="getThemeConfig.isUniqueOpened"
      background-color="transparent"
      router
  >
    <template v-for="val in menuLists">
      <el-sub-menu v-if="val.children && val.children.length > 0" :key="val.path" :index="val.path">
        <template #title>
          <SvgIcon :name="val.meta.icon"/>
          <span>{{ val.meta.title }}</span>
        </template>
        <SubItem :child="val.children"/>
      </el-sub-menu>
      <template v-else>
        <el-menu-item :key="val.path" :index="val.path">
          <SvgIcon :name="val.meta.icon"/>
          <template v-if="!val.meta.isLink || (val.meta.isLink && val.meta.isIframe)" #title>
            <span>{{ val.meta.title }}</span>
          </template>
          <template v-else #title>
            <a :href="val.meta.isLink" class="w100" rel="opener" target="_blank">{{ val.meta.title }}</a>
          </template>
        </el-menu-item>
      </template>
    </template>
  </el-menu>
</template>
<script lang="ts" setup>
import {useStore} from "@renderer/store";
import {onBeforeRouteUpdate, useRoute} from "vue-router";
import {computed, onMounted, reactive, watch} from "vue";
import SubItem from '@renderer/layout/navMenu/subItem.vue'

const props = defineProps({
  menuList: {
    type: Array,
    default: () => [],
  }
})
const store = useStore();
const route = useRoute();
const state = reactive({
  // 修复：https://gitee.com/lyt-top/vue-next-admin/issues/I3YX6G
  defaultActive: route.meta.isDynamic ? route.meta.isDynamicPath : route.path,
  isCollapse: false,
});
// 获取父级菜单数据
const menuLists = computed(() => {
  return <any>props.menuList;
});
// 获取布局配置信息
const getThemeConfig = computed(() => {
  return store.state.themeConfig.themeConfig;
});
// 菜单高亮（详情时，父级高亮）
const setParentHighlight = (currentRoute: any) => {
  const {path, meta} = currentRoute;
  const pathSplit = meta.isDynamic ? meta.isDynamicPath.split('/') : path.split('/');
  if (pathSplit.length >= 4 && meta.isHide) return pathSplit.splice(0, 3).join('/');
  else return path;
};
// 设置菜单的收起/展开
watch(
    store.state.themeConfig.themeConfig,
    () => {
      document.body.clientWidth <= 1000 ? (state.isCollapse = false) : (state.isCollapse = getThemeConfig.value.isCollapse);
    },
    {
      immediate: true,
    }
);
// 页面加载时
onMounted(() => {
  state.defaultActive = setParentHighlight(route);
});
// 路由更新时
onBeforeRouteUpdate((to) => {
  // 修复：https://gitee.com/lyt-top/vue-next-admin/issues/I3YX6G
  state.defaultActive = setParentHighlight(to);
  const clientWidth = document.body.clientWidth;
  if (clientWidth < 1000) getThemeConfig.value.isCollapse = false;
});

</script>
<script lang="ts">
export default {
  name: "navMenuVertical"
}
</script>

<style scoped>

</style>