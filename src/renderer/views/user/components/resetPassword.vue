<template>
  <div class="system-rest-container">
    <el-dialog v-model="isShowDialog" :destroy-on-close="true" :title="'修改密码'"
               class="dialog-self"
               draggable width="400px">
      <el-form label-position="left" label-width="60px">
        <el-form-item label="用户名:">{{ state.account }}</el-form-item>
        <el-form-item label="密 码:">
          <el-input v-model="state.password" :disabled="loading" placeholder="请输入新密码"/>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button :loading="loading" size="default" @click.stop="onCancel">关 闭</el-button>
					<el-button :loading="loading" size="default" type="primary"
                     @click.stop="onSubmit">保 存</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import {useUserApi} from "@renderer/api/user";
import {Md5} from "ts-md5";

const loading = ref(false)
const isShowDialog = ref(false)
const state = reactive({
  account: '',
  password: '',
  call: () => {
  }
})
const openDialog = (account: string, callback: () => void) => {
  loading.value = false
  isShowDialog.value = true
  state.account = account
  state.call = callback
}
const onSubmit = () => {
  loading.value = true
  let {account, password} = state
  useUserApi().resetPassword({account, password: Md5.hashStr(password)}).then(res => {
    loading.value = false
    closeDialog()
  }).catch(e => {
    loading.value = false
  })
}
const onCancel = () => {
  closeDialog()
}
const closeDialog = () => {
  state.password = ''
  state.account = ''
  state.call = () => {
  }
  loading.value = true
  isShowDialog.value = false
}

defineExpose({openDialog})
</script>

<style scoped>

</style>