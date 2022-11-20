<template>
  <div class="system-dict-container">
    <el-card shadow="hover">
      <div class="system-search mb15">
        <el-input v-model="state.keywords" clearable placeholder="请输入关键词"
                  size="default" style="max-width: 180px"></el-input>
        <el-input v-model="state.dictKey" clearable placeholder="请输入字典Key"
                  size="default" style="max-width: 180px"></el-input>
        <el-select v-model="state.dictType" placeholder="请选择类型"
                   size="default" style="max-width: 180px" @change="query">
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
      </div>
      <el-table v-loading="loading" :data="dataSource" height="calc(100vh - 280px)" style="width: 100%">
        <el-table-column label="ID" prop="id" width="60"/>
        <el-table-column label="字典类型" prop="dictLabel" width="120">
          <template #default="scope">
            <el-tooltip
                :content="scope.row.dictType"
                class="box-item"
                effect="light"
                placement="left"
            >
              {{ scope.row.dictLabel }}
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="字典Key" prop="dictKey" show-overflow-tooltip width="220"/>
        <el-table-column label="字典Value" prop="dictValue" show-overflow-tooltip/>
        <el-table-column label="描述" prop="dictDescription" show-overflow-tooltip/>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button :disabled="scope.row.value === 'admin'" size="small" text type="primary"
                       @click="onOpenEditDict(scope.row)">修改
            </el-button>
            <el-popconfirm title="确认删除此分类?" cancelButtonType="" @confirm="remove(scope.row)">
              <template #reference>
                <el-button size="small" text type="danger">删除</el-button>
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
    <handle-dict ref="handleDictRef"></handle-dict>
  </div>
</template>
<script lang="ts" name="systemDict" setup>
import {onMounted, reactive, ref} from "vue";
import {useDictApi} from "@renderer/api/dict";
import {Label} from "@renderer/types/interface";
import HandleDict from "@renderer/views/system/dict/components/handleDict.vue";
import SvgIcon from "@renderer/components/svgIcon/index.vue";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";

const router = window.$router;
const route = useRoute();
let state = reactive({
  dictType: '',
  dictKey: '',
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
  search(pagination)
}
const search = (page) => {
  loading.value = true
  let {keywords, dictKey, dictType} = state
  let params = {
    dictKey: dictKey,
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
    console.error(e)
    loading.value = false
  })
}
const onHandleCurrentChange = async (value: number) => {
  pagination.value.current = value;
  await search(pagination.value)
}
const getDictLabel = (type?) => {
  useDictApi().getDictLabel().then(res => {
    dictOptions.value = res.result.list
    if (type && type !== 0) state.dictType = type
    search(pagination.value)
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
const remove = ({id}) => {
  useDictApi().removeDict({id}).then(() => {
    ElMessage.success('已完成')
    search({...pagination.value})
  })
}
onMounted(() => {
  console.log(route)
  getDictLabel(route.query.dictType)
})
</script>
<style scoped>

</style>