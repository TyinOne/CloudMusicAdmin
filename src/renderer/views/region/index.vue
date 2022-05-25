<template>
  <div class="system-region-container">
    <el-card shadow="hover">
      <div class="system-search mb15">
        <el-input v-model="state.keywords" clearable placeholder="请输入关键词"
                  size="default" style="max-width: 180px" @keydown.enter="query">
        </el-input>
        <el-select v-model="state.level" style="max-width: 180px" @change="query">
          <el-option :value="0" label="全部"/>
          <el-option v-for="item in levelLabel" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
        <el-button class="ml10" size="default" type="primary" @click="query">
          <SvgIcon name="ele-Search"></SvgIcon>
          {{ '查询' }}
        </el-button>
      </div>
      <el-table v-loading="loading" :data="dataSource" :load="load" :tree-props="{ children: 'children'}" height="calc(100vh - 240px)"
                lazy row-key="id"
                style="width: 100%">
        <el-table-column label="ID" prop="id" show-overflow-tooltip width="150"/>
        <el-table-column label="PID" prop="pid" show-overflow-tooltip width="100"/>
        <el-table-column label="简称" prop="name" show-overflow-tooltip width="140"/>
        <el-table-column label="全称" prop="fullName" show-overflow-tooltip/>
        <el-table-column label="纬度" prop="lat" show-overflow-tooltip/>
        <el-table-column label="经度" prop="lng" show-overflow-tooltip/>
        <el-table-column label="级别" prop="level" show-overflow-tooltip width="140">
          <template #default="scope">
            <el-tag class="link" type="success">{{ getLevelTag(scope.row.level) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template #default="scope">
            <el-button size="small" text type="primary">
              详情
            </el-button>
            <el-button size="small" text type="danger">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts" name="regionIndex" setup>
import {onMounted, reactive, ref} from "vue";
import {useRegionApi} from "@renderer/api/region";

const loading = ref(false);
const dataSource = ref([])
const levelLabel = [
  {
    label: '省级',
    value: 1
  },
  {
    label: '市级',
    value: 2
  },
  {
    label: '区级',
    value: 3
  },
]
const state = reactive({
  level: 0,
  keywords: ''
})
const query = () => {
  let {level, keywords} = state
  search({level, keywords})
}
const load = (row, treeNode, resolve) => {
  let params = {
    parentId: row.id
  }
  useRegionApi().getRegionList(params).then(res => {
    resolve(res.result.list)
  })
}
const search = (params) => {
  loading.value = true
  useRegionApi().getRegionList(params).then(res => {
    dataSource.value = res.result.list
    loading.value = false
  }).catch(e => {
    loading.value = false
  })
}
const getLevelTag = (level) => {
  switch (level) {
    case 1:
      return "省/直辖";
    case 2:
      return "市/区级";
    case 3:
      return "区/县级";
  }
}
onMounted(() => {
  query()
})
</script>

<style scoped>

</style>