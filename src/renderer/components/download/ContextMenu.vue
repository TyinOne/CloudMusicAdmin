<template>
  <transition name="el-zoom-in-center">
    <div
        v-show="state.isShow"
        :key="Math.random()"
        :style="`top: ${dropdowns.y + 5}px;left: ${dropdowns.x}px;`"
        aria-hidden="true"
        class="el-dropdown__popper el-popper is-light is-pure custom-contextmenu"
        data-popper-placement="bottom"
        role="tooltip"
    >
      <ul class="el-dropdown-menu">
        <template v-for="(item, k) in state.dropdownList" :key="k">
          <li v-if="!item.id" aria-disabled="false"
              class="el-dropdown-menu__item"
              tabindex="-1"
              @click="onCurrentContextmenuClick(item.contextMenuClickId)"
          >
            <SvgIcon :size="20" :name="item.icon"/>
            <span>{{ item.txt }}</span>
          </li>
          <li class="el-dropdown-menu__item--divided" v-else/>
        </template>
      </ul>
      <div :style="{ left: `${state.arrowLeft}px` }" class="el-popper__arrow"></div>
    </div>
  </transition>
</template>
<script lang="ts" setup>
import {computed, onMounted, onUnmounted, reactive, ref} from "vue";

const props = defineProps({
  dropdown: {
    type: Object,
    default: () => {
      return {
        x: 0,
        y: 0,
      };
    },
  },
})
const emit = defineEmits(['currentClick'])
const item = ref({
  status: 0
})
const state = reactive({
  isShow: false,
  dropdownList: [],
  arrowLeft: 10,
});
const openContextmenu = (i: any) => {
  item.value = i;
  closeContextmenu();
  setTimeout(() => {
    state.dropdownList = [{
      id: 0,
      contextMenuClickId: 0,
      txt: (getAction(i.status)).name,
      icon: (getAction(i.status)).icon,
    },
      {id: 0, contextMenuClickId: 1, txt: '打开文件夹', icon: 'bi-folder2-open bi'},
      {id: 1, contextMenuClickId: null, txt: null, icon: null},
      {id: 0, contextMenuClickId: 2, txt: '删除', icon: 'bi-trash3 bi'},
      {id: 0, contextMenuClickId: 3, txt: '彻底删除', icon: 'bi-x-lg bi'},
      {id: 1, contextMenuClickId: null, txt: null, icon: null},
      {id: 0, contextMenuClickId: 4, txt: '复制下载链接', icon: 'bi-files bi'}]
    state.isShow = true;
  }, 10);
};
const closeContextmenu = () => {
  state.isShow = false;
};
const onCurrentContextmenuClick = (type) => {
  emit('currentClick', {item: item.value,action: type})
}
// 父级传过来的坐标 x,y 值
const dropdowns = computed(() => {
  // 117 为 `Dropdown 下拉菜单` 的宽度
  if (props.dropdown.x + 117 > document.documentElement.clientWidth) {
    return {
      x: document.documentElement.clientWidth - 117 - 5,
      y: props.dropdown.y,
    };
  } else {
    return props.dropdown;
  }
});
const getAction = (status: number) => {
  let name = ''
  let icon = ''
  switch (status) {
    case 0:
      name = '暂停'
      icon = 'bi-pause-fill bi'
      break;
    default:
      name = '开始'
      icon = 'bi-play bi'
      break;
  }
  return {
    name: name,
    icon: icon
  }
}
// 监听页面监听进行右键菜单的关闭
onMounted(() => {
  document.body.addEventListener('click', closeContextmenu);
  document.body.addEventListener('contextmenu', closeContextmenu);
});
// 页面卸载时，移除右键菜单监听事件
onUnmounted(() => {
  document.body.removeEventListener('click', closeContextmenu);
  document.body.addEventListener('contextmenu', closeContextmenu);
});
defineExpose({
  openContextmenu
})
</script>
<script lang="ts">

export default {
  name: "downloadContextMenu"
}
</script>

<style lang="scss" scoped>
.custom-contextmenu {
  transform-origin: center top;
  z-index: 2190;
  position: fixed;

  .el-dropdown-menu__item {
    font-size: 12px !important;
    white-space: nowrap;

    i {
      font-size: 12px !important;
    }
  }

  .el-dropdown-menu__item:hover {
    background-color: var(--el-color-primary-light-9);
  }
}

:deep(.el-divider--horizontal) {
  //margin: 0;
}
</style>