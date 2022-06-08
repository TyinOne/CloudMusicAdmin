<template>
  <el-drawer
      v-model="isShow"
      :append-to-body="true"
      :title="'文件传输'"
      custom-class="downloadDrawer"
      destroy-on-close
      direction="rtl"
      size="500px"
      @close="onDrawerClose"
  >
    <el-tabs v-model="active" class="tabs"
             tabPosition="left">
      <el-tab-pane name="downloading">
        <!--          <el-button @click="startDownload">111</el-button>-->
        <template #label>
            <span class="custom-tabs-label">
              <el-badge v-if="downloading.task.length !== 0" :value="downloading.task.length" class="item" type="info">
                <span>下载中</span>
              </el-badge>
              <span v-else>下载中</span>
            </span>
        </template>
        <el-space direction="horizontal" fill style="width: 100%" wrap>
          <div v-for="(item, index) in downloading.task" :class="downloading.active === index ? 'active' : ''"
               :shadow="'never'"
               class="task-item"
               @click="activeItem('downloading',index)"
               @contextmenu.prevent="onContextmenu(item, index, $event)">
            <div class="task-item-info">
              <el-image :src="item.icon" class="file-icon"/>
              <div class="task-item-box">
                <div class="item-box-head">
                  <div class="file-content">{{ item.fileName }}</div>
                  <div class="link" @click="pauseOrResume(item)">
                    <SvgIcon :name="getDownloadingStateIcon(item)" :size="24" class="status-icon"></SvgIcon>
                  </div>
                </div>
                <div v-if="item.state !== 'completed' || item.state !== 'cancelled'"
                     style="display: flex;align-items: baseline; justify-content: space-between;height:20px;line-height: 20px; width: 90%;font-size: 12px">
                  <div> {{ getByteConvert(item.receivedBytes) + '/' + getByteConvert(item.totalBytes) }}</div>
                  <div v-if="item.state === 'progressing'">
                    {{ formatDuring((item.totalBytes - item.receivedBytes) / item.speed * 1000) }}
                  </div>
                  <div v-if="item.state === 'progressing' && !item.paused">{{ getByteConvert(item.speed) + '/s' }}</div>
                  <div v-else-if="item.state === 'progressing' && item.paused">{{ '已暂停' }}</div>
                </div>
                <el-progress v-if="item.state !== 'completed' && item.state !== 'cancelled'"
                             :percentage="parseInt(item.progress * 100 + '')"
                             :show-text="false"
                             style="display: flex;align-items: baseline; justify-content: space-between;height:20px;line-height: 20px; width: 90%;font-size: 12px"/>
                <div v-else style="color: #c90000">{{ '' }}</div>
              </div>
            </div>
          </div>
        </el-space>
      </el-tab-pane>
      <el-tab-pane name="downloaded">
        <template #label>
            <span class="custom-tabs-label">
              <el-badge v-if="downloaded.task.length !== 0" :value="downloaded.task.length" class="item" type="info">
                <span>已完成</span>
              </el-badge>
              <span v-else>已完成</span>
            </span>
        </template>
        <el-space direction="horizontal" fill style="width: 100%" wrap>
          <div v-for="(item, index) in downloaded.task" :class="downloaded.active === index ? 'active' : ''"
               :shadow="'never'"
               class="task-item"
               @click="activeItem('downloaded', index)"
               @contextmenu.prevent="onContextmenu(item, index, $event)">
            <div class="task-item-info">
              <el-image :src="item.icon" class="file-icon"/>
              <div class="task-item-box">
                <div class="item-box-head">
                  <div class="file-content">{{ item.fileName }}</div>
                  <div class="link" @click="openFile(item)">
                    <SvgIcon :name="'ele-Folder'" :size="20" class="status-icon"></SvgIcon>
                  </div>
                </div>
                <div v-if="item.state !== 'completed' || item.state !== 'cancelled'"
                     style="display: flex;align-items: baseline; justify-content: space-between;height:20px;line-height: 20px; font-size: 12px">
                  <div>
                    {{ (item.totalBytes / (1024 * 1024)).toFixed(2) + ' MB' }}
                  </div>
                  <div>
                    {{ getFormatDate(item.startTime) }}
                  </div>
                </div>
                <el-progress v-if="item.state !== 'completed' && item.state !== 'cancelled'"
                             :percentage="parseInt(item.progress * 100 + '')"
                             :show-text="false"
                             style="display: flex;align-items: baseline; justify-content: space-between;height:20px;line-height: 20px; width: 90%;font-size: 12px"/>
                <div v-else style="color: #c90000">{{ '' }}</div>
              </div>
            </div>
          </div>
        </el-space>
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
  </el-drawer>
  <DownloadContextMenu ref="downloadContext" :dropdown="state.dropdown"
                       @currentClick="actionTaskItemClick"></DownloadContextMenu>
</template>

<script lang="ts" name="layoutBreadcrumbDownload" setup>
import {nextTick, onMounted, reactive, ref} from "vue";
import SvgIcon from "@renderer/components/svgIcon/index.vue";
import commonFunction from "@renderer/utils/commonFunction";
import {Action, ElMessageBox} from "element-plus";
import DownloadContextMenu from "@renderer/components/download/ContextMenu.vue";
import {formatDate} from "@renderer/utils/formatTime";

let {ipcRenderer} = window;
let active = ref('downloading')
let downloadContext = ref(null)
const state = reactive({
  dropdown: {x: '', y: ''},
});

let downloading = reactive({
  task: ref([]),
  active: undefined,
})

let isShow = ref(false)
const openDrawer = () => {
  isShow.value = true
}
const onDrawerClose = () => {
  downloadContext.value.closeContextmenu()
  isShow.value = false
}
// <Array<TaskItem>>
let downloaded = reactive({
  task: ref([]),
  active: null
})
let deleted = reactive({
  task: ref([]),
  active: null
})
const activeItem = (type, index) => {
  if (type === 'downloading') downloading.active = index
  if (type === 'downloaded') downloaded.active = index
}
const onContextmenu = (v: any, i: any, e: any) => {
  activeItem(active.value, i)
  const {clientX, clientY} = e;
  state.dropdown.x = clientX;
  state.dropdown.y = clientY;
  downloadContext.value.openContextmenu(v);
}
const actionTaskItemClick = (info) => {
  console.log(info)
  switch (info.action) {
    case 0:
      if (info.item.state === 'progressing') {
        pauseOrResume(info.item)
      } else {
        retryDownload(info.item)
      }
      break;
    case 2:
      removeTaskItem(info.item)
      break;
    case 3:
      ElMessageBox.confirm('确认删除任务?', '彻底删除', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确认',
        draggable: true,
        roundButton: true,
        callback: (value, action) => {
          if (value === 'confirm') {
            removeTaskItemFile(info.item)
          }
        }
      })
      break;
    case 4:
      commonFunction().copyText(info.item.url);
      break;
  }
}
const removeTaskItem = (download) => {
  //removeDownloadItem
}
const removeTaskItemFile = (download) => {
  console.log(download)
  ipcRenderer.invoke('removeDownloadItemFile', {
    id: download.id
  })
}
const startDownload = () => {
  ipcRenderer.invoke('newDownloadFile', {
    url: 'https://releases.ubuntu.com/22.04/ubuntu-22.04-desktop-amd64.iso',
    path: 'G:\\data'
  })
}
const getTaskList = async () => {
  let list = []
  list = await ipcRenderer.invoke('getDownloadData')
  downloading.task = list.filter(i => (i.state === 'progressing' || i.state === 'interrupted' || i.state === 'cancelled') || i.paused)
  downloaded.task = list.filter(i => i.state === 'completed')
  console.log(list)
}
const formatDuring = (mss: any) => {
  if (isNaN(mss) || mss === Infinity) {
    return '--:--:--'
  }
  let days = parseInt((mss / (1000 * 60 * 60 * 24) + '').padStart(2, '0'));
  let hours = (parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) + '') + '').padStart(2, '0');
  let minutes = (parseInt((mss % (1000 * 60 * 60)) / (1000 * 60) + '') + '').padStart(2, '0');
  let seconds = (parseInt(mss % (1000 * 60) / 1000 + '') + '').padStart(2, '0');
  return hours + ":" + minutes + ":" + seconds;
}
const getDownloadingStateIcon = (item) => {
  console.log(item.state === 'progressing' && item.paused)
  if (item.paused) {
    //暂停
    return 'bi-play bi'
  } else {

  }
  if (item.state === 'progressing' && item.paused) {
    return 'bi-play bi'
  } else {
    return 'bi-pause bi'
  }
}
const getFormatDate = (timestamp: number) => {
  return formatDate(new Date(timestamp), 'YYYY-mm-dd HH:MM:SS')
}
const getByteConvert = (byte) => {
  return commonFunction().byteConvert(byte);
}
const openMessageBox = (download) => {
  ElMessageBox.confirm(
      '当前任务已存在，重新下载将删除已下载内容',
      '任务已存在',
      {
        distinguishCancelAndClose: true,
        confirmButtonText: '查看',
        cancelButtonText: '重新下载',
        type: 'warning',
        draggable: true,
      }
  )
      .then(() => {
        openFile(download)
      })
      .catch((action: Action) => {
        if (action === 'cancel') {
          retryDownload(download)
        }
      })
}

const pauseOrResume = (download) => {
  ipcRenderer.invoke('pauseOrResume', {id: download.id})
}

const openFile = (download) => {
  ipcRenderer.invoke('openFileInFolder', {path: download.path})
}
const retryDownload = (download) => {
  let {url, path, id} = download
  ipcRenderer.invoke('retryDownloadFile', {path, url, id})
}
const closeContextmenu = () => {
  downloadContext.value.closeContextmenu();
}
ipcRenderer.on('downloadFileExist', (event, arg) => {
  openMessageBox(arg)
});

onMounted(() => {
  nextTick(() => {
    getTaskList()
    // 监听页面监听进行右键菜单的关闭
    document.getElementsByClassName('downloadDrawer')[0].addEventListener('click', closeContextmenu)
    document.getElementsByClassName('downloadDrawer')[0].addEventListener('contextmenu', closeContextmenu);
  })
})
ipcRenderer.on('updateTaskList', (event: any, msg: boolean) => {
  getTaskList()
})
defineExpose({
  openDrawer
})
</script>
<style lang="scss" scoped>
:deep(.el-badge__content.is-fixed) {
  transform: translateY(60%) translateX(180%);
}

:deep(.el-tabs__item) {
  width: 100px;
  padding: 0 40px 0 10px;
}

.status-icon:hover {
  color: var(--el-color-primary);
}

.active {
  background-color: rgba(243, 246, 255, 0.5);
}

.task-item {
  padding: 15px 15px 10px 15px;

  .task-item-info {
    padding-bottom: 10px;
    cursor: unset;
    display: flex;
    justify-content: space-between;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    .file-icon {
      width: 50px;
      height: 50px;
    }

    .task-item-box {
      width: 300px;

      .item-box-head {
        display: flex;
        justify-content: space-between;
        height: 30px;

        .file-content {
          font-size: 16px;
        }
      }
    }
  }
}
</style>