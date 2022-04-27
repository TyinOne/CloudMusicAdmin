<template>
  <div class="system-redis-container">
    <el-card shadow="hover">
      {{ state.redis }}
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import {useServerApi} from "@renderer/api/server";
import {onMounted, reactive} from "vue";
let state = reactive({
  redis: {}
})

const getRedisInfo = () => {
  useServerApi().getRedisInfo().then(res => {
    state.redis = res.result
  })

}
onMounted(() => {
  getRedisInfo()
})
</script>

<script lang="ts">
export default {
  name: "redisView"
}
</script>

<style scoped>

</style>