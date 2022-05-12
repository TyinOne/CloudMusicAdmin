<template>
  <div class="system-add-role-container">
    <el-dialog v-model="isShowDialog" :title="dialogMessage.title" destroy-on-close draggable width="769px">
123
    </el-dialog>
  </div>

</template>

<script name="handleMenu" lang="ts" setup>
import {reactive, ref} from "vue";

const isShowDialog = ref(false)

const dialogMessage = reactive({
  title: '',
  submit: '',
  callback: () => {}
})
const openDialog = (message, row?) => {
  console.log(message)
  dialogMessage.title = message.title
  dialogMessage.submit = message.submit
  dialogMessage.callback = message.callback
  if (message.init) initDetail(row)
  isShowDialog.value = true;
};
const initDetail = (row) => {

}
defineExpose({
  openDialog
})
</script>

<style scoped>

</style>