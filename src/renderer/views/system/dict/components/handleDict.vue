<template>
  <div class="system-handle-role-container">
    <el-dialog v-model="isShowDialog" :title="dialogMessage.title" custom-class="dialog-self" destroy-on-close draggable
               width="400px">
      <el-form label-position="left" label-width="90px">
        <el-form-item label="字典类型:">
          <el-select v-model="dialogMessage.data.dictType" style="width: 100%;">
            <el-option v-for="item in dictOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="字典Key:">
          <el-input v-model="dialogMessage.data.dictKey" maxlength="25" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="字典Value:">
          <el-input v-model="dialogMessage.data.dictValue" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="字典描述:">
          <el-input v-model="dialogMessage.data.dictDescription" maxlength="70" placeholder="请输入描述" show-word-limit
                    type="textarea"></el-input>
        </el-form-item>
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

<script lang="ts" name="handleDict" setup>
import {reactive, ref} from "vue";
import {useDictApi} from "@renderer/api/dict";
import {Label} from "@renderer/types/interface";

let isShowDialog = ref(false)
let loading = ref(false)
let dialogMessage = reactive({
  title: '',
  submit: '',
  data: {
    id: null,
    dictType: '',
    dictKey: '',
    dictValue: '',
    dictDescription: ''
  },
  callback: () => {
  }
})
let dictOptions = ref<Array<Label>>([])

const onSubmit = () => {
  let {id, dictType, dictKey, dictValue, dictDescription} = dialogMessage.data
  let params = {id, dictType, dictKey, dictValue, dictDescription}
  console.log(params)
  useDictApi().saveDict(params).then(res => {
    onCancel()
  })
}
const onCancel = () => {
  isShowDialog.value = false
  dialogMessage.callback()
}
const openDialog = (message, row?) => {
  isShowDialog.value = true
  dialogMessage.title = message.title
  dialogMessage.submit = message.submit
  dialogMessage.callback = message.callback
  useDictApi().getDictLabel().then(res => {
    dictOptions.value = res.result.list
    if (row) {
      initData(row)
    } else {
      dialogMessage.data.dictType = ''
      dialogMessage.data.dictKey = ''
      dialogMessage.data.dictValue = ''
      dialogMessage.data.dictDescription = ''
    }
  })
}
const initData = (row) => {
  dialogMessage.data.id = row.id
  dialogMessage.data.dictType = row.dictType
  dialogMessage.data.dictKey = row.dictKey
  dialogMessage.data.dictValue = row.dictValue
  dialogMessage.data.dictDescription = row.dictDescription
}
defineExpose({
  openDialog
})
</script>

<style scoped>

</style>