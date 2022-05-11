<template>
  <div class="system-user-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-input clearable placeholder="请输入关键词" v-model="state.name"
                  size="default" style="max-width: 180px" @keydown.enter="query">
        </el-input>
        <el-select v-model="state.roleId" @change="query" style="max-width: 180px">
          <el-option :value="0" label="全部"/>
          <el-option v-for="item in roleLabel" :value="item.value" :key="item.value" :label="item.label"/>
        </el-select>
        <el-select v-model="state.disabled" @change="query" placeholder="是否禁用" style="max-width: 120px">
          <el-option :value="-1" label="全部"/>
          <el-option :value="0" label="启用"/>
          <el-option :value="1" label="禁用"/>
        </el-select>
        <el-button class="ml10" size="default" type="primary" @click="query">
          <el-icon>
            <ele-Search/>
          </el-icon>
          {{'查询'}}
        </el-button>
      </div>

      <el-table v-loading="loading" :data="dataSource" style="width: 100%" height="calc(100vh - 280px)">
        <el-table-column label="序号" width="60" type="index"/>
        <el-table-column label="账号" width="120" show-overflow-tooltip prop="account"/>
        <el-table-column label="昵称" width="100" show-overflow-tooltip prop="nickName"/>
        <el-table-column label="邮箱" width="140" show-overflow-tooltip prop="mail"/>
        <el-table-column label="手机" width="140" show-overflow-tooltip prop="phone"/>
        <el-table-column label="角色" show-overflow-tooltip prop="roles">
          <template #default="scope">
            <el-tag v-if="scope.row.roles" v-for="item in (scope.row.roles.split(','))" class="link" :type="'success'">
              {{ item }}
            </el-tag>
            <el-tag v-else class="link" type="danger">{{ '未分配' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="最后登录时间" show-overflow-tooltip prop="lastLoginTime"/>
        <el-table-column label="是否禁用" show-overflow-tooltip prop="disabled">
          <template #default="scope">
            <el-tag class="link" :type="scope.row.disabled ? 'danger':'success'">{{
                scope.row.disabled ? '禁用' : '启用'
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template #default="scope">
            <el-button size="small" type="text" @click="showDetail(scope.row.account)">
              详情
            </el-button>
            <el-button size="small" type="text" style="color: #fd7171">
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
<script lang="ts" setup>
import {onMounted, reactive, ref, unref} from "vue";
import {useUserApi} from "@renderer/api/user";
import {useRoleApi} from "@renderer/api/role";
import UserDetail from "@renderer/views/user/components/userDetail.vue";
import {Label} from "@renderer/types/interface";
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
<script lang="ts">
export default {
  name: "userIndex"
}
</script>

<style scoped>

</style>