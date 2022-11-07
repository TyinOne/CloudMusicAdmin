<template>
  <div v-if="visible" class="mask-box" @click="closeMask">
    <div class="title-box">
      <div class="title">
        <!-- <ali-svg-icon :icon-class="icon_name" class-name="cuowu"></ali-svg-icon> -->
        <div class="text">{{ title }}</div>
      </div>
      <div class="content">{{ message }}</div>
      <div class="download-progress">
        <el-progress
            :color="colors"
            :percentage="percentage"
            :status="progressStaus"
        ></el-progress>
      </div>
      <div v-if="winOS" class="progress-content">
        注：当提示您安全警告时，请点击“运行(R)”，或者点击“更多信息”，选择仍要运行
      </div>
      <div class="bom-box">
        <el-button
            v-if="progressStaus === 'success'"
            type="text"
            @click="openfile"
        >
          查看文件位置
        </el-button>
        <el-button @click="killSys">{{ killButton }}</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {Ref} from "vue";
import {onUnmounted, ref, watch} from "vue";

const {ipcRenderer, shell, systemInfo} = window;
const props = defineProps({
  modelValue: Boolean,
});
const emits = defineEmits(["update:modelValue"]);
const visible = ref(false);

watch(
    () => props.modelValue,
    () => {
      visible.value = props.modelValue;
    }
);

interface Colors {
  color: string;
  percentage: number;
}

const colors: Ref<Colors[] | string> = ref([
  {color: "#f56c6c", percentage: 20},
  {color: "#e6a23c", percentage: 40},
  {color: "#6f7ad3", percentage: 60},
  {color: "#1989fa", percentage: 80},
  {color: "#5cb87a", percentage: 100},
]);
const percentage = ref(0);
const progressStaus = ref(null);
const winOS = systemInfo.platform.includes("win32");
const title = ref("强制更新");
const message = ref("由于当前软件版本过低，为了保证您的使用，已激活强制更新");
const killButton = ref("退出软件");
ipcRenderer.on("download-progress", (event, arg) => {
  percentage.value = Number(arg);
});
ipcRenderer.on("download-error", (event, arg) => {
  if (arg) {
    progressStaus.value = "exception";
    percentage.value = 40;
    colors.value = "#d81e06";
  }
});
ipcRenderer.on("download-done", (event, age) => {
  filePath.value = age.filePath;
  progressStaus.value = "success";
  message.value = "更新下载完成！";
});

const filePath = ref("");
const openfile = () => {
  shell.shell.showItemInFolder(filePath.value);
};
const killSys = () => {
  ipcRenderer.invoke("appClose");
};
// 当且仅当为开发模式才可以关闭
const closeMask = () => {
  if (process.env.NODE_ENV === "development") {
    emits("update:modelValue", false);
  }
};
onUnmounted(() => {
  ipcRenderer.removeAllListeners("download-done");
  ipcRenderer.removeAllListeners("download-progress");
  ipcRenderer.removeAllListeners("download-error");
});
</script>
<script lang="ts">
export default {
  name: "index"
}
</script>

<style scoped>

</style>