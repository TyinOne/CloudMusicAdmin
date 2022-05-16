<template>
  <div class="system-add-role-container">
    <el-dialog v-model="isShowDialog" :title="dialogMessage.title" destroy-on-close draggable width="769px"
               custom-class="dialog-self">
      <el-radio-group :disabled="isEdit" v-model="type" size="small">
        <el-radio-button :label="0">菜单</el-radio-button>
        <el-radio-button :label="1">按钮</el-radio-button>
      </el-radio-group>
    </el-dialog>
  </div>

</template>

<script name="handleMenu" lang="ts" setup>
import {reactive, ref} from "vue";

const isShowDialog = ref(false)
const type = ref(0)
const isEdit = ref(false)
const dialogMessage = reactive({
  title: '',
  submit: '',
  message: '',
  formData: {
    id: ''
  },
  callback: () => {
  }
})
const openDialog = (message, row?) => {
  // console.log(message, row)
  dialogMessage.title = message.title
  dialogMessage.submit = message.submit
  dialogMessage.message = message.message
  dialogMessage.callback = message.callback
  if (message.init) initDetail(row, message.parentId)
  isShowDialog.value = true;
};
const initDetail = (row, parentId?) => {
  if (row) {
    isEdit.value = true
    console.log(row)
  }
  console.log(parentId)
}
defineExpose({
  openDialog
})
</script>

<style scoped>

</style>