<template>
  <div class="system-add-version-container">
    <el-dialog v-model="isShowDialog" :title="'新建版本'" class="dialog-self" destroy-on-close draggable
               width="569px" @close="onCancel">
      <el-form v-loading="loading" label-width="90px">
        <el-form-item label="检查文件:">
          <el-upload ref="uploadRef" :file-list="fileList" :httpRequest="uploadJson"
                     :limit="1" :on-exceed="handleExceed"
                     :on-remove="removeJson" accept=".json" style="width: 100%">
            <el-button v-if="fileList.length === 0" type="primary">选择文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="更新文件:">
          <el-input v-model="state.fromDate.name" readonly/>
        </el-form-item>
        <el-form-item label="Hash:">
          <el-input v-model="state.fromDate.hash" readonly/>
        </el-form-item>
        <el-form-item label="版本号:">
          <el-input v-model="state.fromDate.version" readonly/>
        </el-form-item>
        <el-form-item label="更新包:">
          <el-upload ref="uploadPackageRef" :file-list="packageList" :httpRequest="uploadPackage"
                     :limit="1" :on-exceed="handleExceedPackage"
                     :on-remove="removePackage" accept=".zip, .exe" style="width: 100%">
            <el-button v-if="packageList.length === 0" type="primary">选择文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="md5:">
          <el-input v-model="state.fromDate.md5" readonly/>
        </el-form-item>
        <el-form-item label="强制更新:">
          <el-switch v-model="state.fromDate.forced"/>
        </el-form-item>
        <el-form-item label="更新日志:">
          <el-input v-model="state.fromDate.updateLog" placeholder="多条信息逗号隔开" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
          <span class="dialog-footer">
            <el-button :loading="loading" size="default" @click.stop="isShowDialog = false">取 消</el-button>
            <el-button :loading="loading" size="default" type="primary"
                       @click.stop="onSubmit">{{ '提交' }}</el-button>
          </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" name="AddVersion" setup>
import {reactive, ref} from "vue";
import {ElMessage, genFileId, UploadInstance, UploadProps, UploadRawFile} from "element-plus";
import {useCommonApi} from "@renderer/api/common";
import {useVersionApi} from "@renderer/api/version";

const isShowDialog = ref(false)
const loading = ref(false)
const uploadRef = ref<UploadInstance>(null)
const uploadPackageRef = ref<UploadInstance>(null)
const fileList = ref([])
const packageList = ref([])
const state = reactive({
  fromDate: {
    name: '',
    hash: '',
    version: '',
    forced: false,
    md5: '',
    src: '',
    fileName: '',
    uri: '',
    updateLog: '',
  }
})

const openDialog = () => {
  isShowDialog.value = true
  fileList.value = []
  packageList.value = []
  state.fromDate = {
    name: '',
    hash: '',
    version: '',
    forced: false,
    md5: '',
    src: '',
    fileName: '',
    uri: '',
    updateLog: '',
  }
}


const handleExceed: UploadProps['onExceed'] = (files) => {
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadRef.value!.handleStart(file)
}
const handleExceedPackage: UploadProps['onExceed'] = (files) => {
  uploadPackageRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadPackageRef.value!.handleStart(file)
}
const uploadJson = ({file}) => {
  if (file.type !== 'application/json') {
    ElMessage.error('仅支持 JSON 文件类型')
    fileList.value = []
    uploadRef.value!.clearFiles()
    return
  }
  loading.value = true
  let fd = new FormData()
  fd.append('updateJson', file)
  useCommonApi().parseUpdateJson(fd).then(res => {
    state.fromDate.version = res.result.version
    state.fromDate.name = res.result.name
    state.fromDate.hash = res.result.hash
    loading.value = false
  })
}
const removeJson = () => {
  state.fromDate.version = ''
  state.fromDate.name = ''
  state.fromDate.hash = ''
}
const uploadPackage = ({file}) => {
  console.log(file.type)
  if (file.type !== 'application/x-zip-compressed' && file.type !== 'application/x-msdownload') {
    uploadPackageRef.value!.clearFiles()
    packageList.value = []
    ElMessage.error('仅支持 ZIP/EXE 文件类型')
    return
  }
  loading.value = true
  let fd = new FormData()
  fd.append('updatePackage', file)
  useCommonApi().uploadPackage(fd).then(res => {
    state.fromDate.md5 = res.result.md5
    state.fromDate.src = res.result.src
    state.fromDate.fileName = res.result.fileName
    state.fromDate.uri = res.result.uri
    loading.value = false
  })
}
const removePackage = () => {
  state.fromDate.md5 = ''
}

const onSubmit = () => {
  const params = {
    ...state.fromDate
  }
  console.log(params)
  useVersionApi().addVersion(params).then(res => {
    ElMessage.success('保存成功！')
    isShowDialog.value = false
  })
}
const onCancel = () => {
  uploadRef.value!.clearFiles()
  uploadPackageRef.value!.clearFiles()
}
defineExpose({
  openDialog
})
</script>

<style scoped>
:deep(.el-upload) {
  display: unset;
}

:deep(.el-form-item) {
  padding-bottom: 18px;
  margin-bottom: unset !important;
}

:deep(.el-upload-list) {
  max-height: 100%;
  margin: unset;
}

:deep(.el-upload-list__item) {
  margin: unset;
}

</style>