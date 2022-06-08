<template>
  <div class="system-version-container">
    <el-card shadow="hover">
      <div class="system-search mb15">
        <el-date-picker v-model="state.date" end-placeholder="结束日期" start-placeholder="开始日期"
                        style="max-width: 240px" type="daterange" value-format="YYYY-MM-DD"></el-date-picker>
        <el-button class="ml10" size="default" type="primary" @click="query">
          <el-icon>
            <SvgIcon name="ele-Search"></SvgIcon>
          </el-icon>
          查询
        </el-button>
        <el-button class="ml10" size="default" type="success" @click="onOpenAddVersion">
          <el-icon>
            <SvgIcon name="ele-FolderAdd"></SvgIcon>
          </el-icon>
          新增版本
        </el-button>
      </div>
      <el-table v-loading="loading" :data="dataSource" height="calc(100vh - 280px)" style="width: 100%">
        <el-table-column label="ID" prop="id" show-overflow-tooltip width="80"/>
        <el-table-column label="版本号" prop="version" show-overflow-tooltip width="100">
          <template #default="scope">
            <span>{{ scope.row.version }}</span>
            <el-tag v-if="scope.row.latest" class="link" type="success">{{ 'latest' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="releaseTime" show-overflow-tooltip width="160"/>
        <el-table-column label="文件状态" prop="dictValue" show-overflow-tooltip width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.fileStatus" class="link" type="success">{{ '已上传' }}</el-tag>
            <el-tag v-else class="link" type="danger">{{ '未上传' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="强制更新" prop="forced" show-overflow-tooltip width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.forced" class="link" type="danger">{{ '强制更新' }}</el-tag>
            <el-tag v-else class="link" type="success">{{ '选择更新' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="MD5" prop="md5" show-overflow-tooltip width="280"/>
        <el-table-column label="hash" prop="hash" show-overflow-tooltip/>
        <el-table-column label="更新日志" prop="updateLog" show-overflow-tooltip/>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button :disabled="scope.row.value === 'admin'" size="small" text type="primary">
              修改
            </el-button>
            <el-button :disabled="scope.row.value === 'admin'" size="small" text type="danger">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :hide-on-single-page="false"
          :pager-count="5"
          :small="true"
          :total="pagination.total"
          background
          class="mt15"
          layout="total, prev, pager, next, jumper"
          @current-change="onHandleCurrentChange"
      />
    </el-card>
    <add-version ref="addVersion"/>
  </div>
</template>

<script lang="ts" name="versionIndex" setup>
import {onMounted, reactive, ref} from "vue";
import AddVersion from "@renderer/views/system/version/components/AddVersion.vue";
import {useVersionApi} from "@renderer/api/version";
import {checkResource} from "@renderer/utils/request";
import {ElMessage} from "element-plus";

const state = reactive({
  date: []
})
const addVersion = ref(null)
const loading = ref(false)
const dataSource = ref([])
let pagination = ref({
  current: 1,
  size: 20,
  total: 0,
})
const query = (page) => {
  let [startTime, stopTime] = state.date || [null, null]
  let {current, size} = page
  useVersionApi().getVersionManagerList({startTime, stopTime, current, size}).then(res => {
    dataSource.value = res.result.list
    pagination.value.total = res.result.total
    pagination.value.size = res.result.size
    pagination.value.current = res.result.current
    let ls = res.result.list.map(async (i) => {
      let checked = await getFileStatus(i.src)
      i.fileStatus = checked && checked.status === 200;
      return i
    })
    Promise.all(ls).then(res => {
      console.log(res)
      dataSource.value = res
    })
  })
}
const onOpenAddVersion = () => {
  addVersion.value.openDialog()
}
const onHandleCurrentChange = async (val: number) => {
  pagination.value.current = val;
  query(pagination.value)
}
const getFileStatus = async (src: string) => {
  let res
  try {
    res = await checkResource(src)
  } catch (e) {
  }
  return res
}
onMounted(() => {
  query(pagination.value)
})
</script>

<style scoped>
:deep(.el-range-editor) {
  height: var(--el-component-size)
}
</style>