<template>
  <div class="system-version-container">
    <el-card shadow="hover">
      <div class="system-search mb15">
        <el-date-picker type="daterange" v-model="state.date" start-placeholder="开始日期"
                        end-placeholder="结束日期" value-format="YYYY-MM-DD" style="max-width: 240px"></el-date-picker>
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
      <el-table v-loading="loading" :data="dataSource" style="width: 100%" height="calc(100vh - 280px)">
        <el-table-column label="序号" width="80" show-overflow-tooltip type="index"/>
        <el-table-column label="版本号" width="120" show-overflow-tooltip prop="dictValue"/>
        <el-table-column label="强制更新" width="120" show-overflow-tooltip prop="dictValue"/>
        <el-table-column label="发布状态" width="120" show-overflow-tooltip prop="dictValue"/>
        <el-table-column label="文件状态" width="120" show-overflow-tooltip prop="dictValue"/>
        <el-table-column label="hash" show-overflow-tooltip prop="dictValue"/>
        <el-table-column label="MD5" show-overflow-tooltip prop="dictValue"/>
        <el-table-column label="更新日志" show-overflow-tooltip prop="dictDescription"/>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="primary" :disabled="scope.row.value === 'admin'" size="small" text>
              修改
            </el-button>
            <el-button type="danger" :disabled="scope.row.value === 'admin'" size="small" text>
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

<script name="versionIndex" setup lang="ts">
import {reactive, ref} from "vue";

const state = reactive({
  date: []
})
const loading = ref(false)
const dataSource = ref([])
let pagination = ref({
  current: 1,
  size: 20,
  total: 0,
})
const query = () => {

}
const onOpenAddVersion = () => {

}
const onHandleCurrentChange = (e) => {

}
</script>

<style scoped>
:deep(.el-range-editor) {
  height: var(--el-component-size)
}
</style>