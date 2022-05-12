<template>
  <div class="system-role-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-input v-model:model-value="state.keywords" clearable placeholder="请输入菜单名称"
                  size="default" style="max-width: 180px"></el-input>
        <el-select v-model:model-value="state.roleId" placeholder="请选择角色"
                   size="default"
                   style="max-width: 180px">
          <el-option :value="0" label="全部"></el-option>
          <el-option
              v-for="item in state.roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
        </el-select>
        <el-select v-model:model-value="state.disabled" placeholder="请选择状态"
                   size="default"
                   style="max-width: 100px">
          <el-option label="全部" value=""></el-option>
          <el-option label="启用" value="false"></el-option>
          <el-option label="禁用" value="true"></el-option>
        </el-select>
        <el-button class="ml10" size="default" type="primary" @click="searchMenu">
          <el-icon>
            <ele-Search/>
          </el-icon>
          查询
        </el-button>
        <el-button class="ml10" size="default" type="success" @click="onOpenAddMenu">
          <el-icon>
            <ele-FolderAdd/>
          </el-icon>
          新增菜单
        </el-button>
      </div>
      <el-table v-loading="loading" :data="state.dataSource"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" row-key="path"
                style="width: 100%" height="calc(100vh - 237px)"
      >
        <el-table-column label="菜单名称" width="180" show-overflow-tooltip>
          <template #default="scope">
            <span class="ml10">{{ scope.row['metaTitle'] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图标" prop="metaIcons" width="60" show-overflow-tooltip>
          <template #default="scope">
            <SvgIcon :name="scope.row['metaIcons']"></SvgIcon>
          </template>
        </el-table-column>
        <el-table-column label="路由路径" prop="path" show-overflow-tooltip></el-table-column>
        <el-table-column label="组件路径" prop="component" show-overflow-tooltip></el-table-column>
        <el-table-column label="权限标识" prop="security" show-overflow-tooltip></el-table-column>
        <el-table-column label="排序" prop="sort" show-overflow-tooltip></el-table-column>
        <el-table-column label="类型" show-overflow-tooltip>
          <template #default="scope">
            <el-tag class="link" type="success">{{ getMenuType(scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template #default="scope">
            <el-button size="small" type="text"
                       @click="onOpenEditMenu(scope.row)">新增
            </el-button>
            <el-button size="small" type="text"
                       @click="onOpenEditMenu(scope.row)">修改
            </el-button>
            <el-button size="small" type="text" @click="onRowDel(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <handle-menu ref="handleMenuRef"/>
  </div>
</template>
<script lang="ts" setup>

import SvgIcon from "@renderer/components/svgIcon/index.vue";
import getService from "@renderer/views/menu/service";
import HandleMenu from "@renderer/views/menu/components/handleMenu.vue";

const {
  state, handleMenuRef, loading, searchMenu, onOpenAddMenu, onOpenEditMenu, onRowDel, getMenuType
} = getService()


</script>

<script lang="ts">
export default {
  name: "SystemMenu"
}
</script>

<style scoped>

</style>