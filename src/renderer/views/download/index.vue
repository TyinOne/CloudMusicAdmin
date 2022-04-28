<template>
  <div class="download-container">
    <el-card style="min-height: calc(100vh - 150px);max-height: calc(100vh - 150px)">
      <el-tabs
          v-model="activeName"
          class="tabs"
      >
        <el-tab-pane label="进行中" name="loading">
          进行中
        </el-tab-pane>
        <el-tab-pane label="已完成" name="finished">
          已完成
        </el-tab-pane>
        <el-tab-pane label="回收站" name="recycle">
          回收站
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import {ref} from "vue";

let activeName = ref('loading')

</script>
<script lang="ts">
export default {
  name: "downloadIndex"
}
</script>

<style lang="scss" scoped>
//.layout-main {
//  background-color: #fff !important;
//}
//.download-container {
//}
//:deep(.el-tabs__nav-scroll) {
//  background-color: #f6f6f6;
//}
//:deep(.el-tabs__item) {
//  background-color: #f8f8f8;
//}
//:deep(.is-active) {
//  background-color: white;
//}
</style>