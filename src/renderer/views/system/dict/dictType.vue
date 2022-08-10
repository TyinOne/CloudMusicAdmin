<template>
  <div class="system-dict-container">
    <el-card shadow="hover">
      <div class="system-search mb15">
        <el-input v-model="state.keywords" clearable placeholder="请输入关键词"
                  size="default" style="max-width: 180px"/>
        <el-select v-model="state.deleted"  @change="query">
          <el-option :value="false" label="正常"></el-option>
          <el-option :value="true" label="停用"></el-option>
        </el-select>
        <el-button class="ml10" size="default" type="primary" @click="query">
          <el-icon>
            <SvgIcon name="ele-Search"></SvgIcon>
          </el-icon>
          查询
        </el-button>
        <el-button class="ml10" size="default" type="primary" @click="query">
          <el-icon>
            <SvgIcon name="ele-Search"></SvgIcon>
          </el-icon>
          查询
        </el-button>
        <el-button class="ml10" size="default" type="success" @click="onOpenAddDictType">
          <el-icon>
            <SvgIcon name="ele-FolderAdd"></SvgIcon>
          </el-icon>
          新增分类
        </el-button>
      </div>
      <el-table v-loading="loading" :data="dataSource" height="calc(100vh - 280px)" style="width: 100%">
        <el-table-column label="ID" prop="id" width="60"/>
        <el-table-column label="字典名称" prop="dictLabel" width="120"/>
        <el-table-column label="字典类型" prop="dictType" width="120">
          <template #default="scope">
            <router-link :to="{path: '/system/dict/view/'+ scope.row.dictType}">
              <el-link :underline="false" type="primary">{{ scope.row.dictType }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="字典状态" prop="deleted" width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.deleted" type="warning">{{ '停用' }}</el-tag>
            <el-tag v-else type="success">{{ '正常' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="字典描述" prop="dictDescription"/>
        <el-table-column label="创建时间" prop="created" width="180"/>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button size="small" text type="primary" :disabled="scope.row.deleted === true" @click="onOpenEditDictType(scope.row)">编辑</el-button>
            <el-popconfirm title="确认删除此分类?" cancelButtonType="" @confirm="remove(scope.row)">
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
    <handle-dict-type ref="handleDictTypeRef"></handle-dict-type>
  </div>
</template>

<script name="systemDictType" setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import HandleDictType from "@renderer/views/system/dict/components/handleDictType.vue";
import {useDictApi} from "@renderer/api/dict";
import SvgIcon from "@renderer/components/svgIcon/index.vue";
import {ElMessage} from "element-plus";

const loading = ref(false)
const state = reactive({
  keywords: '',
  deleted: false
})
const dataSource = ref([])
const router = useRouter()
const handleDictTypeRef = ref(null)
const pagination = ref({
  current: 1,
  size: 20,
  total: 0,
})
const query = () => {
  pagination.value.current = 1
  search({...pagination.value})
}
const search = (page) => {
  loading.value = true
  let params = {
    ...state,
    size: page.size,
    current: page.current
  }
  useDictApi().getDictTypeList(params).then(res => {
    dataSource.value = res.result.list
    pagination.value = {
      current: res.result.current,
      size: res.result.size,
      total: res.result.total
    }
    loading.value = false
  })
}
const onOpenAddDictType = () => {
  handleDictTypeRef.value.openDialog({
    title: '新增分类',
    submit: '保存',
    callback: query
  })
}
const onOpenEditDictType = (row) => {
  handleDictTypeRef.value.openDialog({
    title: '新增分类',
    submit: '保存',
    callback: query
  }, row)
}
const remove = ({id}) => {
  useDictApi().removeDictType({id}).then(() => {
    ElMessage.success('已完成')
    search({...pagination.value})
  })
}
const onHandleCurrentChange = (page) => {
  search(page)
}
onMounted(() => {
  query()
})
</script>

<style scoped>

</style>