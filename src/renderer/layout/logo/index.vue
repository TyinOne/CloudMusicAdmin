<template>
  <div v-if="setShowLogo" class="layout-logo" @click="onThemeConfigChange">
    <img :src="logoMini" class="layout-logo-medium-img"/>
    <span>{{ getThemeConfig.globalTitle }}</span>
  </div>
  <div v-else class="layout-logo-size" @click="onThemeConfigChange">
    <img :src="logoMini" class="layout-logo-size-img"/>
  </div>
</template>
<script lang="ts" setup>
import {useStore} from "@renderer/store";
import {computed} from "vue";
import logoMini from '@renderer/assets/cloud_music.svg'

const store = useStore();
// 获取布局配置信息
const getThemeConfig = computed(() => {
  return store.state.themeConfig.themeConfig;
});
// 设置 logo 的显示。classic 经典布局默认显示 logo
const setShowLogo = computed(() => {
  let {isCollapse, layout} = store.state.themeConfig.themeConfig;
  return !isCollapse || layout === 'classic' || document.body.clientWidth < 1000;
});
// logo 点击实现菜单展开/收起
const onThemeConfigChange = () => {
  if (store.state.themeConfig.themeConfig.layout === 'transverse') return false;
  store.state.themeConfig.themeConfig.isCollapse = !store.state.themeConfig.themeConfig.isCollapse;
};

</script>

<script lang="ts">
export default {
  name: "index"
}
</script>


<style lang="scss" scoped>
.layout-logo {
  margin-top: 10px;
  width: 220px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: rgb(0 21 41 / 2%) 0 1px 4px;
  color: #4b4b4b;
  font-size: 16px;
  cursor: pointer;
  animation: logoAnimation 0.3s ease-in-out;
  font-weight: bolder;
  &:hover {
    span {
      color: #000000;
    }
  }

  &-medium-img {
    width: 40px;
    margin-right: 5px;
  }
}

.layout-logo-size {
  width: 100%;
  height: 60px;
  display: flex;
  cursor: pointer;
  animation: logoAnimation 0.3s ease-in-out;

  &-img {
    width: 40px;
    margin: auto;
  }

  &:hover {
    img {
      animation: logoAnimation 0.3s ease-in-out;
    }
  }
}
</style>