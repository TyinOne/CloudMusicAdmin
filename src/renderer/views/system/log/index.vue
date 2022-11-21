<template>
  <div class="system-log-container">
    <el-card shadow="hover">
      <div class="system-search mb15">
        <el-date-picker v-model="state.date" end-placeholder="结束日期" start-placeholder="开始日期"
                        style="max-width: 240px" type="daterange" value-format="YYYY-MM-DD"/>
        <el-input v-model="state.keywords" clearable placeholder="请输入URI关键词"
                  size="default" style="max-width: 180px"/>
        <el-select :clearable="true" @change="searchLog" placeholder="请选择请求类型" v-model="state.requestMethod">
          <el-option v-for="item in requestMethodArray" :value="item.value" :label="item.label">{{item.label}}</el-option>
        </el-select>
        <el-select :clearable="true" @change="searchLog" placeholder="请选择请求结果" v-model="state.status">
          <el-option v-for="item in statusArray" :value="item.value" :label="item.label">{{item.label}}</el-option>
        </el-select>
        <el-button v-permission="'sys:log:query'" class="ml10" size="default" type="primary" @click="searchLog">
          <SvgIcon name="ele-Search"/>
          查询
        </el-button>
      </div>
      <el-table v-loading="loading" :data="dataSource" height="calc(100vh - 280px)" style="width: 100%">
        <el-table-column label="ID" prop="id" width="60"/>
        <el-table-column label="IP地址" prop="ip" show-overflow-tooltip width="120"/>
        <el-table-column label="请求类型" prop="requestMethod" width="100">
          <template #default="scope">
            <el-tag :type="requestMethodTag(scope.row)">{{ scope.row['requestMethod'] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="请求地址" prop="uri" show-overflow-tooltip/>
        <el-table-column label="请求时间" prop="created" show-overflow-tooltip width="160"/>
        <el-table-column label="执行方法" prop="method" show-overflow-tooltip/>
        <el-table-column label="状态" prop="status" show-overflow-tooltip width="60">
          <template #default="scope">
            <el-tag v-if="scope.row.status" type="success">{{ '成功' }}</el-tag>
            <el-tag v-else type="danger">{{ '失败' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="耗时" prop="elapsed" show-overflow-tooltip width="80"/>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button text type="primary" @click="openDetail(scope.row)">详情</el-button>
            <!--            <el-button :disabled="scope.row.value === 'admin'" size="small" text>-->
            <!--              删除-->
            <!--            </el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :hide-on-single-page="false"
          :layout="'prev, pager, next, jumper, ->, total'"
          :pager-count="5"
          :total="pagination.total"
          background
          class="mt15"
          small
          @current-change="onHandleCurrentChange"
      >
      </el-pagination>
    </el-card>
    <handle-log-detail ref="handleLogDetail"/>
  </div>
</template>

<script lang="ts" setup>

import {onMounted, reactive, ref, unref} from "vue";
import {useServerApi} from "@renderer/api/server";
import SvgIcon from "@renderer/components/svgIcon/index.vue";
import HandleLogDetail from "@renderer/views/system/log/components/handleLogDetail.vue";

let handleLogDetail = ref(null);

const requestMethodArray = ref([
  {
    label: 'GET',
    value: 'GET'
  },
  {
    label: 'POST',
    value: 'POST'
  },
  {
    label: 'PUT',
    value: 'PUT'
  },
  {
    label: 'DELETE',
    value: 'DELETE'
  }
])
const statusArray = ref([
  {
    label: '成功',
    value: true
  },
  {
    label: '失败',
    value: false
  }
])
let state = reactive({
  date: [],
  keywords: '',
  requestMethod: undefined,
  status: undefined
})
let dataSource = ref([])
let loading = ref(false)
let pagination = ref({
  current: 1,
  size: 20,
  total: 0,
})
const searchLog = () => {
  let page = unref(pagination)
  page.current = 1
  getData(page)
}
const getData = (page) => {
  const [startDate, endDate] = state.date
  let params = {
    startDate, endDate,
    method: state.requestMethod,
    status: state.status,
    keywords: state.keywords,
    current: page.current,
    size: page.size
  }
  loading.value = true
  useServerApi().getLogList(params).then(res => {
    dataSource.value = res.result.list
    pagination.value = {
      current: res.result.current,
      size: res.result.size,
      total: res.result.total
    }
    loading.value = false
  }).catch(e => {
    loading.value = false
  })
}
const requestMethodTag = (row) => {
  switch (row.requestMethod) {
    case 'GET':
      return ''
    case 'POST':
      return 'success'
    case 'PUT':
      return 'warning'
    case 'DELETE':
      return 'danger'
  }
}
const onHandleCurrentChange = (val: number) => {
  pagination.value.current = val;
  getData(pagination.value)
};
const openDetail = (row) => {
  console.log(row.id)
  handleLogDetail.value.openDialog(row.id)
}
onMounted(() => {
  searchLog()
})

</script>

<script lang="ts">
export default {
  name: "logIndex"
}
</script>

<style scoped>
:deep(.el-range-editor) {
  height: var(--el-component-size)
}
</style>