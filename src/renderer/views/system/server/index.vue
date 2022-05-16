<template>
  <div v-loading="state.loading" class="system-server-container">
    <div class="view-item flex">
      <el-card style="width: 49%" shadow="never">
        <template #header>
          <div style="max-height: 16px">
            <span>CPU</span>
          </div>
        </template>
        <el-table :data="cupList" style="width: 100%">
          <el-table-column prop="key" label="属性"/>
          <el-table-column prop="value" label="值"/>
        </el-table>
      </el-card>
      <el-card style="width: 49%" shadow="never">
        <template #header>
          <div style="max-height: 16px">
            <span>内存</span>
          </div>
        </template>
        <el-table :data="memList" style="width: 100%">
          <el-table-column prop="key" label="属性"/>
          <el-table-column prop="value" label="内存"/>
          <el-table-column prop="jvm" label="JVM"/>
        </el-table>
      </el-card>
    </div>
    <div class="view-item">
      <el-card shadow="never">
        <template #header>
          <div style="max-height: 16px">
            <span>服务器信息</span>
          </div>
        </template>
        <el-descriptions :column="2">
          <el-descriptions-item label="服务器名称">{{ state.server.sys.computerName }}</el-descriptions-item>
          <el-descriptions-item label="操作系统">{{ state.server.sys.osName }}</el-descriptions-item>
          <el-descriptions-item label="服务器IP">{{ state.server.sys.computerIp }}</el-descriptions-item>
          <el-descriptions-item label="系统架构">{{ state.server.sys.osArch }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
    <div class="view-item">
      <el-card shadow="never">
        <template #header>
          <div style="max-height: 16px">
            <span>JVM虚拟机信息</span>
          </div>
        </template>
        <el-descriptions :column="2">
          <el-descriptions-item label="JVM名称">{{ state.server.jvm.name }}</el-descriptions-item>
          <el-descriptions-item label="JAVA版本">{{ state.server.jvm.version }}</el-descriptions-item>
          <el-descriptions-item label="启动时间">{{ state.server.jvm.startTime }}</el-descriptions-item>
          <el-descriptions-item label="运行时长">{{ state.server.jvm.runTime }}</el-descriptions-item>
          <el-descriptions-item label="安装路径">{{ state.server.jvm.home }}</el-descriptions-item>
          <el-descriptions-item label="项目路径">{{ state.server.sys.userDir }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
    <div class="view-item">
      <el-card shadow="never">
        <template #header>
          <div style="max-height: 16px">
            <span>磁盘信息</span>
          </div>
        </template>
        <el-table :data="state.server.disks">
          <el-table-column prop="dirName" label="盘符路径"/>
          <el-table-column prop="sysTypeName" label="文件系统"/>
          <el-table-column prop="fileTypeName" label="盘符类型"/>
          <el-table-column prop="total" label="总大小"/>
          <el-table-column prop="free" label="可用大小"/>
          <el-table-column prop="used" label="已用大小"/>
          <el-table-column prop="usage" label="已用百分比">
            <template #default="scope">
              {{ scope.row.usage + '%' }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>
<script name="serverView" lang="ts" setup>
import {useServerApi} from "@renderer/api/server";
import {onMounted, reactive, ref} from "vue";

let state = reactive({
  server: {
    cpu: {
      sys: '',
      cpuNum: '',
      used: '',
      free: ''
    },
    disks: [],
    jvm: {},
    mem: {},
    sys: {
      computerName: '',
      computerIp: '',
      osName: '',
      osArch: '',
      userDir: ''
    }
  },
  loading: false
})
let cupList = ref([])
let memList = ref([])

const getServerConfig = () => {
  state.loading = true
  useServerApi().getServerConfig().then(res => {
    state.server = res.result
    cupList.value = getCpuInfoList(state.server.cpu)
    memList.value = getMemInfoList(state.server.mem, state.server.jvm)
    state.loading = false
  }).catch(e => {
    state.loading = false
  })
}
const getCpuInfoList = (cpu) => {
  let array = []
  array.push({key: '核心总数', value: cpu.cpuNum})
  array.push({key: '系统使用率', value: cpu.sys + '%'})
  array.push({key: '用户使用率', value: cpu.used + '%'})
  array.push({key: '当前空闲率', value: cpu.free + '%'})
  return array
}

const getMemInfoList = (mem, jvm) => {
  let array = []
  array.push({key: '总内存', value: mem.total + 'GB', jvm: jvm.total + 'MB'})
  array.push({key: '已使用内存', value: mem.used + 'GB', jvm: jvm.used + 'MB'})
  array.push({key: '剩余内存', value: mem.free + 'GB', jvm: jvm.free + 'MB'})
  array.push({key: '使用率', value: mem.usage + '%', jvm: jvm.usage + '%'})

  return array
}

onMounted(() => {
  getServerConfig()
})
</script>

<style scoped>
.view-item {
  min-width: 850px;
}
.flex {
  display: flex;
  justify-content: space-between
}


:deep(.el-card__body) {
  padding: 0 10px;
}

:deep(.el-descriptions__cell) {
  padding: 8px 0;
}

:deep(.el-descriptions__label) {
  display: inline-block;
  padding-left: 12px;
  width: 45%;
  color: #909399;
  font-weight: bolder;
}
</style>