<template>
  <div class="system-user-container">
    <el-card shadow="hover">
      <div class="system-search mb15">
        <el-input v-model="state.name" clearable placeholder="请输入关键词"
                  size="default" style="max-width: 180px" @keydown.enter="query">
        </el-input>
        <el-select v-model="state.roleId" style="max-width: 180px" @change="query">
          <el-option :value="0" label="全部"/>
          <el-option v-for="item in roleLabel" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
        <el-select v-model="state.disabled" placeholder="是否禁用" style="max-width: 120px" @change="query">
          <el-option :value="-1" label="全部"/>
          <el-option :value="0" label="启用"/>
          <el-option :value="1" label="禁用"/>
        </el-select>
        <el-button class="ml10" size="default" type="primary" @click="query">
          <SvgIcon name="ele-Search"></SvgIcon>
          {{ '查询' }}
        </el-button>
        <el-button class="ml10" size="default" type="primary" text @click="toInvite">
          <SvgIcon name="ele-Link"></SvgIcon>
          {{ '邀请码' }}
        </el-button>
      </div>
      <el-table v-loading="loading" :data="dataSource" height="calc(100vh - 280px)" style="width: 100%">
        <el-table-column label="序号" type="index" width="60"/>
        <el-table-column label="账号" prop="account" show-overflow-tooltip width="120"/>
        <el-table-column label="昵称" prop="nickName" show-overflow-tooltip width="100"/>
        <el-table-column label="邮箱" prop="mail" show-overflow-tooltip width="140"/>
        <el-table-column label="手机" prop="phone" show-overflow-tooltip width="140"/>
        <el-table-column label="角色" prop="roles" show-overflow-tooltip>
          <template #default="scope">
            <el-space wrap>
              <el-tag v-for="item in (scope.row.roles.split(','))" v-if="scope.row.roles" :type="'success'" class="link">
                {{ item }}
              </el-tag>
              <el-tag v-else class="link" type="danger">{{ '未分配' }}</el-tag>
            </el-space>
          </template>
        </el-table-column>
        <el-table-column label="最后登录时间" prop="lastLoginTime" show-overflow-tooltip width="160"/>
        <el-table-column label="是否禁用" prop="disabled" show-overflow-tooltip width="80">
          <template #default="scope">
            <el-tag :type="scope.row.disabled ? 'danger':'success'" class="link">{{
                scope.row.disabled ? '禁用' : '启用'
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="showDetail(scope.row.account)">
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
      >
      </el-pagination>
      <user-detail ref="userDetailRef"/>
    </el-card>
  </div>
</template>
<script lang="ts" setup name="userIndex">
import {onMounted, reactive, ref, unref} from "vue";
import {useUserApi} from "@renderer/api/user";
import {useRoleApi} from "@renderer/api/role";
import UserDetail from "@renderer/views/user/components/userDetail.vue";
import {Label} from "@renderer/types/interface";
import {useRouter} from "vue-router";

const router = useRouter()
let loading = ref(false)
let dataSource = ref([])
let roleLabel = ref<Array<Label>>([])
let userDetailRef = ref(null)
let state = reactive({
  name: '',
  disabled: -1,
  roleId: 0
})
let pagination = ref({
  current: 1,
  size: 20,
  total: 0,
})
const query = () => {
  let page = unref(pagination)
  page.current = 1
  getInfo(page)
}
const toInvite = () => {
  router.push("/system/user/invite")
}
const getInfo = (page) => {
  loading.value = true
  let params = {
    name: state.name,
    disabled: state.disabled,
    roleId: state.roleId,
    size: page.size,
    current: page.current,
  }
  useUserApi().getUserList(params).then(res => {
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
const getRoleLabel = () => {
  useRoleApi().getRoleLabel().then(res => {
    roleLabel.value = res.result.list
    query()
  })
}
const onHandleCurrentChange = (val: number) => {
  pagination.value.current = val;
  getInfo(pagination.value)
};
const showDetail = (row) => {
  userDetailRef.value.openDialog(row, query)
}
onMounted(() => {
  getRoleLabel()
})
</script>

<style scoped>

</style>