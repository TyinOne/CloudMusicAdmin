<template>
  <div :style="{ flex: layoutUserFlexNum }" class="layout-navbars-breadcrumb-user">
    <div class="layout-navbars-breadcrumb-user-icon" @click="onSearchClick">
      <SvgIcon name="ele-Search" title="搜索"></SvgIcon>
    </div>
    <div v-if="ipcRenderer" class="layout-navbars-breadcrumb-user-icon" @click="onDownloadClick">
      <SvgIcon :title="'下载'" name="bi-download"></SvgIcon>
    </div>

    <div class="layout-navbars-breadcrumb-user-icon" @click="onReloadClick">
      <SvgIcon :title="'刷新'" name="ele-RefreshLeft"></SvgIcon>
    </div>
    <div class="layout-navbars-breadcrumb-user-icon">
      <el-popover :width="300" placement="bottom" trigger="click">
        <template #reference>
          <el-badge :is-dot="false">
            <el-icon :title="'消息'">
              <ele-Bell/>
            </el-icon>
          </el-badge>
        </template>
        <UserNews/>
      </el-popover>
    </div>
    <div class="layout-navbars-breadcrumb-user-icon mr10" @click="onScreenfullClick">
      <SvgIcon
          :name="!state.isScreenfull ? 'ele-FullScreen' : 'ele-FullScreen'"
          :title="state.isScreenfull ? '开全屏' : '关全屏'"
      ></SvgIcon>
    </div>
    <el-dropdown :hide-timeout="50" :show-timeout="70" @command="onHandleCommandClick">
			<span class="layout-navbars-breadcrumb-user-link">
				<img :src="getUserInfos.avatar" alt="" class="layout-navbars-breadcrumb-user-link-photo mr5"/>
				{{ getUserInfos.nickName === '' ? 'common' : getUserInfos.nickName }}
        <SvgIcon class="el-icon--right" name="ele-ArrowDown"></SvgIcon>
			</span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="/message">
            <SvgIcon name="fa-bell-o fa"></SvgIcon>
            {{ '通知' }}
          </el-dropdown-item>
          <el-dropdown-item command="/security">
            <SvgIcon name="fa-fingerprint fa"></SvgIcon>
            {{ '安全' }}
          </el-dropdown-item>
          <el-dropdown-item command="/setting">
            <SvgIcon name="fa-gear fa"></SvgIcon>
            {{ '设置' }}
          </el-dropdown-item>
          <!--          <el-dropdown-item command="open:https://www.baidu.com">{{ '百度' }}</el-dropdown-item>-->
          <el-dropdown-item command="open:/github">
            <SvgIcon name="bi-github"></SvgIcon>
            {{ '仓库' }}
          </el-dropdown-item>
          <!--          <el-dropdown-item command="/404">{{ '404' }}</el-dropdown-item>-->
          <el-dropdown-item command="/personal" divided>
            <SvgIcon name="fa-user-o fa"></SvgIcon>
            {{ '个人中心' }}
          </el-dropdown-item>
          <el-dropdown-item command="logOut">
            <SvgIcon name="fa-power-off fa"></SvgIcon>
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
import {useUserApi} from "@renderer/api/user";

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
// 下载中心 download 点击时
const onDownloadClick = () => {
  proxy.mittBus.emit('openDownloadDrawer');
};
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
      beforeClose: async (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true;
          instance.confirmButtonText = '退出中';
          await useUserApi().logout()
          setTimeout(() => {
            instance.confirmButtonLoading = false;
            done();
          }, 700)
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
      //客户端内链。 浏览器外链。 github 除外
      let routes = router.getRoutes().filter(i => i.path === url)
      if (url.startsWith("/git")) {
        if (routes && routes.length > 0) {
          let url: any = routes[0].meta.isLink
          ipcRenderer.invoke('openWeb', url);
        } else {
          routes.push("/404")
        }
      } else {
        if (routes && routes.length > 0) {
          if (ipcRenderer) {
            router.push(url);
          } else {
            let url: any = routes[0].meta.isLink
            window.open(url)
          }
        }
      }
    } else {
      //醇正的外链， 无配置
      if (ipcRenderer) {
        ipcRenderer.invoke('openWeb', url);
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