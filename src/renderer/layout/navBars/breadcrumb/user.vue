<template>
  <div :style="{ flex: layoutUserFlexNum }" class="layout-navbars-breadcrumb-user">
    <div class="layout-navbars-breadcrumb-user-icon" @click="onSearchClick">
      <el-icon :title="'菜单搜索'">
        <ele-Search/>
      </el-icon>
    </div>
    <div class="layout-navbars-breadcrumb-user-icon" @click="onLayoutSettingClick">
      <i :title="'布局配置'" class="icon-skin iconfont"></i>
    </div>

    <div class="layout-navbars-breadcrumb-user-icon" @click="onReloadClick">
      <svg-icon :title="'刷新'" name="ele-RefreshLeft"></svg-icon>
    </div>
    <div class="layout-navbars-breadcrumb-user-icon">
      <el-popover :width="300" placement="bottom" trigger="click">
        <template #reference>
          <el-badge :is-dot="true">
            <el-icon :title="'消息'">
              <ele-Bell/>
            </el-icon>
          </el-badge>
        </template>
        <UserNews/>
      </el-popover>
    </div>
    <div class="layout-navbars-breadcrumb-user-icon mr10" @click="onScreenfullClick">
      <i
          :class="!state.isScreenfull ? 'icon-fullscreen' : 'icon-tuichuquanping'"
          :title="state.isScreenfull ? '开全屏' : '关全屏'"
          class="iconfont"
      ></i>
    </div>
    <el-dropdown :hide-timeout="50" :show-timeout="70" @command="onHandleCommandClick">
			<span class="layout-navbars-breadcrumb-user-link">
				<img :src="getUserInfos.avatar" alt="" class="layout-navbars-breadcrumb-user-link-photo mr5"/>
				{{ getUserInfos.nickName === '' ? 'common' : getUserInfos.nickName }}
				<el-icon class="el-icon--right">
					<ele-ArrowDown/>
				</el-icon>
			</span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="/personal">
            <SvgIcon name="ele-User"></SvgIcon>
            {{ '个人中心' }}
          </el-dropdown-item>
          <el-dropdown-item command="/message">
            <SvgIcon name="ele-Message"></SvgIcon>
            {{ '通知中心' }}
          </el-dropdown-item>
          <el-dropdown-item command="/security">
            <SvgIcon name="ele-Lock"></SvgIcon>
            {{ '安全中心' }}
          </el-dropdown-item>
          <el-dropdown-item v-if="ipcRenderer" command="/download">
            <SvgIcon name="ele-Download"></SvgIcon>
            {{ '下载中心' }}
          </el-dropdown-item>
          <!--          <el-dropdown-item command="open:https://www.baidu.com">{{ '百度' }}</el-dropdown-item>-->
          <el-dropdown-item command="open:/gitee">
            <SvgIcon name="ele-Link"></SvgIcon>
            {{ '代码仓库' }}
          </el-dropdown-item>
          <!--          <el-dropdown-item command="/404">{{ '404' }}</el-dropdown-item>-->
          <el-dropdown-item command="logOut" divided>
            <SvgIcon name="ele-SwitchButton"></SvgIcon>
            {{ '退出登录' }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <Search ref="searchRef"/>
  </div>
</template>
<script lang="ts" setup>
import {computed, getCurrentInstance, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {useStore} from "@renderer/store";
import {Local, Session} from "@renderer/utils/storage";
import {ElMessage, ElMessageBox} from "element-plus";
import {resetRoute} from "@renderer/router";
import Search from '@renderer/layout/navBars/breadcrumb/search.vue'
import screenfull from 'screenfull';
import UserNews from '@renderer/layout/navBars/breadcrumb/userNews.vue'
import SvgIcon from "@renderer/components/svgIcon/index.vue";

const {ipcRenderer} = window;
const {proxy} = <any>getCurrentInstance();
const router = useRouter();
const store = useStore();
const searchRef = ref();
const state = reactive({
  isScreenfull: false,
  disabledI18n: 'zh-cn',
  disabledSize: 'large',
});

// 获取用户信息 vuex
const getUserInfos = computed(() => {
  return <any>store.state.userInfos.userInfos;
});
// 获取布局配置信息
const getThemeConfig = computed(() => {
  return store.state.themeConfig.themeConfig;
});
// 设置分割样式
const layoutUserFlexNum = computed(() => {
  let num: string | number = '';
  const {layout, isClassicSplitMenu} = getThemeConfig.value;
  const layoutArr: string[] = ['defaults', 'columns'];
  if (layoutArr.includes(layout) || (layout === 'classic' && !isClassicSplitMenu)) num = '1';
  else num = '';
  return num;
});
const onReloadClick = () => {
  window.location.reload()
}
// 布局配置 icon 点击时
const onLayoutSettingClick = () => {
  proxy.mittBus.emit('openSettingsDrawer');
};
// 下拉菜单点击时
const onHandleCommandClick = (path: string) => {
  if (path === 'logOut') {
    ElMessageBox({
      closeOnClickModal: false,
      closeOnPressEscape: false,
      title: '提示',
      message: '此操作将退出登录, 是否继续?',
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      buttonSize: 'default',
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true;
          instance.confirmButtonText = '退出中';
          setTimeout(() => {
            done();
            setTimeout(() => {
              instance.confirmButtonLoading = false;
            }, 300);
          }, 700);
        } else {
          done();
        }
      },
    })
        .then(async () => {
          Session.clear(); // 清除缓存/token等
          Local.remove('Authentication')
          await resetRoute(); // 删除/重置路由
          ElMessage.success('安全退出成功！');
          setTimeout(() => {
            window.location.href = ''; // 去登录页
          }, 500);
        })
        .catch(() => {
        });
  } else if (path.startsWith('open:')) {
    let strings = path.split('open:');
    let url: any = strings[1]
    if (url.startsWith('/')) {
      console.log(url)
      //客户端内链。 浏览器外链。
      let routes = router.getRoutes().filter(i => i.path === url)
      if (routes && routes.length > 0) {
        if (ipcRenderer) {
          router.push(url);
        } else {
          let url: any = routes[0].meta.isLink
          window.open(url)
        }
      }
    } else {
      console.log(url)
      //外链
      if (ipcRenderer) {
        ipcRenderer.invoke('open-web', url);
      } else {
        window.open(url)
      }
    }
  } else {
    router.push(path);
  }
};
// 菜单搜索点击
const onSearchClick = () => {
  searchRef.value.openSearch();
};
// 全屏点击时
const onScreenfullClick = () => {
  if (!screenfull.isEnabled) {
    ElMessage.warning('暂不不支持全屏');
    return false;
  }
  screenfull.toggle();
  screenfull.on('change', () => {
    state.isScreenfull = screenfull.isFullscreen;
  });
};
</script>
<script lang="ts">
export default {
  name: "layoutBreadcrumbUser"
}
</script>


<style lang="scss" scoped>
.layout-navbars-breadcrumb-user {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  &-link {
    height: 100%;
    display: flex;
    align-items: center;
    white-space: nowrap;

    &-photo {
      width: 25px;
      height: 25px;
      border-radius: 100%;
    }
  }

  &-icon {
    padding: 0 10px;
    cursor: pointer;
    color: var(--next-bg-topBarColor);
    height: 50px;
    line-height: 50px;
    display: flex;
    align-items: center;

    &:hover {
      background: var(--next-color-user-hover);

      i {
        display: inline-block;
        animation: logoAnimation 0.3s ease-in-out;
      }
    }
  }

  ::v-deep(.el-dropdown) {
    color: var(--next-bg-topBarColor);
  }

  ::v-deep(.el-badge) {
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
  }

  ::v-deep(.el-badge__content.is-fixed) {
    top: 12px;
  }
}
</style>