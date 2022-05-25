<template>
  <div class="download-container">
    <el-card shadow="hover" style="min-height: calc(100vh - 150px);max-height: calc(100vh - 150px)">
      <el-tabs
          v-model="activeName"
          class="tabs"
      >、
        <el-tab-pane name="loading">
          <el-button @click="startDownload">111</el-button>
          <template #label>
            <span class="custom-tabs-label">
              <el-badge v-if="task.length !== 0" :value="task.length" class="item" type="info">
                <span>下载中</span>
              </el-badge>
              <span v-else>下载中</span>
            </span>
          </template>
          <el-space direction="horizontal" fill style="width: 100%" wrap>
            <el-card v-for="(item, index) in task" :class="downloading.active === index ? 'active' : ''"
                     :shadow="'never'"
                     @click="activeItem(index)"
                     @contextmenu.prevent="onContextmenu(item, index, $event)">
              <div style="display: flex;justify-content: space-between;height: 40px">
                <div style="font-size: 16px">{{ item.fileName }}</div>
                <div class="link">
                  <SvgIcon :name="getStatusIcon(item.state)" :size="24" class="status-icon"></SvgIcon>
                </div>
              </div>
              <div v-if="item.state !== 'completed' || item.state !== 'cancelled'"
                   style="display: flex;justify-content: space-between;height: 20px">
                <div style="font-size: 12px">
                  {{
                    (item.receivedBytes / (1024 * 1024)).toFixed(2) + ' MB / ' + (item.totalBytes / (1024 * 1024)).toFixed(2) + ' MB'
                  }}
                </div>
                <div v-if="item.state === 'progressing'">
                  {{ formatDuring((item.totalBytes - item.receivedBytes) / item.speed * 1000) }}
                </div>
                <div v-if="item.state === 'progressing'">{{ (item.speed / (1024 * 1024)).toFixed(2) + ' Mb/s' }}</div>
                <div v-else>{{ '已暂停' }}</div>
              </div>
              <el-progress v-if="item.state !== 'completed' || item.state !== 'cancelled'"
                           :percentage="parseInt(item.progress * 100 + '')"
                           :show-text="false"/>
              <div v-else style="color: #c90000">{{ '' }}</div>
            </el-card>
          </el-space>
        </el-tab-pane>
        <el-tab-pane name="finished">
          <template #label>
            <span class="custom-tabs-label">
              <el-badge v-if="downloaded.length !== 0" :value="downloaded.length" class="item" type="info">
                <span>已完成</span>
              </el-badge>
              <span v-else>已完成</span>
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane name="recycle">
          <template #label>
            <span class="custom-tabs-label">
              <el-badge v-if="deleted.length !== 0" :value="deleted.length" class="item" type="info">
                <span>回收站</span>
              </el-badge>
              <span v-else>回收站</span>
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <DownloadContextMenu ref="downloadContext" :dropdown="state.dropdown"
                         @currentClick="actionTaskItemClick"></DownloadContextMenu>
  </div>
</template>
<script lang="ts" setup>
import {reactive, ref} from "vue";
import SvgIcon from "@renderer/components/svgIcon/index.vue";
import DownloadContextMenu from "@renderer/components/download/ContextMenu.vue";
import commonFunction from "@renderer/utils/commonFunction";

let {ipcRenderer} = window;
let activeName = ref('loading')
let downloadContext = ref(null)
const state = reactive({
  dropdown: {x: '', y: ''},
});
let downloading = reactive({
  active: undefined,
})

// <Array<TaskItem>>
let task = ref([])
let downloaded = reactive({
  task: ref<Array<TaskItem>>([]),
  active: null
})
let deleted = reactive({
  task: ref<Array<TaskItem>>([]),
  active: null
})
const activeItem = (index) => {
  downloading.active = index
}
const onContextmenu = (v: any, i: any, e: any) => {
  downloading.active = i
  const {clientX, clientY} = e;
  state.dropdown.x = clientX;
  state.dropdown.y = clientY;
  downloadContext.value.openContextmenu(v);
}
const actionTaskItemClick = (info) => {
  if (info.action !== 4) {
    ipcRenderer.invoke('handleDownloadItem', info)
  } else {
    commonFunction().copyText(info.item.url)
  }
}
const startDownload = () => {
  ipcRenderer.invoke('newDownloadFile', {
    url: 'https://download.jetbrains.com.cn/idea/ideaIU-2021.2.1.exe',
    path: 'G:\\data',
    fileName: 'ideaIU-2021.2.1.exe'
  })
}
const getTaskList = async () => {
  let list
  list = await ipcRenderer.invoke('getDownloadData')
  console.log(list)
  task.value = list
}
setInterval(getTaskList, 1000)
const formatDuring = (mss: number) => {
  console.log(mss)
  if (isNaN(mss)) {
    return '--:--:--'
  }
  let days = parseInt((mss / (1000 * 60 * 60 * 24) + '').padStart(2, '0'));
  let hours = (parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) + '') + '').padStart(2, '0');
  let minutes = (parseInt((mss % (1000 * 60 * 60)) / (1000 * 60) + '') + '').padStart(2, '0');
  let seconds = (parseInt(mss % (1000 * 60) / 1000 + '') + '').padStart(2, '0');
  return hours + ":" + minutes + ":" + seconds;
}
const getStatusIcon = (status) => {
  switch (status) {
    case 'progressing':
      return 'bi-pause bi'
    default:
      return 'bi-play bi'
  }
}
</script>
<script lang="ts">
interface TaskItem {
  name: string,
  total: number,
  current: number,
  speed: number,
  status: number,//0:进行中，1:已暂停；其他代表下载出错
  statusMessage: string,
  time: string,
  message: string,
  path: '',
  url: ''
}
export default {
  name: "downloadIndex"
}
</script>

<style lang="scss" scoped>
:deep(.el-badge__content.is-fixed) {
  transform: translateY(10%) translateX(150%);
}

:deep(.el-tabs__item) {
}

.status-icon:hover {
  color: var(--el-color-primary);
}

.active {
  background-color: rgba(243, 246, 255, 0.5);
}
</style>