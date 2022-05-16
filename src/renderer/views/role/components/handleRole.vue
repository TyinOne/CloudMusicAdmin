<template>
  <div class="system-add-role-container">
    <el-dialog custom-class="dialog-self" v-model="isShowDialog" :title="dialogMessage.title" destroy-on-close draggable width="769px">
      <el-form ref="formRef" v-loading="loading" :model="form" :rules="rules" label-width="90px" size="default"
               style="display: flex">
        <div :style="dialogMessage.init ? {width: '50%'} : {width: '100%'}">
          <el-row :gutter="12">
            <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24" class="mb20">
              <el-form-item label="角色名称" prop="name">
                <el-input v-model="form.name" clearable placeholder="请输入角色名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24" class="mb20">
              <el-form-item label="权限标识" prop="value">
                <el-input v-model="form.value" clearable placeholder="请输入权限标识"></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24" class="mb20">
              <el-form-item label="排序">
                <el-input-number v-model="form.sort" :max="999" :min="0" class="w100" controls-position="right"
                                 placeholder="请输入排序"/>
              </el-form-item>
            </el-col>
            <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24" class="mb20">
              <el-form-item label="角色状态">
                <el-switch v-model="form.disabled" active-text="禁用" inactive-text="启用"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24" class="mb20">
              <el-form-item label="角色描述">
                <el-input v-model="form.description" maxlength="150" placeholder="请输入角色描述" type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="dialogMessage.init" style="width: 50%">
          <el-row>
            <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24" class="mb20">
              <el-form-item label="菜单权限">
                <el-scrollbar always height="280px">
                  <el-tree ref="menuTree" :data="menuData" :props="menuProps" check-on-click-node
                           class="menu-data-tree" node-key="value" show-checkbox/>
                </el-scrollbar>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>

      <template #footer>
				<span class="dialog-footer">
					<el-button :loading="loading" size="default" @click.stop="onCancel">取 消</el-button>
					<el-button :loading="loading" size="default" type="primary"
                     @click.stop="onSubmit">{{ dialogMessage.submit }}</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import {reactive, ref} from "vue";
import {useRoleApi} from '@renderer/api/role';
import {useMenuApi} from "@renderer/api/menu";

const menuTree = ref()
let isShowDialog = ref(false)
let dialogMessage = ref({
  title: '',
  submit: '',
  init: false,
  callback: () => {
  }
})
const openDialog = (message, row?) => {
  form.value = {
    id: undefined,
    name: '',
    value: '',
    sort: null,
    disabled: false,
    description: '',
  }
  dialogMessage.value = message
  if (dialogMessage.value.init) {
    initDetail(row)
  }
  isShowDialog.value = true;
  getMenuData(row);
};
const formRef = ref()
const rules = reactive(
    {
      name: [
        {required: true, message: '请输入角色名称', trigger: 'blur'},
        {min: 3, max: 8, message: '请控制在3到8个字符', trigger: 'blur'},
      ],
      value: [
        {required: true, message: '请输入权限标识', trigger: 'blur'},
      ]
    }
)
let loading = ref(false)
let form = ref({
  id: undefined,
  name: '',
  value: '',
  sort: null,
  disabled: false,
  description: '',
})
let menuData = ref([])
const menuProps = {
  children: 'children',
  label: 'label',
  disabled: (data) => {
    return data.id === 1
  }
}
const closeDialog = () => {
  console.log(form.value)
  isShowDialog.value = false;
  dialogMessage.value.callback();
};
const onSubmit = () => {
  loading.value = true
  formRef.value.validate((valid) => {
    let params = {
      id: form.value.id,
      name: form.value.name,
      value: form.value.value,
      sort: form.value.sort,
      disabled: form.value.disabled,
      description: form.value.description,
      menu: [],
      half: []
    }
    if (valid) {
      if (dialogMessage.value.init) {
        params.menu = menuTree.value.getCheckedKeys(false);
        params.half = menuTree.value.getHalfCheckedKeys()
        useRoleApi().updateRole(params).then(res => {
          closeDialog()
          loading.value = false
        }).catch(e => {
          loading.value = false
        })
      } else {
        useRoleApi().addRole(params).then(res => {
          closeDialog()
          loading.value = false
        }).catch(e => {
          loading.value = false
        })
      }
    } else {
      loading.value = false
    }
  })
}
const initDetail = (row) => {
  form.value.id = row.id
  form.value.name = row.name
  form.value.value = row.value
  form.value.sort = row.sort
  form.value.disabled = row.disabled
  form.value.description = row.description
}
const onCancel = () => {
  closeDialog()
}
const getMenuData = (row) => {
  let params = {
    id: undefined
  }
  if (row && row.id) {
    params.id = row.id
    useMenuApi().getMenuLabel(params).then(res => {
      menuData.value = res.result.list
      menuTree.value!.setCheckedKeys(res.result.selected, false)
    })
  }
}
defineExpose({
  openDialog
})
</script>
<script lang="ts">
export default {
  name: "handlerRole"
}
</script>

<style scoped>

</style>