<template>
  <div class="system-log-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-date-picker type="daterange" v-model="options.date" start-placeholder="开始日期"
                        end-placeholder="结束日期" value-format="YYYY-MM-DD" style="max-width: 240px"></el-date-picker>
        <el-input clearable placeholder="请输入关键词"
                  size="default" style="max-width: 180px"></el-input>
        <el-button class="ml10" size="default" type="primary" @click="query">
          <el-icon>
            <ele-Search/>
          </el-icon>
          查询
        </el-button>
      </div>
      <el-table v-loading="loading" :data="dataSource" style="width: 100%" height="calc(100vh - 280px)">
        <el-table-column label="ID" width="60" prop="id"/>
        <el-table-column label="IP地址" width="120" show-overflow-tooltip prop="ip"/>
        <el-table-column label="请求地址" show-overflow-tooltip prop="uri"/>
        <el-table-column label="请求时间" width="160" show-overflow-tooltip prop="created"/>
        <el-table-column label="执行方法" show-overflow-tooltip prop="method"/>
        <el-table-column label="执行耗时" show-overflow-tooltip prop="elapsed"/>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button :disabled="scope.row.value === 'admin'" size="small" type="text">详情
            </el-button>
<!--            <el-button :disabled="scope.row.value === 'admin'" size="small" type="text">-->
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
          :small="true"
          :total="pagination.total"
          background
          class="mt15"
          layout="total, prev, pager, next, jumper"
          @current-change="onHandleCurrentChange"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts" setup>

import {onMounted, reactive, ref, unref} from "vue";
import {useServerApi} from "@renderer/api/server";
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

</style>