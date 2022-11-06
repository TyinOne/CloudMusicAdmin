<template>
  <div class="system-scheduled-container">
    <el-card shadow="hover">
      <div class="system-search mb15">
        <el-input v-model="state.keywords" clearable placeholder="请输入关键词"
                  size="default" style="max-width: 180px"/>
        <el-select v-model="state.group" @change="query" placeholder="请选择分组">
          <el-option :value="false" label="正常"></el-option>
          <el-option :value="true" label="停用"></el-option>
        </el-select>
        <el-select v-model="state.status" @change="query" placeholder="请选择状态">
          <el-option :value="false" label="正常"></el-option>
          <el-option :value="true" label="停用"></el-option>
        </el-select>
        <el-button class="ml10" size="default" type="primary" @click="query">
          <el-icon>
            <SvgIcon name="ele-Search"></SvgIcon>
          </el-icon>
          查询
        </el-button>
        <el-button class="ml10" size="default" type="primary" plain @click="addScheduled">
          <el-icon>
            <SvgIcon name="ele-Plus"></SvgIcon>
          </el-icon>
          新增任务
        </el-button>
        <el-button class="ml10" size="default" type="success" plain @click="toLogView">
          <el-icon>
            <SvgIcon name="ele-Operation"></SvgIcon>
          </el-icon>
          调度日志
        </el-button>
      </div>
      <el-table v-loading="loading" :data="dataSource" height="calc(100vh - 280px)" style="width: 100%">
        <el-table-column label="ID" prop="id" width="60"/>
        <el-table-column label="任务名称" prop="name"/>
        <el-table-column label="任务组名" prop="name"/>
        <el-table-column label="目标方法" prop="name"/>
        <el-table-column label="cron表达式" prop="name"/>
        <el-table-column label="状态" prop="name" width="180"/>
        <el-table-column label="创建时间" prop="created" width="180"/>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button size="small" text type="primary" :disabled="scope.row.deleted === true"
                       @click="onOpenEditScheduled(scope.row)">编辑
            </el-button>
            <el-popconfirm title="确认删除此分类?" @confirm="remove(scope.row)">
              <template #reference>
                <el-button size="small" text type="danger" :disabled="scope.row.deleted === true">删除</el-button>
              </template>
            </el-popconfirm>
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
  </div>
</template>

<script name="scheduledIndex" setup>
import {reactive, ref} from "vue";
import {useRouter} from "vue-router";
const router = useRouter();
const loading = ref(false)
const state = reactive({})
const pagination = ref({
  current: 1,
  size: 20,
  total: 0,
})
const dataSource = ref()

const toLogView = () => {
  console.log(123)
  router.push("/system/scheduled/logs")
}
const query = () => {
  pagination.value.current = 1
  search({...pagination.value})
}
const onHandleCurrentChange = (page) => {
  search(page)
}
const addScheduled = () => {

}
const onOpenEditScheduled = (row) => {

}
const updateStatus = (row) => {

}
const remove = (row) => {

}

const search = (page) => {

}
</script>

<style scoped>

</style>