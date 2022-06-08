<template>
  <div class="system-log-container">
    <el-card shadow="hover">
      <div class="system-search mb15">
        <el-date-picker v-model="options.date" end-placeholder="结束日期" start-placeholder="开始日期"
                        style="max-width: 240px" type="daterange" value-format="YYYY-MM-DD"></el-date-picker>
        <el-input clearable placeholder="请输入关键词"
                  size="default" style="max-width: 180px"></el-input>
        <el-button v-permission="'sys:log:query'" class="ml10" size="default" type="primary" @click="query">
          <SvgIcon name="ele-Search"></SvgIcon>
          查询
        </el-button>
      </div>
      <el-table v-loading="loading" :data="dataSource" height="calc(100vh - 280px)" style="width: 100%">
        <el-table-column label="ID" prop="id" width="100"/>
        <el-table-column label="IP地址" prop="ip" show-overflow-tooltip width="140"/>
        <el-table-column label="请求地址" prop="uri" show-overflow-tooltip/>
        <el-table-column label="请求时间" prop="created" show-overflow-tooltip width="160"/>
        <el-table-column label="执行方法" prop="method" show-overflow-tooltip/>
        <el-table-column label="执行耗时" prop="elapsed" show-overflow-tooltip width="100"/>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button v-permission="'sys:log:detail'" text type="primary">详情</el-button>
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
          :pager-count="5"
          :total="pagination.total"
          background
          class="mt15"
          layout="total, prev, pager, next, jumper"
          small
          @current-change="onHandleCurrentChange"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts" setup>

import {onMounted, reactive, ref, unref} from "vue";
import {useServerApi} from "@renderer/api/server";
import SvgIcon from "@renderer/components/svgIcon/index.vue";

let options = reactive({
  date: []
})
let dataSource = ref([])
let loading = ref(false)
let pagination = ref({
  current: 1,
  size: 20,
  total: 0,
})
const query = () => {
  const [startDate, endDate] = options.date
}
const searchLog = () => {
  let page = unref(pagination)
  page.current = 1
  getData(page)
}
const getData = (page) => {
  let params = {
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
const onHandleCurrentChange = (val: number) => {
  pagination.value.current = val;
  getData(pagination.value)
};
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