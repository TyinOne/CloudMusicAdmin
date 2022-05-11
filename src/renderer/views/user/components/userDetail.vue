<template>
  <div class="system-user-detail-container">
    <el-dialog v-model="isShowDialog" :title="'用户详情'" v-if="isShowDialog" destroy-on-close draggable width="50%">
      <el-card style="border: unset" v-loading="loading" shadow="naver" :body-style="{ padding: '10px' }">
        <div
            style="padding: 0 20px 20px 20px;display: flex;align-items: center;justify-content: space-between;height: 80px">
          <update-picture :src="data.detail.avatar" :size="70" :circle="true" @confirm="confirmImage"/>
          <div style="width: 80%; padding: 0 20px">
            <p style="font-size: 20px; font-weight: bold;padding: 10px 0">{{ data.detail.account }}</p>
            <div style="display:flex;align-items: center">
              <el-tag round class="link" :type="data.detail.sex === 1 ? 'success' : 'danger'">
                {{ data.detail.sex === 1 ? '男' : '女' }}
              </el-tag>
              <p v-if="data.detail.age" style="padding: 10px 10px">{{ data.detail.age }}岁</p>
              <p v-else style="padding: 10px 10px">{{ '未知年龄' }}</p>
            </div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; width: 100%; padding: 0 20px">
          <el-form style="width: 45%;" label-width="75px" label-position="left">
            <el-form-item label="昵称:">
              <el-input spellcheck="false" v-model="data.detail.nickName"/>
            </el-form-item>
            <el-form-item label="手机号:">
              <el-input spellcheck="false" v-model="data.detail.phone"/>
            </el-form-item>
            <el-form-item label="邮箱:">
              <el-input spellcheck="false" v-model="data.detail.mail"/>
            </el-form-item>
            <el-form-item label="地区:">
              <el-cascader :options="regionLabel" v-model="data.detail.region" style="width: 100%"/>
            </el-form-item>
          </el-form>
          <el-form style="width: 45%;" label-width="75px" label-position="left">
            <el-form-item label="出生年月:">
              <el-date-picker v-model="data.detail.birth" valueFormat="YYYY-MM-DD" style="width: 100%"/>
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
    region: [],
    sex: 0,
    age: '',
    roles: []
  },
  imageUpdate: {
    src: '',
    uri: '',
    fileName: '',
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
      data.imageUpdate = {
        src: '',
        uri: '',
        fileName: '',
      }
    }).catch(e => {
      isShowDialog.value = false;
      loading.value = false
    })
  }).catch(e => {
    isShowDialog.value = false;
    loading.value = false
  })
}
const onSubmit = () => {
  loading.value = true
  let {nickName, mail, phone, region, birth, account} = data.detail
  let {uri, fileName} = data.imageUpdate
  let params = {
    account: account,
    nickName: nickName,
    mail: mail,
    phone: phone,
    region: (!region) || region.length === 0 ?  '' : region[region.length - 1],
    birth: birth,
    avatar: {
      uri: uri,
      fileName: fileName
    }
  }
  useUserApi().saveAccount(params).then(async (res) => {
    console.log(res)
    loading.value = false
  }).catch(e => {
    loading.value = false
  })
}
const onCancel = () => {
  closeDialog()
}
const closeDialog = () => {
  loading.value = true
  isShowDialog.value = false
  data.callback()
}
const confirmImage = (e) => {
  data.detail.avatar = e.src
  data.imageUpdate = e
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