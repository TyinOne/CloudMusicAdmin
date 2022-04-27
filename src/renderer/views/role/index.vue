<template>
  <div class="system-role-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-input size="default" placeholder="请输入角色名称" style="max-width: 180px"
                  v-model:model-value="keywords" clearable></el-input>
        <el-button size="default" type="primary" class="ml10" @click="searchRole">
          <el-icon>
            <ele-Search/>
          </el-icon>
          查询
        </el-button>
        <el-button size="default" type="success" class="ml10" @click="onOpenAddRole">
          <el-icon>
            <ele-FolderAdd/>
          </el-icon>
          新增角色
        </el-button>
      </div>
      <el-table :data="dataSource" style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="序号" width="60"/>
        <el-table-column prop="name" label="角色名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="value" label="角色标识" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sort" label="排序" show-overflow-tooltip></el-table-column>
        <el-table-column prop="disabled" label="角色状态" show-overflow-tooltip>
          <template #default="scope">
            <el-tag class="link" type="success" v-if="!scope.row.disabled">启用</el-tag>
            <el-tag class="link" type="info" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="角色描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="created" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button :disabled="scope.row.value === 'admin'" size="small" type="text"
                       @click="onOpenEditRole(scope.row)">修改
            </el-button>
            <el-button :disabled="scope.row.value === 'admin'" size="small" type="text" @click="onRowDel(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          :hide-on-single-page="false"
          :small="true"
          @current-change="onHandleCurrentChange"
          class="mt15"
          :pager-count="5"
          v-model:current-page="pagination.current"
          background
          v-model:page-size="pagination.size"
          layout="total, prev, pager, next, jumper"
          :total="pagination.total"
      >
      </el-pagination>
    </el-card>
    <handle-role ref="handleRoleRef"></handle-role>
  </div>
</template>
<script setup lang="ts">
import getService from "@renderer/views/role/service";
import HandleRole from '@renderer/views/role/components/handleRole.vue'

const {
  handleRoleRef,
  keywords,
  dataSource,
  pagination,
  loading,
  searchRole,
  onHandleCurrentChange,
  onOpenAddRole,
  onOpenEditRole,
  onRowDel

} = getService()
</script>
<script lang="ts">
export default {
  name: "SystemRoles"
}
</script>

<style scoped>

</style>