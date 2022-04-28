<template>
  <div v-if="!IsUseSysTitle && isNotMac && !IsWeb">
    <div class="window-title">
      <div class="controls-container">
        <div class="windows-icon-bg close-icon" @click="Close">
          <SvgIcon :name="macClose"></SvgIcon>
        </div>
        <div class="windows-icon-bg" @click="MixOrReduction">
          <SvgIcon :name="macMax"></SvgIcon>
        </div>
        <div class="windows-icon-bg" @click="Mini">
          <SvgIcon :name="macMin"></SvgIcon>
        </div>
      </div>
      <!-- 菜单栏位置 -->
      <div class="menu-container">
        <div class="menu-item">
          <div class="link">帮助</div>
        </div>
        <div class="menu-item">
          <div class="link">关于</div>
        </div>
        <div class="menu-item">
          <div class="link" @click="checkUpdate('three')">检查更新</div>
        </div>
        <div class="menu-item">
          <div class="link">开发者工具</div>
        </div>
        <div class="no-hover menu-item">
          <div>v0.0.1456</div>
        </div>
      </div>
      <!-- 中间标题位置 -->
      <div class="title" style="-webkit-app-region: drag"></div>
    </div>
  </div>
  <div v-else-if="!IsUseSysTitle && !isNotMac" class="window-title">
  </div>
  <el-dialog
      title="进度"
      v-model="dialogVisible"
      :before-close="handleClose"
      center
      width="14%"
      top="45vh"
  >
    <div class="conten">
      <el-progress
          type="dashboard"
          :percentage="percentage"
          :color="colors"
          :status="progressStatus"
      ></el-progress>
    </div>
  </el-dialog>
  <update-progress v-model="showForcedUpdate"/>

</template>
<script lang="ts" setup>
import macMax from '@renderer/assets/mac_max.svg'
import macMin from '@renderer/assets/mac_min.svg'
import macClose from '@renderer/assets/mac_close.svg'
import UpdateProgress from "@renderer/components/updateProgress/index.vue";
import {ref} from "vue";

let dialogVisible = ref(false);
let showForcedUpdate = ref(false);
let progressStatus = ref(null);
let filePath = ref("");
let updateStatus = ref("");
let percentage = ref(0);
let colors = ref([
  { color: "#f56c6c", percentage: 20 },
  { color: "#e6a23c", percentage: 40 },
  { color: "#6f7ad3", percentage: 60 },
  { color: "#1989fa", percentage: 80 },
  { color: "#5cb87a", percentage: 100 },
] as string | ColorInfo[]);

let {ipcRenderer, systemInfo} = window;

const IsUseSysTitle = ref(false);
const mix = ref(false);
const isNotMac = ref(false);
const IsWeb = ref(process.env.IS_WEB);

if (!ipcRenderer) {
  ipcRenderer = {} as any;
  ipcRenderer.on =
      ipcRenderer.invoke =
          ipcRenderer.removeAllListeners =
              (...args: any): any => {
                console.log("not electron");
              };
} else {
  isNotMac.value = systemInfo.platform !== "darwin";
  ipcRenderer.invoke("IsUseSysTitle").then((res) => {
    IsUseSysTitle.value = res;
  });
}

const Mini = () => {
  ipcRenderer.invoke("windows-mini");
};
const MixOrReduction = () => {
  ipcRenderer.invoke("window-max").then((res) => {
    mix.value = res.status;
  });
};
const Close = () => {
  ipcRenderer.invoke("window-close");
};

const checkUpdate = (data) => {
  switch (data) {
    case "one":
      ipcRenderer.invoke("check-update");
      console.log("启动检查");
      break;
    case "two":
      ipcRenderer.invoke("start-download").then(() => {
        dialogVisible.value = true;
      });
      break;
    case "three":
      ipcRenderer.invoke("hot-update");
      break;
    case "four":
      showForcedUpdate.value = true;
      break;
    default:
      break;
  }
}

const handleClose = () => {
  dialogVisible.value = false;
}

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.window-title {
  width: calc(100% - 50px);
  height: 30px;
  line-height: 30px;
  background-color: #ffffff;
  display: flex;
  -webkit-app-region: drag;
  //position: fixed;
  align-items: center;
  top: 0;
  z-index: 99999;

  .controls-container {
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    text-align: center;
    position: relative;
    z-index: 3000;
    -webkit-app-region: no-drag;
    height: 100%;
    width: 100px;
    //margin-left: auto;
    .windows-icon-bg {
      display: flex;
      align-items: center;
      justify-content: space-around;
      -webkit-app-region: no-drag;
      height: 100%;
      width: 33.34%;
      color: rgba(129, 129, 129, 0.6);

      .icon-size {
        width: 12px;
        height: 15px;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
      }
    }

    .windows-icon-bg:hover {
      background-color: rgba(182, 182, 182, 0.2);
      color: #333;
    }

    .close-icon:hover {
      background-color: rgba(232, 17, 35, 0.9);
      color: #fff;
    }
  }

  .menu-container {
    display: flex;

    .menu-item {
      display: inline-block;
      -webkit-app-region: no-drag;
      padding: 0 10px;
      text-align: center;
      color: rgba(112, 109, 109, 1);
      user-select: none;
    }

    .menu-item:hover {
      background-color: rgba(182, 182, 182, 0.2);
      color: #000000;
    }

    .no-hover {
      pointer-events: none;
      -webkit-app-region: drag;
    }
  }

  .icon-logo {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }

  .title {
    text-align: center;
    width: 300px;
  }

  .window-menu {
    margin-left: 60px;
    width: 300px;
  }

  .logo {
    margin-left: 20px;
  }

}
</style>