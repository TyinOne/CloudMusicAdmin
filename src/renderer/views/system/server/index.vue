<template>
  <div v-loading="state.loading" class="system-server-container">
    <el-card shadow="hover">
      {{ state }}
      <div style="display: flex">
        <el-card>
          <template #header>
            <div>
              <span>CPU</span>
            </div>
          </template>
        </el-card>
        <el-card>2</el-card>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import {useServerApi} from "@renderer/api/server";
import {onMounted, reactive} from "vue";

let state = reactive({
  server: {},
  loading: false
})

const getServerConfig = () => {
  state.loading = true
  useServerApi().getServerConfig().then(res => {
    state.server = res.result
    state.loading = false
  }).catch(e => {
    state.loading = false
  })
}

onMounted(() => {
  getServerConfig()
})
</script>

<script lang="ts">
export default {
  name: "serverView"
}
</script>

<style scoped>

</style>