<template>
  <div class="system-user-code-container">
    <el-card shadow="hover">
      <div class="system-search mb15">
        <el-input v-model="state.createBy" placeholder="创建者" style="max-width: 120px"></el-input>
        <el-input v-model="state.useBy" placeholder="使用者" style="max-width: 120px"></el-input>
        <el-select v-model="state.invalid" placeholder="是否有效" style="max-width: 120px" @change="query">
          <el-option :value="false" label="有效"/>
          <el-option :value="true" label="无效"/>
        </el-select>
        <el-select v-model="state.used" placeholder="是否使用" style="max-width: 120px" @change="query">
          <el-option :value="false" label="未使用"/>
          <el-option :value="true" label="已使用"/>
        </el-select>
        <el-button class="ml10" size="default" type="primary" @click="query">
          <SvgIcon name="ele-Search"></SvgIcon>
          {{ '查询' }}
        </el-button>
        <el-button class="ml10" size="default" type="success" @click="OpenGenerate">
          <SvgIcon name="ele-Plus"></SvgIcon>
          {{ '生成邀请码' }}
        </el-button>
      </div>
      <el-table v-loading="loading" :data="dataSource" height="calc(100vh - 280px)" style="width: 100%">
        <el-table-column label="序号" prop="id" width="60"/>
        <el-table-column label="邀请码" prop="code" show-overflow-tooltip width="120"/>
        <el-table-column label="角色" prop="roleName" show-overflow-tooltip width="120">
          <template #default="scope">
            <el-tag>{{ scope.row.roleName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="createBy" show-overflow-tooltip width="100"/>
        <el-table-column label="使用人" prop="useBy" show-overflow-tooltip width="100"/>
        <el-table-column label="是否有效" prop="invalid" show-overflow-tooltip width="90">
          <template #default="scope">
            <el-tag v-if="!scope.row.invalid" type="success">{{ '可使用' }}</el-tag>
            <el-tag v-else type="danger">{{ '已失效' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否使用" prop="used" show-overflow-tooltip width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.used" type="success">{{ '已使用' }}</el-tag>
            <el-tag v-else type="danger">{{ '未使用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="生成时间" prop="created" show-overflow-tooltip width="160"/>
        <el-table-column label="过期时间" prop="expirationTime" show-overflow-tooltip/>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button v-if="false" size="small" text type="primary">
              详情
            </el-button>
            <el-popconfirm cancelButtonType="" title="确认清除此邀请码?" @confirm="remove(scope.row)">
              <template #reference>
                <el-button size="small" text type="danger">
                  清除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
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
    <generate-code ref="generateCode"/>
  </div>
</template>

<script lang="ts" name="inviteIndex" setup>
import {onMounted, reactive, ref, unref} from "vue";
import {useInviteCodeApi} from "@renderer/api/invite";
import {ElMessage} from "element-plus";
import GenerateCode from "@renderer/views/user/components/generateCode.vue";

const loading = ref(true)

const generateCode = ref(null)

const pagination = ref({
  current: 1,
  size: 20,
  total: 0,
})

const state = reactive({
  useBy: '',
  createBy: '',
  invalid: false,
  used: false
})

/**
 * code: "S59DO9"
 * createBy: "TyinZero"
 * created: "2022-07-25 09:41:04"
 * expirationTime: "2022-07-25 10:11:04"
 * id: "1"
 * roleName: "系统管理员"
 * status: 1
 * useBy: ""
 * used: false
 */
const dataSource = ref([])

const onHandleCurrentChange = (val: number) => {
  pagination.value.current = val;
  getInfo(pagination.value)
}

const getInfo = async (page) => {
  let params = {
    useBy: state.useBy,
    createBy: state.createBy,
    invalid: state.invalid,
    used: state.used,
    size: page.size,
    current: page.current,
  }
  useInviteCodeApi().getInviteCodeList(params).then(res => {
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

const OpenGenerate = () => {
  generateCode.value.openDialog()
}
const remove = (row) => {
  const {id} = row
  useInviteCodeApi().removeInviteCode({id: Number(id)}).then(res => {
    let page = unref(pagination)
    ElMessage.success("清除成功")
    getInfo(page)
  })
}
const query = () => {
  let page = unref(pagination)
  page.current = 1
  getInfo(page)
}
onMounted(() => {
  query()
})
</script>

<style scoped>

</style>