<template>
  <div class="system-dict-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-input clearable placeholder="请输入关键词" v-model="state.keywords"
                  size="default" style="max-width: 180px"></el-input>
        <el-input clearable placeholder="请输入字典Key" v-model="state.dictTypeKey"
                  size="default" style="max-width: 180px"></el-input>
        <el-select placeholder="请选择类型" v-model="state.dictType"
                   size="default" style="max-width: 180px" @change="query">
          <el-option value="" label="全部(字典类型)"></el-option>
          <el-option v-for="item in dictOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
        <el-button class="ml10" size="default" type="primary" @click="query">
          <el-icon>
            <SvgIcon name="ele-Search"></SvgIcon>
          </el-icon>
          查询
        </el-button>
        <el-button class="ml10" size="default" type="success" @click="onOpenAddDict">
          <el-icon>
            <SvgIcon name="ele-FolderAdd"></SvgIcon>
          </el-icon>
          新增字典
        </el-button>
        <el-button class="ml10" size="default" type="success" @click="onOpenAddDict">
          <el-icon>
            <SvgIcon name="ele-FolderAdd"></SvgIcon>
          </el-icon>
          新增分类
        </el-button>
      </div>
      <el-table v-loading="loading" :data="dataSource" style="width: 100%" height="calc(100vh - 280px)">
        <el-table-column label="ID" width="60" prop="id"/>
        <el-table-column label="字典类型" width="90" prop="dictLabel">
          <template #default="scope">
            <el-tooltip
                class="box-item"
                effect="light"
                :content="scope.row.dictType"
                placement="left"
            >
              {{scope.row.dictLabel}}
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="字典Key" width="220" show-overflow-tooltip prop="dictKey"/>
        <el-table-column label="字典Value" show-overflow-tooltip prop="dictValue"/>
        <el-table-column label="描述" show-overflow-tooltip prop="dictDescription"/>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button :disabled="scope.row.value === 'admin'" size="small" type="text"
                       @click="onOpenEditDict(scope.row)">修改
            </el-button>
            <el-button :disabled="scope.row.value === 'admin'" size="small" type="text">
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
      >
      </el-pagination>
    </el-card>
    <handle-dict ref="handleDictRef"></handle-dict>
  </div>
</template>
<script lang="ts" setup name="DictIndex">

import {onMounted, reactive, ref} from "vue";
import {useDictApi} from "@renderer/api/dict";
import {Label} from "@renderer/types/interface";
import HandleDict from "@renderer/views/system/dict/components/handleDict.vue";
import SvgIcon from "@renderer/components/svgIcon/index.vue";


let state = reactive({
  dictType: '',
  dictTypeKey: '',
  keywords: ''
})
let handleDictRef = ref()
let dictOptions = ref<Array<Label>>([])
let dataSource = ref([])
let loading = ref(false)
let pagination = ref({
  current: 1,
  size: 20,
  total: 0,
})
const query = () => {
  getData(pagination)
}
const getData = (page) => {
  loading.value = true
  let {keywords, dictTypeKey, dictType} = state
  let params = {
    dictTypeKey: dictTypeKey,
    dictType: dictType,
    keywords: keywords,
    current: page.current,
    size: page.size
  }
  useDictApi().getDictList(params).then(res => {
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
const onHandleCurrentChange = async (value: number) => {
  pagination.value.current = value;
  await getData(pagination.value)
}
const getDictLabel = () => {
  useDictApi().getDictLabel().then(res => {
    dictOptions.value = res.result.list
    getData(pagination.value)
  })
}
const onOpenAddDict = () => {
  handleDictRef.value.openDialog({
    title: '新增字典',
    submit: '新 增',
    callback: query
  })
}
const onOpenEditDict = (row) => {
  handleDictRef.value.openDialog({
    title: '编辑字典',
    submit: '保 存',
    callback: query
  }, row)
}
onMounted(() => {
  getDictLabel()
})
</script>
<style scoped>

</style>