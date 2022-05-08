<template>
  <div class="system-role-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-input v-model:model-value="keywords" clearable placeholder="请输入角色名称"
                  size="default" style="max-width: 180px"></el-input>
        <el-button class="ml10" size="default" type="primary" @click="searchRole">
          <el-icon>
            <ele-Search/>
          </el-icon>
          查询
        </el-button>
        <el-button class="ml10" size="default" type="success" @click="onOpenAddRole">
          <el-icon>
            <ele-FolderAdd/>
          </el-icon>
          新增角色
        </el-button>
      </div>
      <el-table v-loading="loading" :data="dataSource"  style="width: 100%" height="calc(100vh - 280px)">
        <el-table-column label="序号" type="index" width="60"/>
        <el-table-column label="角色名称" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="角色标识" prop="value" show-overflow-tooltip></el-table-column>
        <el-table-column label="排序" prop="sort" show-overflow-tooltip></el-table-column>
        <el-table-column label="角色状态" prop="disabled" show-overflow-tooltip>
          <template #default="scope">
            <el-tag v-if="!scope.row.disabled" class="link" type="success">启用</el-tag>
            <el-tag v-else class="link" type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="角色描述" prop="description" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" prop="created" show-overflow-tooltip></el-table-column>
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
    <handle-role ref="handleRoleRef"></handle-role>
  </div>
</template>
<script lang="ts" setup>
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