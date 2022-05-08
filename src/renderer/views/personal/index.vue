<template>
  <div class="personal-container">
    <el-card shadow="hover">
      <!--      <div>{{ user.info }}</div>-->
      <el-card>
        <el-form>
          <el-form-item label="用户头像:">
            <div class="avatar-uploader">
              <div class="el-upload">
                <el-image v-if="user.info.avatar" :src="user.info.avatar" alt="" class="avatar"/>
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus/>
                </el-icon>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="用户名:">
            {{ user.info.account }}
          </el-form-item>
          <el-form-item label="昵称:">
            {{ user.info.nickName }}
          </el-form-item>
          <el-form-item label="邮箱:">
            {{ user.info.mail }}
          </el-form-item>
          <el-form-item label="身份:">
            {{ user.info.role }}
          </el-form-item>
          <el-form-item label="联系方式:">
            {{ user.info.phone }}
          </el-form-item>
          <el-form-item label="生日:">
            {{ user.info.birth }}
          </el-form-item>
        </el-form>
      </el-card>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import {useUserApi} from "@renderer/api/user";
import {onMounted, reactive, ref} from "vue";
import type {UploadFile} from 'element-plus'
import {Plus} from "@element-plus/icons-vue";

let user = reactive({
  info: {
    account: "",
    nickName: "",
    avatar: "",
    phone: "",
    mail: "",
    role: "",
    area: "",
    ipAddress: "",
    birth: ""
  }
})
const disabled = ref(false)
const dialogVisible = ref(false)
const getUserInfo = () => {
  useUserApi().getPersonalDetail().then(res => {
    user.info = res.result
  })
}
const handleRemove = (file: UploadFile) => {
  console.log(file)
}

const handlePictureCardPreview = (file: UploadFile) => {
  user.info.avatar = file.url!
  dialogVisible.value = true
}
onMounted(() => {
  getUserInfo()
})
</script>
<script lang="ts">
export default {
  name: "personalView"
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

:deep(.avatar-uploader .el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

:deep(.avatar-uploader .el-upload:hover) {
  border-color: var(--el-color-primary);
}

:deep(.el-icon.avatar-uploader-icon) {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>