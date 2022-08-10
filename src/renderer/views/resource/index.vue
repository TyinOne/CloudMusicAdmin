<template>
  <div class="system-resource-container">
    <el-card shadow="hover">
      <div class="system-search mb15">
        <el-input v-model="state.keywords" clearable placeholder="请输入关键词"
                  size="default" style="max-width: 180px" @keydown.enter="query">
        </el-input>
        <el-button class="ml10" size="default" type="primary" @click="query">
          <SvgIcon name="ele-Search"></SvgIcon>
          {{ '查询' }}
        </el-button>
        <el-button class="ml10" size="default" type="success">
          <SvgIcon name="ele-FolderAdd"></SvgIcon>
          {{ '新增资源' }}
        </el-button>
      </div>
      <el-table v-loading="loading" :data="dataSource" height="calc(100vh - 280px)" style="width: 100%">
        <el-table-column label="序号" type="index" width="60"/>
        <el-table-column label="资源名称" prop="account" show-overflow-tooltip width="120"/>
        <el-table-column label="资源状态" prop="account" show-overflow-tooltip width="120"/>
        <el-table-column label="运行环境" prop="account" show-overflow-tooltip width="120"/>
        <el-table-column label="MD5" prop="account" show-overflow-tooltip/>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button size="small" text type="primary">
              下载
            </el-button>
            <el-button size="small" text type="primary">
              详情
            </el-button>
            <el-button size="small" text type="danger">
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
  </div>
</template>

<script lang="ts" name="resourceIndex" setup>
import {onMounted, reactive, ref, unref} from "vue";

let loading = ref(false)
let dataSource = ref([])
const state = reactive({
  keywords: ''
})
const pagination = ref({
  current: 1,
  size: 20,
  total: 0,
})
const onHandleCurrentChange = async (val: number) => {
  pagination.value.current = val;
  search(unref(pagination))
}
const query = () => {
  let page = unref(pagination)
  page.current = 1
  search(page)
}
const search = (page) => {
  console.log('search')
}
onMounted(() => {
  query()
})
</script>

<style scoped>

</style>