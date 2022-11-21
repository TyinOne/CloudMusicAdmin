<template>
  <el-dialog v-model="isShowDialog" class="dialog-self-log" destroy-on-close draggable title="详情" width="80%">
    <div class="content">
      <el-row :gutter="10">
        <el-col :span="12">
          <div style="display:flex;align-items: baseline;">
            <p style="width: 80px;font-weight: bolder">{{ '发起时间:' }}</p>
            <p>{{ state.time }}</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="display:flex;align-items: baseline;">
            <p style="width: 80px;font-weight: bolder">{{ '发起人:' }}</p>
            <p>{{ state.account }}</p>
          </div>
        </el-col>

        <el-col :span="12">
          <div style="display:flex;align-items: baseline;">
            <p style="width: 80px;font-weight: bolder">{{ '请求地址:' }}</p>
            <p>{{ state.uri }}</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="display:flex;align-items: baseline;">
            <p style="width: 80px;font-weight: bolder">{{ 'IP地址:' }}</p>
            <p>{{ state.address }}</p>
          </div>
        </el-col>

        <el-col :span="12">
          <p class="copy-text" style="width: 150px;font-weight: bolder" @click="copyText(state.headers)">
            {{ '请求头(点击复制):' }}</p>
          <el-scrollbar style="height: 200px;">
            <json-viewer :expanded="true" :value="state.headers"></json-viewer>
          </el-scrollbar>
          <p class="copy-text" style="width: 150px;font-weight: bolder" @click="copyText(state.request)">
            {{ '请求参数(点击复制):' }}</p>
          <el-scrollbar style="height: 150px;">
            <json-viewer :expanded="true" :value="state.request"></json-viewer>
          </el-scrollbar>
        </el-col>
        <el-col :span="12">
          <p class="copy-text" style="width: 150px;font-weight: bolder" @click="copyText(state.response)">
            {{ '返回值(点击复制):' }}</p>
          <el-scrollbar height="60vh">
            <json-viewer :expand-depth=5 :value="state.response"></json-viewer>
          </el-scrollbar>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script lang="ts" name="handleLogDetail" setup>
import {reactive, ref} from "vue";
import {useServerApi} from "@renderer/api/server";
import commonFunction from "@renderer/utils/commonFunction";

const isShowDialog = ref(false);
const openDialog = (id: number) => {
  searchLogDetail(id).then(res => {
    console.log(res.result)
    isShowDialog.value = true
    state.request = JSON.parse(res.result.params)
    state.response = JSON.parse(res.result.result)
    state.headers = JSON.parse(res.result.headers)
    state.time = res.result.time
    state.account = res.result.account
    state.uri = res.result.uri
    state.address = res.result.address
  })
}
const state = reactive({
  request: "",
  response: "",
  headers: "",
  account: "",
  time: "",
  uri: "",
  address: ""

})

const searchLogDetail = async (id: number) => {
  return useServerApi().getLogDetail(id)
}

const copyText = (str: string) => {
  console.log(JSON.stringify(str))
  commonFunction().copyText(JSON.stringify(str))
}
defineExpose({
  openDialog
})
</script>

<style>
.dialog-self-log {
  top: 10vh;
  height: 80%;
  max-height: 80%;
}
</style>
<style lang="scss" scoped>
.copy-text {
  -webkit-touch-callout: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer;

  &:hover {
    color: var(--el-color-primary);
  }
}

:deep(.jv-code) {
  padding: 0;
}

:deep(.el-col) {
  padding-top: 5px;
}

.content {
  height: 85%;
}
</style>