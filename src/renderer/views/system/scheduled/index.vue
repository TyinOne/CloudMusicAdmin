<template>
  <div class="system-scheduled-container">
    <el-card shadow="hover">
      <div class="system-search mb15">
        <el-input v-model="state.keywords" clearable placeholder="请输入关键词"
                  size="default" style="max-width: 180px"/>
        <el-select v-model="state.group" :clearable="true" placeholder="请选择分组" @change="query">
          <el-option v-for="item in queryGroup" :label="item.label" :value="item.value"/>
        </el-select>
        <el-select v-model="state.disabled" placeholder="请选择状态" @change="query">
          <el-option :value="false" label="正常"></el-option>
          <el-option :value="true" label="停用"></el-option>
        </el-select>
        <el-button class="ml10" size="default" type="primary" @click="query">
          <el-icon>
            <SvgIcon name="ele-Search"></SvgIcon>
          </el-icon>
          查询
        </el-button>
        <el-button class="ml10" plain size="default" type="primary" @click="addScheduled">
          <el-icon>
            <SvgIcon name="ele-Plus"></SvgIcon>
          </el-icon>
          新增任务
        </el-button>
        <el-button class="ml10" plain size="default" type="success" @click="toLogView">
          <el-icon>
            <SvgIcon name="ele-Operation"></SvgIcon>
          </el-icon>
          调度日志
        </el-button>
      </div>
      <el-table v-loading="loading" :data="dataSource" height="calc(100vh - 280px)" style="width: 100%">
        <el-table-column label="ID" prop="id" width="60"/>
        <el-table-column label="任务名称" prop="name" width="120"/>
        <el-table-column label="任务分组" prop="group" width="100"/>
        <el-table-column label="目标方法" prop="method"/>
        <el-table-column label="cron表达式" prop="cron" width="150"/>
        <el-table-column label="状态" width="80">
          <template #default="scope">
            <el-tag v-if="scope.row.disabled" type="warning">{{ '停用' }}</el-tag>
            <el-tag v-else type="success">{{ '正常' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="created" width="180"/>
        <el-table-column label="操作" width="130">
          <template #default="scope">
            <el-space>
              <el-button :disabled="scope.row.deleted === true" size="small" text type="primary"
                         @click="onOpenEditScheduled(scope.row)">编辑
              </el-button>
              <el-dropdown @command="(command) => handleDropdownCommand(command)">
                <el-button size="small" text type="primary">更多</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="handleRun" icon="ele-CaretRight">执行一次</el-dropdown-item>
                    <el-dropdown-item command="handleView" icon="ele-View">任务详细</el-dropdown-item>
                    <el-dropdown-item command="handleJobLog" icon="ele-Operation">调度日志</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-popconfirm title="确认删除?" @confirm="remove(scope.row)">
                <template #reference>
                  <el-button :disabled="scope.row.deleted === true" size="small" text type="danger">删除</el-button>
                </template>
              </el-popconfirm>
            </el-space>
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
          layout="jumper, next, pager, prev, sizes, total"
          @current-change="onHandleCurrentChange"
      />
      <save-scheduled ref="saveSchedule"/>
    </el-card>
  </div>
</template>

<script lang="ts" name="scheduledIndex" setup>
import {onMounted, reactive, ref} from "vue";
import {useScheduledApi} from "@renderer/api/scheduled";
import SaveScheduled from "@renderer/views/system/scheduled/components/saveScheduled.vue";

const router = window.$router;
const loading = ref(false)
const saveSchedule = ref(null)
const state = reactive({
  keywords: '',
  disabled: false,
  group: ''
})
const queryGroup = ref([])
const pagination = ref({
  current: 1,
  size: 20,
  total: 0,
})
const dataSource = ref()

const toLogView = () => {
  router.push("/system/scheduled/logs")
}
const query = () => {
  pagination.value.current = 1
  search({...pagination.value})
}
const getGroupList = () => {
  useScheduledApi().getGroups().then(res => {
    queryGroup.value = res.result.list
  })
}
const onHandleCurrentChange = (page) => {
  search(page)
}
const addScheduled = () => {
  saveSchedule.value.openDialog({
    title: '新增任务',
    submit: '保存',
    callback: () => search({...pagination.value})
  })
}
const onOpenEditScheduled = (row) => {
  saveSchedule.value.openDialog({
    title: '编辑任务',
    submit: '保存',
    callback: () => search({...pagination.value})
  }, row)
}
const updateStatus = (row) => {

}
const remove = (row) => {

}
const handleDropdownCommand = (command) => {
  console.log(command)
}
const search = (page) => {
  let params = {...state, ...page}
  useScheduledApi().getScheduledList(params).then(res => {
    dataSource.value = res.result.list
    pagination.value = {
      current: res.result.current,
      size: res.result.size,
      total: res.result.total
    }
    loading.value = false
  })
}
onMounted(() => {
  query()
  getGroupList()
})
</script>

<style scoped>

</style>