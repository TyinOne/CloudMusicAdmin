<template>
  <div class="system-setting-container">
    <el-card shadow="hover">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="基础设置" name="basic"/>
        <el-tab-pane label="主题设置" name="theme"/>
        <el-tab-pane label="下载设置" name="download"/>
        <el-tab-pane label="关于" name="about"/>
      </el-tabs>
      <el-scrollbar ref="scrollbarRef" style="height: calc(100vh - 240px);width: 100%" @scroll="changePane">
        <div :ref="refs.basic" class="setting-item">
          <p class="item-title">基础设置</p>
        </div>
        <div :ref="refs.theme" class="setting-item">
          <p class="item-title">主题设置</p>
          <div class="setting-bar">
            <!-- 全局主题 -->
            <el-divider content-position="left">{{ '全局主题' }}</el-divider>
            <div class="setting-bar-flex">
              <div class="setting-bar-flex-label">primary</div>
              <div class="setting-bar-flex-value">
                <el-color-picker v-model="getThemeConfig.primary" size="default"
                                 @change="onColorPickerChange"></el-color-picker>
              </div>
            </div>
            <div class="setting-bar-flex mt15">
              <div class="setting-bar-flex-label">{{ '深色模式' }}</div>
              <div class="setting-bar-flex-value">
                <el-switch v-model="getThemeConfig.isIsDark" size="small" @change="onAddDarkChange"></el-switch>
              </div>
            </div>

            <!-- 顶栏设置 -->
            <el-divider content-position="left">{{ '顶栏设置' }}</el-divider>
            <div class="setting-bar-flex">
              <div class="setting-bar-flex-label">{{ '顶栏背景' }}</div>
              <div class="setting-bar-flex-value">
                <el-color-picker v-model="getThemeConfig.topBar" size="default"
                                 @change="onBgColorPickerChange('topBar')"></el-color-picker>
              </div>
            </div>
            <div class="setting-bar-flex">
              <div class="setting-bar-flex-label">{{ '顶栏默认字体颜色' }}</div>
              <div class="setting-bar-flex-value">
                <el-color-picker v-model="getThemeConfig.topBarColor" size="default"
                                 @change="onBgColorPickerChange('topBarColor')"></el-color-picker>
              </div>
            </div>
            <div class="setting-bar-flex mt10">
              <div class="setting-bar-flex-label">{{ '顶栏背景渐变' }}</div>
              <div class="setting-bar-flex-value">
                <el-switch v-model="getThemeConfig.isTopBarColorGradual" size="small"
                           @change="onTopBarGradualChange"></el-switch>
              </div>
            </div>

            <!-- 菜单设置 -->
            <el-divider content-position="left">{{ '菜单设置' }}</el-divider>
            <div class="setting-bar-flex">
              <div class="setting-bar-flex-label">{{ '菜单背景' }}</div>
              <div class="setting-bar-flex-value">
                <el-color-picker v-model="getThemeConfig.menuBar" size="default"
                                 @change="onBgColorPickerChange('menuBar')"></el-color-picker>
              </div>
            </div>
            <div class="setting-bar-flex">
              <div class="setting-bar-flex-label">{{ '菜单默认字体颜色' }}</div>
              <div class="setting-bar-flex-value">
                <el-color-picker v-model="getThemeConfig.menuBarColor" size="default"
                                 @change="onBgColorPickerChange('menuBarColor')"></el-color-picker>
              </div>
            </div>
            <div class="setting-bar-flex mt14">
              <div class="setting-bar-flex-label">{{ '菜单背景渐变' }}</div>
              <div class="setting-bar-flex-value">
                <el-switch v-model="getThemeConfig.isMenuBarColorGradual" size="small"
                           @change="onMenuBarGradualChange"></el-switch>
              </div>
            </div>

            <!-- 分栏设置 -->
            <el-divider :style="{ opacity: getThemeConfig.layout !== 'columns' ? 0.5 : 1 }" content-position="left">{{
                '分栏设置'
              }}
            </el-divider>
            <div :style="{ opacity: getThemeConfig.layout !== 'columns' ? 0.5 : 1 }"
                 class="setting-bar-flex">
              <div class="setting-bar-flex-label">{{ '分栏菜单背景' }}</div>
              <div class="setting-bar-flex-value">
                <el-color-picker
                    v-model="getThemeConfig.columnsMenuBar"
                    :disabled="getThemeConfig.layout !== 'columns'"
                    size="default"
                    @change="onBgColorPickerChange('columnsMenuBar')"
                >
                </el-color-picker>
              </div>
            </div>
            <div :style="{ opacity: getThemeConfig.layout !== 'columns' ? 0.5 : 1 }"
                 class="setting-bar-flex">
              <div class="setting-bar-flex-label">{{ '分栏菜单默认字体颜色' }}</div>
              <div class="setting-bar-flex-value">
                <el-color-picker
                    v-model="getThemeConfig.columnsMenuBarColor"
                    :disabled="getThemeConfig.layout !== 'columns'"
                    size="default"
                    @change="onBgColorPickerChange('columnsMenuBarColor')"
                >
                </el-color-picker>
              </div>
            </div>
            <div :style="{ opacity: getThemeConfig.layout !== 'columns' ? 0.5 : 1 }"
                 class="setting-bar-flex mt14">
              <div class="setting-bar-flex-label">{{
                  '分栏菜单背景渐变'
                }}
              </div>
              <div class="setting-bar-flex-value">
                <el-switch
                    v-model="getThemeConfig.isColumnsMenuBarColorGradual"
                    :disabled="getThemeConfig.layout !== 'columns'"
                    size="small"
                    @change="onColumnsMenuBarGradualChange"
                ></el-switch>
              </div>
            </div>

            <!-- 界面设置 -->
            <el-divider content-position="left">{{ '界面设置' }}</el-divider>
            <div class="setting-bar-flex">
              <div class="setting-bar-flex-label">{{ '菜单水平折叠' }}</div>
              <div class="setting-bar-flex-value">
                <el-switch v-model="getThemeConfig.isCollapse" size="small" @change="onThemeConfigChange"></el-switch>
              </div>
            </div>
            <div class="setting-bar-flex mt15">
              <div class="setting-bar-flex-label">{{ '菜单手风琴' }}</div>
              <div class="setting-bar-flex-value">
                <el-switch v-model="getThemeConfig.isUniqueOpened" size="small"
                           @change="setLocalThemeConfig"></el-switch>
              </div>
            </div>
            <div class="setting-bar-flex mt15">
              <div class="setting-bar-flex-label">{{ '固定 Header' }}</div>
              <div class="setting-bar-flex-value">
                <el-switch v-model="getThemeConfig.isFixedHeader" size="small"
                           @change="onIsFixedHeaderChange"></el-switch>
              </div>
            </div>
            <div :style="{ opacity: getThemeConfig.layout !== 'classic' ? 0.5 : 1 }"
                 class="setting-bar-flex mt15">
              <div class="setting-bar-flex-label">{{ '经典布局分割菜单' }}</div>
              <div class="setting-bar-flex-value">
                <el-switch
                    v-model="getThemeConfig.isClassicSplitMenu"
                    :disabled="getThemeConfig.layout !== 'classic'"
                    size="small"
                    @change="onClassicSplitMenuChange"
                >
                </el-switch>
              </div>
            </div>
            <div class="setting-bar-flex mt15">
              <div class="setting-bar-flex-label">{{ '开启锁屏' }}</div>
              <div class="setting-bar-flex-value">
                <el-switch v-model="getThemeConfig.isLockScreen" size="small" @change="setLocalThemeConfig"></el-switch>
              </div>
            </div>
            <div class="setting-bar-flex mt11">
              <div class="setting-bar-flex-label">{{ '自动锁屏(s/秒)' }}</div>
              <div class="setting-bar-flex-value">
                <el-input-number
                    v-model="getThemeConfig.lockScreenTime"
                    :max="9999"
                    :min="1"
                    controls-position="right"
                    size="default"
                    style="width: 90px"
                    @change="setLocalThemeConfig"
                >
                </el-input-number>
              </div>
            </div>

            <!-- 界面显示 -->
            <el-divider content-position="left">{{ '界面显示' }}</el-divider>
            <div class="setting-bar-flex mt15">
              <div class="setting-bar-flex-label">{{ '侧边栏 Logo' }}</div>
              <div class="setting-bar-flex-value">
                <el-switch v-model="getThemeConfig.isShowLogo" size="small" @change="onIsShowLogoChange"></el-switch>
              </div>
            </div>
            <div
                :style="{ opacity: getThemeConfig.layout === 'classic' || getThemeConfig.layout === 'transverse' ? 0.5 : 1 }"
                class="setting-bar-flex mt15"
            >
              <div class="setting-bar-flex-label">{{ '开启 Breadcrumb' }}</div>
              <div class="setting-bar-flex-value">
                <el-switch
                    v-model="getThemeConfig.isBreadcrumb"
                    :disabled="getThemeConfig.layout === 'classic' || getThemeConfig.layout === 'transverse'"
                    size="small"
                    @change="onIsBreadcrumbChange"
                ></el-switch>
              </div>
            </div>
            <div class="setting-bar-flex mt15">
              <div class="setting-bar-flex-label">{{ '开启 Breadcrumb 图标' }}</div>
              <div class="setting-bar-flex-value">
                <el-switch v-model="getThemeConfig.isBreadcrumbIcon" size="small"
                           @change="setLocalThemeConfig"></el-switch>
              </div>
            </div>
            <div class="setting-bar-flex mt15">
              <div class="setting-bar-flex-label">{{ 'fourIsTagsview' }}</div>
              <div class="setting-bar-flex-value">
                <el-switch v-model="getThemeConfig.isTagsview" size="small" @change="setLocalThemeConfig"></el-switch>
              </div>
            </div>
            <div class="setting-bar-flex mt15">
              <div class="setting-bar-flex-label">{{ '开启 Tagsview 图标' }}</div>
              <div class="setting-bar-flex-value">
                <el-switch v-model="getThemeConfig.isTagsviewIcon" size="small"
                           @change="setLocalThemeConfig"></el-switch>
              </div>
            </div>
            <div class="setting-bar-flex mt15">
              <div class="setting-bar-flex-label">{{ '开启 TagsView 缓存' }}</div>
              <div class="setting-bar-flex-value">
                <el-switch v-model="getThemeConfig.isCacheTagsView" size="small"
                           @change="setLocalThemeConfig"></el-switch>
              </div>
            </div>
            <div :style="{ opacity: state.isMobile ? 0.5 : 1 }" class="setting-bar-flex mt15">
              <div class="setting-bar-flex-label">{{ '开启 TagsView 拖拽' }}</div>
              <div class="setting-bar-flex-value">
                <el-switch
                    v-model="getThemeConfig.isSortableTagsView"
                    :disabled="!!state.isMobile"
                    size="small"
                    @change="onSortableTagsViewChange"
                ></el-switch>
              </div>
            </div>
            <div class="setting-bar-flex mt15">
              <div class="setting-bar-flex-label">{{ '开启 TagsView 共用' }}</div>
              <div class="setting-bar-flex-value">
                <el-switch v-model="getThemeConfig.isShareTagsView" size="small"
                           @change="onShareTagsViewChange"></el-switch>
              </div>
            </div>
            <div class="setting-bar-flex mt15">
              <div class="setting-bar-flex-label">{{ '开启 Footer' }}</div>
              <div class="setting-bar-flex-value">
                <el-switch v-model="getThemeConfig.isFooter" size="small" @change="setLocalThemeConfig"></el-switch>
              </div>
            </div>
            <div class="setting-bar-flex mt15">
              <div class="setting-bar-flex-label">{{ '灰色模式' }}</div>
              <div class="setting-bar-flex-value">
                <el-switch v-model="getThemeConfig.isGrayscale" size="small"
                           @change="onAddFilterChange('grayscale')"></el-switch>
              </div>
            </div>
            <div class="setting-bar-flex mt15">
              <div class="setting-bar-flex-label">{{ '色弱模式' }}</div>
              <div class="setting-bar-flex-value">
                <el-switch v-model="getThemeConfig.isInvert" size="small"
                           @change="onAddFilterChange('invert')"></el-switch>
              </div>
            </div>
            <div class="setting-bar-flex mt15">
              <div class="setting-bar-flex-label">{{ '开启水印' }}</div>
              <div class="setting-bar-flex-value">
                <el-switch v-model="getThemeConfig.isWartermark" size="small" @change="onWartermarkChange"></el-switch>
              </div>
            </div>
            <div class="setting-bar-flex mt14">
              <div class="setting-bar-flex-label">{{ '水印文案' }}</div>
              <div class="setting-bar-flex-value">
                <el-input v-model="getThemeConfig.wartermarkText" size="default" style="width: 90px"
                          @input="onWartermarkTextInput($event)"></el-input>
              </div>
            </div>

            <!-- 其它设置 -->
            <el-divider content-position="left">{{ '其他设置' }}</el-divider>
            <div class="setting-bar-flex mt15">
              <div class="setting-bar-flex-label">{{ 'Tagsview 风格' }}</div>
              <div class="setting-bar-flex-value">
                <el-select v-model="getThemeConfig.tagsStyle" placeholder="请选择" size="default" style="width: 90px"
                           @change="setLocalThemeConfig">
                  <el-option label="风格1" value="tags-style-one"></el-option>
                  <el-option label="风格4" value="tags-style-four"></el-option>
                  <el-option label="风格5" value="tags-style-five"></el-option>
                </el-select>
              </div>
            </div>
            <div class="setting-bar-flex mt15">
              <div class="setting-bar-flex-label">{{ '主页面切换动画' }}</div>
              <div class="setting-bar-flex-value">
                <el-select v-model="getThemeConfig.animation" placeholder="请选择" size="default" style="width: 90px"
                           @change="setLocalThemeConfig">
                  <el-option label="slide-right" value="slide-right"></el-option>
                  <el-option label="slide-left" value="slide-left"></el-option>
                  <el-option label="opacitys" value="opacitys"></el-option>
                </el-select>
              </div>
            </div>
            <div :style="{ opacity: getThemeConfig.layout !== 'columns' ? 0.5 : 1 }"
                 class="setting-bar-flex mt15">
              <div class="setting-bar-flex-label">{{ '分栏高亮风格' }}</div>
              <div class="setting-bar-flex-value">
                <el-select
                    v-model="getThemeConfig.columnsAsideStyle"
                    :disabled="getThemeConfig.layout !== 'columns'"
                    placeholder="请选择"
                    size="default"
                    style="width: 90px"
                    @change="setLocalThemeConfig"
                >
                  <el-option label="圆角" value="columns-round"></el-option>
                  <el-option label="卡片" value="columns-card"></el-option>
                </el-select>
              </div>
            </div>
            <div :style="{ opacity: getThemeConfig.layout !== 'columns' ? 0.5 : 1 }"
                 class="setting-bar-flex mt15 mb27">
              <div class="setting-bar-flex-label">{{ '分栏布局风格' }}</div>
              <div class="setting-bar-flex-value">
                <el-select
                    v-model="getThemeConfig.columnsAsideLayout"
                    :disabled="getThemeConfig.layout !== 'columns'"
                    placeholder="请选择"
                    size="default"
                    style="width: 90px"
                    @change="setLocalThemeConfig"
                >
                  <el-option label="水平" value="columns-horizontal"></el-option>
                  <el-option label="垂直" value="columns-vertical"></el-option>
                </el-select>
              </div>
            </div>

            <!-- 布局切换 -->
            <el-divider content-position="left">{{ '布局切换' }}</el-divider>
            <div class="layout-drawer-content-flex">
              <!-- defaults 布局 -->
              <div class="layout-drawer-content-item" @click="onSetLayout('defaults')">
                <section :class="{ 'drawer-layout-active': getThemeConfig.layout === 'defaults' }"
                         class="el-container el-circular">
                  <aside class="el-aside" style="width: 20px"></aside>
                  <section class="el-container is-vertical">
                    <header class="el-header" style="height: 10px"></header>
                    <main class="el-main"></main>
                  </section>
                </section>
                <div :class="{ 'layout-tips-warp-active': getThemeConfig.layout === 'defaults' }"
                     class="layout-tips-warp">
                  <div class="layout-tips-box">
                    <p class="layout-tips-txt">{{ '默认' }}</p>
                  </div>
                </div>
              </div>
              <!-- classic 布局 -->
              <div class="layout-drawer-content-item" @click="onSetLayout('classic')">
                <section :class="{ 'drawer-layout-active': getThemeConfig.layout === 'classic' }"
                         class="el-container is-vertical el-circular">
                  <header class="el-header" style="height: 10px"></header>
                  <section class="el-container">
                    <aside class="el-aside" style="width: 20px"></aside>
                    <section class="el-container is-vertical">
                      <main class="el-main"></main>
                    </section>
                  </section>
                </section>
                <div :class="{ 'layout-tips-warp-active': getThemeConfig.layout === 'classic' }"
                     class="layout-tips-warp">
                  <div class="layout-tips-box">
                    <p class="layout-tips-txt">{{ '经典' }}</p>
                  </div>
                </div>
              </div>
              <!-- transverse 布局 -->
              <div class="layout-drawer-content-item" @click="onSetLayout('transverse')">
                <section :class="{ 'drawer-layout-active': getThemeConfig.layout === 'transverse' }"
                         class="el-container is-vertical el-circular">
                  <header class="el-header" style="height: 10px"></header>
                  <section class="el-container">
                    <section class="el-container is-vertical">
                      <main class="el-main"></main>
                    </section>
                  </section>
                </section>
                <div :class="{ 'layout-tips-warp-active': getThemeConfig.layout === 'transverse' }"
                     class="layout-tips-warp">
                  <div class="layout-tips-box">
                    <p class="layout-tips-txt">{{ '横向' }}</p>
                  </div>
                </div>
              </div>
              <!-- columns 布局 -->
              <div class="layout-drawer-content-item" @click="onSetLayout('columns')">
                <section :class="{ 'drawer-layout-active': getThemeConfig.layout === 'columns' }"
                         class="el-container el-circular">
                  <aside class="el-aside-dark" style="width: 10px"></aside>
                  <aside class="el-aside" style="width: 20px"></aside>
                  <section class="el-container is-vertical">
                    <header class="el-header" style="height: 10px"></header>
                    <main class="el-main"></main>
                  </section>
                </section>
                <div :class="{ 'layout-tips-warp-active': getThemeConfig.layout === 'columns' }"
                     class="layout-tips-warp">
                  <div class="layout-tips-box">
                    <p class="layout-tips-txt">{{ '分栏' }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="copy-config">
              <el-alert :closable="false" :title="'点击下方按钮，复制布局配置去 `src/store/modules/themeConfig.ts` 中修改。'"
                        type="warning"></el-alert>
              <el-button ref="copyConfigBtnRef" class="copy-config-btn" size="default" type="primary"
                         @click="onCopyConfigClick">
                <SvgIcon name="ele-CopyDocument"></SvgIcon>
                {{ '一键复制配置' }}
              </el-button>
              <el-button class="copy-config-btn-reset" size="default" type="info" @click="onResetConfigClick">
                <SvgIcon name="ele-RefreshRight"></SvgIcon>
                {{ '一键恢复默认' }}
              </el-button>
            </div>
          </div>
        </div>
        <div :ref="refs.download" class="setting-item">
          <p class="item-title">下载设置</p>
          <div class="setting-bar">
            <el-divider content-position="left">{{ '下载目录' }}</el-divider>
            <div class="setting-bar-flex">
              下载目录：
              <el-input v-model="oldPath" readonly style="width: 400px">
                <template #append>
                  <el-button @click="selectFolder">
                    <SvgIcon name="ele-Folder"/>
                  </el-button>
                </template>
              </el-input>
            </div>
            <div class="setting-bar-flex">
              <!--              <el-radio/>自动修改上次使用的目录-->
            </div>
          </div>
        </div>
        <div :ref="refs.about" class="setting-item">
          <p class="item-title">关于</p>
        </div>
      </el-scrollbar>
    </el-card>
  </div>
</template>
<script lang="ts" name="downloadIndex" setup>
import {computed, getCurrentInstance, nextTick, onMounted, onUnmounted, reactive, ref} from "vue";
import {ElScrollbar} from "element-plus";
import {useStore} from "@renderer/store";
import commonFunction from "@renderer/utils/commonFunction";
import {getDarkColor, getLightColor} from "@renderer/utils/theme";
import Watermark from "@renderer/utils/wartermark";
import {verifyAndSpace} from "@renderer/utils/toolsValidate";
import {Local} from "@renderer/utils/storage";
import other from "@renderer/utils/other";
import SvgIcon from "@renderer/components/svgIcon/index.vue";

const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const activeName = ref('basic')
const refs = {
  basic: ref(),
  theme: ref(),
  download: ref(),
  about: ref(),
}
const handleClick = (p) => {
  scrollbarRef.value!.setScrollTop(refs[p.props.name].value.offsetTop)
}
const changePane = ({scrollTop}) => {
  if (scrollTop < 300) {
    if (activeName.value !== 'basic') activeName.value = 'basic'
  } else if (scrollTop >= 300 && scrollTop < 2284) {
    if (activeName.value !== 'theme') activeName.value = 'theme'
  } else if (scrollTop >= 2284 && scrollTop < 2384) {
    if (activeName.value !== 'download') activeName.value = 'download'
  } else {
    if (activeName.value !== 'about') activeName.value = 'about'
  }
}
const {proxy} = <any>getCurrentInstance();
const store = useStore();
const {copyText} = commonFunction();
const state = reactive({
  isMobile: false,
});
// 获取布局配置信息
const getThemeConfig = computed(() => {
  return store.state.themeConfig.themeConfig;
});
// 1、全局主题
const onColorPickerChange = () => {
  // 颜色加深
  document.documentElement.style.setProperty('--el-color-primary-dark-2', `${getDarkColor(getThemeConfig.value.primary, 0.1)}`);
  document.documentElement.style.setProperty('--el-color-primary', getThemeConfig.value.primary);
  // 颜色变浅
  for (let i = 1; i <= 9; i++) {
    document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, `${getLightColor(getThemeConfig.value.primary, i / 10)}`);
  }
  setDispatchThemeConfig();
};
// 2、菜单 / 顶栏
const onBgColorPickerChange = (bg: string) => {
  document.documentElement.style.setProperty(`--next-bg-${bg}`, (<any>getThemeConfig.value)[bg]);
  onTopBarGradualChange();
  onMenuBarGradualChange();
  onColumnsMenuBarGradualChange();
  setDispatchThemeConfig();
};
// 2、菜单 / 顶栏 --> 顶栏背景渐变
const onTopBarGradualChange = () => {
  setGraduaFun('.layout-navbars-breadcrumb-index', getThemeConfig.value.isTopBarColorGradual, getThemeConfig.value.topBar);
};
// 2、菜单 / 顶栏 --> 菜单背景渐变
const onMenuBarGradualChange = () => {
  setGraduaFun('.layout-container .el-aside', getThemeConfig.value.isMenuBarColorGradual, getThemeConfig.value.menuBar);
};
// 2、菜单 / 顶栏 --> 分栏菜单背景渐变
const onColumnsMenuBarGradualChange = () => {
  setGraduaFun('.layout-container .layout-columns-aside', getThemeConfig.value.isColumnsMenuBarColorGradual, getThemeConfig.value.columnsMenuBar);
};
// 2、菜单 / 顶栏 --> 背景渐变函数
const setGraduaFun = (el: string, bool: boolean, color: string) => {
  setTimeout(() => {
    let els = document.querySelector(el);
    if (!els) return false;
    document.documentElement.style.setProperty('--el-menu-bg-color', document.documentElement.style.getPropertyValue('--next-bg-menuBar'));
    if (bool) els.setAttribute('style', `background:linear-gradient(to bottom left , ${color}, ${getLightColor(color, 0.6)}) !important;`);
    else els.setAttribute('style', ``);
    setLocalThemeConfig();
  }, 200);
};
// 3、界面设置 --> 菜单水平折叠
const onThemeConfigChange = () => {
  setDispatchThemeConfig();
};
// 3、界面设置 --> 固定 Header
const onIsFixedHeaderChange = () => {
  getThemeConfig.value.isFixedHeaderChange = !getThemeConfig.value.isFixedHeader;
  setLocalThemeConfig();
};
// 3、界面设置 --> 经典布局分割菜单
const onClassicSplitMenuChange = () => {
  getThemeConfig.value.isBreadcrumb = false;
  setLocalThemeConfig();
  proxy.mittBus.emit('getBreadcrumbIndexSetFilterRoutes');
};
// 4、界面显示 --> 侧边栏 Logo
const onIsShowLogoChange = () => {
  getThemeConfig.value.isShowLogoChange = !getThemeConfig.value.isShowLogo;
  setLocalThemeConfig();
};
// 4、界面显示 --> 面包屑 Breadcrumb
const onIsBreadcrumbChange = () => {
  if (getThemeConfig.value.layout === 'classic') {
    getThemeConfig.value.isClassicSplitMenu = false;
  }
  setLocalThemeConfig();
};
// 4、界面显示 --> 开启 TagsView 拖拽
const onSortableTagsViewChange = () => {
  proxy.mittBus.emit('openOrCloseSortable');
  setLocalThemeConfig();
};
// 4、界面显示 --> 开启 TagsView 共用
const onShareTagsViewChange = () => {
  proxy.mittBus.emit('openShareTagsView');
  setLocalThemeConfig();
};
// 4、界面显示 --> 灰色模式/色弱模式
const onAddFilterChange = (attr: string) => {
  if (attr === 'grayscale') {
    if (getThemeConfig.value.isGrayscale) getThemeConfig.value.isInvert = false;
  } else {
    if (getThemeConfig.value.isInvert) getThemeConfig.value.isGrayscale = false;
  }
  const cssAttr =
      attr === 'grayscale' ? `grayscale(${getThemeConfig.value.isGrayscale ? 1 : 0})` : `invert(${getThemeConfig.value.isInvert ? '80%' : '0%'})`;
  const appEle: any = document.body;
  appEle.setAttribute('style', `filter: ${cssAttr}`);
  setLocalThemeConfig();
};
// 4、界面显示 --> 深色模式
const onAddDarkChange = () => {
  const body = document.documentElement as HTMLElement;
  if (getThemeConfig.value.isIsDark) body.setAttribute('data-theme', 'dark');
  else body.setAttribute('data-theme', '');
};
// 4、界面显示 --> 开启水印
const onWartermarkChange = () => {
  getThemeConfig.value.isWartermark ? Watermark.set(getThemeConfig.value.wartermarkText) : Watermark.del();
  setLocalThemeConfig();
};
// 4、界面显示 --> 水印文案
const onWartermarkTextInput = (val: any) => {
  getThemeConfig.value.wartermarkText = verifyAndSpace(val);
  if (getThemeConfig.value.wartermarkText === '') return false;
  if (getThemeConfig.value.isWartermark) Watermark.set(getThemeConfig.value.wartermarkText);
  setLocalThemeConfig();
};
// 5、布局切换
const onSetLayout = (layout: string) => {
  Local.set('oldLayout', layout);
  if (getThemeConfig.value.layout === layout) return false;
  getThemeConfig.value.layout = layout;
  getThemeConfig.value.isDrawer = false;
  initLayoutChangeFun();
};
// 设置布局切换函数
const initLayoutChangeFun = () => {
  onBgColorPickerChange('menuBar');
  onBgColorPickerChange('menuBarColor');
  onBgColorPickerChange('topBar');
  onBgColorPickerChange('topBarColor');
  onBgColorPickerChange('columnsMenuBar');
  onBgColorPickerChange('columnsMenuBarColor');
};
// 触发 store 布局配置更新
const setDispatchThemeConfig = () => {
  setLocalThemeConfig();
  setLocalThemeConfigStyle();
};
// 存储布局配置
const setLocalThemeConfig = () => {
  Local.remove('themeConfig');
  Local.set('themeConfig', getThemeConfig.value);
};
// 存储布局配置全局主题样式（html根标签）
const setLocalThemeConfigStyle = () => {
  Local.set('themeConfigStyle', document.documentElement.style.cssText);
};
// 一键复制配置
const onCopyConfigClick = () => {
  let copyThemeConfig = Local.get('themeConfig');
  copyThemeConfig.isDrawer = false;
  copyText(JSON.stringify(copyThemeConfig)).then(() => {
    getThemeConfig.value.isDrawer = false;
  });
};
// 一键恢复默认
const onResetConfigClick = () => {
  Local.clear();
  window.location.reload();
};
// 初始化菜单样式等
const initSetStyle = () => {
  // 2、菜单 / 顶栏 --> 顶栏背景渐变
  onTopBarGradualChange();
  // 2、菜单 / 顶栏 --> 菜单背景渐变
  onMenuBarGradualChange();
  // 2、菜单 / 顶栏 --> 分栏菜单背景渐变
  onColumnsMenuBarGradualChange();
};

/** 下载设置 */
let {ipcRenderer} = window;
let oldPath = ref('')
const getDownloadPath = () => {
  ipcRenderer.invoke('getDownloadConfig').then(res => {
    oldPath.value = res.path
  })
}
const selectFolder = async () => {
  //openFileDialog
  oldPath.value = await ipcRenderer.invoke('openFileDialog', oldPath.value)
}

onMounted(() => {
  nextTick(() => {
    // 判断当前布局是否不相同，不相同则初始化当前布局的样式，防止监听窗口大小改变时，布局配置logo、菜单背景等部分布局失效问题
    if (!Local.get('frequency')) initLayoutChangeFun();
    Local.set('frequency', 1);
    // 监听窗口大小改变，非默认布局，设置成默认布局（适配移动端）
    proxy.mittBus.on('layoutMobileResize', (res: any) => {
      getThemeConfig.value.layout = res.layout;
      getThemeConfig.value.isDrawer = false;
      initLayoutChangeFun();
      state.isMobile = other.isMobile();
    });
    setTimeout(() => {
      // 灰色模式
      if (getThemeConfig.value.isGrayscale) onAddFilterChange('grayscale');
      // 色弱模式
      if (getThemeConfig.value.isInvert) onAddFilterChange('invert');
      // 深色模式
      if (getThemeConfig.value.isIsDark) onAddDarkChange();
      // 开启水印
      onWartermarkChange();
      // 初始化菜单样式等
      initSetStyle();
      // 下载配置
      getDownloadPath();
    }, 100);
  });
});
onUnmounted(() => {
  proxy.mittBus.off('layoutMobileResize');
});
</script>

<style lang="scss" scoped>
.setting-item {
  width: 100%;
  min-height: 300px;
}

.item-title {
  font-size: 16px;
  font-weight: bold;
}

.setting-bar {
  padding: 0 15px;

  ::v-deep(.el-scrollbar__view) {
    overflow-x: hidden !important;
  }

  .setting-bar-flex {
    display: flex !important;
    align-items: center;
    margin-bottom: 5px;

    &-label {
      flex: 1;
      color: var(--el-text-color-primary);
    }
  }

  .layout-drawer-content-flex {
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    margin: 0 -5px;

    .layout-drawer-content-item {
      width: 50%;
      height: 70px;
      cursor: pointer;
      border: 1px solid transparent;
      position: relative;
      padding: 5px;

      .el-container {
        height: 100%;

        .el-aside-dark {
          background-color: var(--next-color-setting-header);
        }

        .el-aside {
          background-color: var(--next-color-setting-aside);
        }

        .el-header {
          background-color: var(--next-color-setting-header);
        }

        .el-main {
          background-color: var(--next-color-setting-main);
        }
      }

      .el-circular {
        border-radius: 2px;
        overflow: hidden;
        border: 1px solid transparent;
        transition: all 0.3s ease-in-out;
      }

      .drawer-layout-active {
        border: 1px solid;
        border-color: var(--el-color-primary);
      }

      .layout-tips-warp,
      .layout-tips-warp-active {
        transition: all 0.3s ease-in-out;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border: 1px solid;
        border-color: var(--el-color-primary-light-4);
        border-radius: 100%;
        padding: 4px;

        .layout-tips-box {
          transition: inherit;
          width: 30px;
          height: 30px;
          z-index: 9;
          border: 1px solid;
          border-color: var(--el-color-primary-light-4);
          border-radius: 100%;

          .layout-tips-txt {
            transition: inherit;
            position: relative;
            top: 5px;
            font-size: 12px;
            letter-spacing: 2px;
            white-space: nowrap;
            color: var(--el-color-primary-light-4);
            text-align: center;
            transform: rotate(30deg);
            left: -1px;
            background-color: var(--next-color-setting-main);
            width: 32px;
            height: 17px;
            line-height: 17px;
          }
        }
      }

      .layout-tips-warp-active {
        border: 1px solid;
        border-color: var(--el-color-primary);

        .layout-tips-box {
          border: 1px solid;
          border-color: var(--el-color-primary);

          .layout-tips-txt {
            color: var(--el-color-primary) !important;
            background-color: var(--next-color-setting-main) !important;
          }
        }
      }

      &:hover {
        .el-circular {
          transition: all 0.3s ease-in-out;
          border: 1px solid;
          border-color: var(--el-color-primary);
        }

        .layout-tips-warp {
          transition: all 0.3s ease-in-out;
          border-color: var(--el-color-primary);

          .layout-tips-box {
            transition: inherit;
            border-color: var(--el-color-primary);

            .layout-tips-txt {
              transition: inherit;
              color: var(--el-color-primary) !important;
              background-color: var(--next-color-setting-main) !important;
            }
          }
        }
      }
    }
  }

  .copy-config {
    margin: 10px 0;

    .copy-config-btn {
      width: 100%;
      margin-top: 15px;
    }

    .copy-config-btn-reset {
      width: 100%;
      margin: 10px 0 0;
    }
  }
}
</style>