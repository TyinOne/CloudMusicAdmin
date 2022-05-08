<template>
  <div class="system-user-detail-container">
    <el-dialog v-model="isShowDialog" :title="'用户详情'" destroy-on-close draggable width="50%">
      <el-card style="border: unset" v-loading="loading" shadow="naver" :body-style="{ padding: '10px' }">
        <div style="padding: 0 20px 20px 20px ;display: flex;align-items: center;justify-content: space-between">
          <el-avatar :size="70" :src="data.detail.avatar"/>
          <div style="width: 80%">
            <p style="font-size: 20px; font-weight: bold;padding: 10px 0">{{ data.detail.account }}</p>
            <div style="display:flex;align-items: center">
              <el-tag round class="link" :type="data.detail.sex === 1 ? 'success' : 'danger'">
                {{ data.detail.sex === 1 ? '男' : '女' }}
              </el-tag>
              <p style="padding: 10px 10px">{{ data.detail.age }}岁</p>
            </div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; width: 100%; padding: 0 20px">
          <el-form style="width: 45%;" label-width="75px" label-position="left">
            <el-form-item label="昵称:">
              <el-input v-model="data.detail.nickName"/>
            </el-form-item>
            <el-form-item label="手机号:">
              <el-input v-model="data.detail.phone"/>
            </el-form-item>
            <el-form-item label="邮箱:">
              <el-input v-model="data.detail.mail"/>
            </el-form-item>
            <el-form-item label="地区:">
              <el-cascader :options="regionLabel" v-model="data.detail.region" style="width: 100%"/>
            </el-form-item>
          </el-form>
          <el-form style="width: 45%;" label-width="75px" label-position="left">
            <el-form-item label="生日:">
              <el-date-picker v-model="data.detail.birth" disabled style="width: 100%"/>
            </el-form-item>
            <el-form-item label="身份证号:" disabled>
              <el-input v-model="data.detail.idCardNo" disabled></el-input>
            </el-form-item>
            <el-form-item label="姓名:" disabled>
              <el-input v-model="data.detail.idCardName" disabled></el-input>
            </el-form-item>
            <el-form-item label="户籍地址:" disabled>
              <el-input v-model="data.detail.idCardAddress" disabled></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
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

<script setup lang="ts">

import {reactive, ref} from "vue";
import {useUserApi} from "@renderer/api/user";
import {useRegionApi} from "@renderer/api/region";

let loading = ref(true)
let isShowDialog = ref(false)
let regionLabel = ref([])
let data = reactive({
  detail: {
    account: '',
    avatar: '',
    birth: '',
    idCardAddress: '',
    idCardName: '',
    idCardNo: '',
    lastLogin: '',
    lastLoginTime: '',
    mail: '',
    nickName: '',
    phone: '',
    region: '',
    sex: '',
    age: '',
    roles: []
  },
  callback: () => {
  }
})
const openDialog = (account, callback) => {
  isShowDialog.value = true;
  data.callback = callback
  initDetail(account)
}
const initDetail = (account) => {
  useRegionApi().getRegionLabel().then(res => {
    regionLabel.value = res.result.list
    useUserApi().getUserDetail({account: account}).then(res => {
      loading.value = false
      data.detail = res.result
    }).catch(e => {
      loading.value = false
    })
  }).catch(e => {
    loading.value = false
  })
}
const onSubmit = () => {

}
const onCancel = () => {
  closeDialog()
}
const closeDialog = () => {
  loading.value = true
  isShowDialog.value = false
  data.callback()
}
defineExpose({
  openDialog
})
</script>
<script lang="ts">
export default {
  name: "userDetail"
}
</script>

<style scoped>

</style>