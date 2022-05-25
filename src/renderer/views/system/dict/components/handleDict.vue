<template>
  <div class="system-handle-role-container">
    <el-dialog custom-class="dialog-self" v-model="isShowDialog" :title="dialogMessage.title" destroy-on-close draggable width="400px">
      <el-form label-width="90px" label-position="left">
        <el-form-item label="字典类型:">
          <el-select style="width: 100%;" v-model="dialogMessage.data.dictType">
            <el-option v-for="item in dictOptions" :value="item.value" :label="item.label" :key="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="字典Key:">
          <el-input maxlength="25" v-model="dialogMessage.data.dictKey" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="字典Value:">
          <el-input v-model="dialogMessage.data.dictValue" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="字典描述:">
          <el-input maxlength="70" show-word-limit type="textarea" v-model="dialogMessage.data.dictDescription" placeholder="请输入描述"></el-input>
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

<script name="handleDict" setup lang="ts">
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