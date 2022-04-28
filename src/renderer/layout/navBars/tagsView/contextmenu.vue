<template>
  <transition name="el-zoom-in-center">
    <div
        v-show="isShow"
        :key="Math.random()"
        :style="`top: ${dropdowns.y + 5}px;left: ${dropdowns.x}px;`"
        aria-hidden="true"
        class="el-dropdown__popper el-popper is-light is-pure custom-contextmenu"
        data-popper-placement="bottom"
        role="tooltip"
    >
      <ul class="el-dropdown-menu">
        <template v-for="(v, k) in dropdownList">
          <li
              v-if="!v.affix && !v.link"
              :key="k"
              aria-disabled="false"
              class="el-dropdown-menu__item"
              tabindex="-1"
              @click="onCurrentContextmenuClick(v.contextMenuClickId)"
          >
            <SvgIcon :name="v.icon"/>
            <span>{{ v.txt }}</span>
          </li>
        </template>
      </ul>
      <div :style="{ left: `${arrowLeft}px` }" class="el-popper__arrow"></div>
    </div>
  </transition>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, onUnmounted, reactive, toRefs, watch} from 'vue';

export default defineComponent({
  name: 'layoutTagsViewContextmenu',
  props: {
    dropdown: {
      type: Object,
      default: () => {
        return {
          x: 0,
          y: 0,
        };
      },
    },
  },
  setup(props, {emit}) {
    const state = reactive({
      isShow: false,
      dropdownList: [
        {contextMenuClickId: 0, txt: '刷新', affix: false, icon: 'ele-RefreshRight', link: false},
        {contextMenuClickId: 1, txt: '关闭', affix: false, icon: 'ele-Close', link: false},
        {contextMenuClickId: 2, txt: '关闭其它', affix: false, icon: 'ele-CircleClose', link: false},
        {contextMenuClickId: 3, txt: '全部关闭', affix: false, icon: 'ele-FolderDelete', link: false},
        {
          contextMenuClickId: 4,
          txt: '当前页全屏',
          affix: false,
          icon: 'iconfont icon-fullscreen',
          link: false
        },

        {contextMenuClickId: 5, txt: '网页中打开', affix: false, icon: 'ele-Cloudy', link: false},
      ],
      item: {},
      arrowLeft: 10,
    });
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
    // 当前项菜单点击
    const onCurrentContextmenuClick = (contextMenuClickId: number) => {
      emit('currentContextmenuClick', Object.assign({}, {contextMenuClickId}, state.item));
    };
    // 打开右键菜单：判断是否固定，固定则不显示关闭按钮
    const openContextmenu = (item: any) => {
      state.item = item;
      item.meta.isAffix ? (state.dropdownList[1].affix = true) : (state.dropdownList[1].affix = false);
      item.meta.isLink ? (state.dropdownList[5].link = false) : (state.dropdownList[5].link = true)
      closeContextmenu();
      setTimeout(() => {
        state.isShow = true;
      }, 10);
    };
    // 关闭右键菜单
    const closeContextmenu = () => {
      state.isShow = false;
    };
    // 监听页面监听进行右键菜单的关闭
    onMounted(() => {
      document.body.addEventListener('click', closeContextmenu);
    });
    // 页面卸载时，移除右键菜单监听事件
    onUnmounted(() => {
      document.body.removeEventListener('click', closeContextmenu);
    });
    // 监听下拉菜单位置
    watch(
        () => props.dropdown,
        ({x}) => {
          if (x + 117 > document.documentElement.clientWidth) state.arrowLeft = 117 - (document.documentElement.clientWidth - x);
          else state.arrowLeft = 10;
        },
        {
          deep: true,
        }
    );
    return {
      dropdowns,
      openContextmenu,
      closeContextmenu,
      onCurrentContextmenuClick,
      ...toRefs(state),
    };
  },
});
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
}
</style>
