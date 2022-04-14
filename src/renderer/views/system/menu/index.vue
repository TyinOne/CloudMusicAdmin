<template>
  <div class="system-role-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-input size="default" placeholder="请输入菜单名称" style="max-width: 180px"
                  v-model:model-value="state.keywords" clearable></el-input>
        <el-select size="default" placeholder="请选择角色"
                   v-model:model-value="state.roleId"
                   style="max-width: 180px">
          <el-option :value="0" label="全部"></el-option>
          <el-option
              v-for="item in state.roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
        </el-select>
        <el-select size="default" placeholder="请选择状态"
                   v-model:model-value="state.disabled"
                   style="max-width: 100px">
          <el-option value="" label="全部"></el-option>
          <el-option value="false" label="启用"></el-option>
          <el-option value="true" label="禁用"></el-option>
        </el-select>
        <el-button size="default" type="primary" class="ml10" @click="searchMenu">
          <el-icon>
            <ele-Search/>
          </el-icon>
          查询
        </el-button>
        <el-button size="default" type="success" class="ml10" @click="onOpenAddMenu">
          <el-icon>
            <ele-FolderAdd/>
          </el-icon>
          新增菜单
        </el-button>
      </div>
      <el-table row-key="path" :data="state.dataSource" style="width: 100%"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column label="菜单名称" show-overflow-tooltip>
          <template #default="scope">
            <SvgIcon :name="scope.row['metaIcons']"></SvgIcon>
            <span class="ml10">{{ scope.row['metaTitle'] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由路径" show-overflow-tooltip></el-table-column>
        <el-table-column prop="component" label="组件路径" show-overflow-tooltip></el-table-column>
        <el-table-column prop="security" label="权限标识" show-overflow-tooltip></el-table-column>
        <el-table-column prop="metaRoles" label="角色标识" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sort" label="排序" show-overflow-tooltip></el-table-column>
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
import getService from "@renderer/views/system/menu/service";
import HandleMenu from "@renderer/views/system/menu/components/handleMenu.vue";

const {
  state, handleMenuRef, searchMenu, onOpenAddMenu, onOpenEditMenu, onRowDel, getMenuType
} = getService()


</script>

<script lang="ts">
export default {
  name: "SystemMenu"
}
</script>

<style scoped>

</style>