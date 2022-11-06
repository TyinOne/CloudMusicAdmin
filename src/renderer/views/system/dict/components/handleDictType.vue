<template>
  <el-dialog v-model="isShowDialog" :title="dialogMessage.title" class="dialog-self" destroy-on-close draggable
             width="400px">
    <el-form label-position="left" label-width="90px">
      <el-form-item label="字典类型:">
        <el-input v-model="dialogMessage.data.dictType" maxlength="25" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="字典名称:">
        <el-input v-model="dialogMessage.data.dictLabel" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="字典描述:">
        <el-input v-model="dialogMessage.data.dictDescription" maxlength="70" placeholder="请输入描述" show-word-limit
                  type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
				<span class="dialog-footer">
					<el-button :loading="loading" size="default" @click.stop="isShowDialog = false">取 消</el-button>
					<el-button :loading="loading" size="default" type="primary"
                     @click.stop="onSubmit">{{ dialogMessage.submit }}</el-button>
				</span>
    </template>
  </el-dialog>
</template>

<script name="handleDictType" lang="ts" setup>
import {reactive, ref} from "vue";
import {useDictApi} from "@renderer/api/dict";
import {ElMessage} from "element-plus";

const isShowDialog = ref(false)
const loading = ref(false)
const dialogMessage = reactive({
  title: '',
  submit: '',
  data: {
    id: null,
    dictType: '',
    dictLabel: '',
    dictDescription: ''
  },
  callback: () => {
  }
})
const onSubmit = () => {
  loading.value = true
  useDictApi().saveDictType({...dialogMessage.data}).then(() => {
    ElMessage.success('保存成功！')
    isShowDialog.value = false
    loading.value = false
    dialogMessage.callback()
  }).catch(e => {
    console.error(e)
    loading.value = false
  })
}
const openDialog = (message, row?) => {
  isShowDialog.value = true
  dialogMessage.callback = message.callback
  dialogMessage.title = message.title
  dialogMessage.submit = message.submit
  if (row) initData(row)
}
const initData = (row) => {
  dialogMessage.data = {...row}
}
defineExpose({
  openDialog
})
</script>

<style scoped>

</style>