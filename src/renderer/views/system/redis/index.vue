<template>
  <div class="system-redis-container">
    <div>
      <el-card shadow="never">
        <template #header>
          <div style="max-height: 16px">
            <span>Redis基础信息</span>
          </div>
        </template>
        <el-descriptions :column="4">
          <el-descriptions-item label="redis版本">{{ state.redis.info.redis_version }}</el-descriptions-item>
          <el-descriptions-item label="运行模式">{{
              state.redis.info.redis_mode === "standalone" ? "单机" : "集群"
            }}
          </el-descriptions-item>
          <el-descriptions-item label="端口">{{ state.redis.info.tcp_port }}</el-descriptions-item>
          <el-descriptions-item label="客户端数">{{ state.redis.info.connected_clients }}</el-descriptions-item>

          <el-descriptions-item label="运行时间(天)">{{ state.redis.info.uptime_in_days }}</el-descriptions-item>
          <el-descriptions-item label="使用内存">{{ state.redis.info.used_memory_human }}</el-descriptions-item>
          <el-descriptions-item label="使用CPU">{{
              parseFloat(state.redis.info.used_cpu_user_children).toFixed(2) + '%'
            }}
          </el-descriptions-item>
          <el-descriptions-item label="内存配置">{{ state.redis.info.maxmemory_human }}</el-descriptions-item>

          <el-descriptions-item label="AOF是否开启">{{ state.redis.info.aof_enabled }}</el-descriptions-item>
          <el-descriptions-item label="RDB是否成功">{{
              state.redis.info.rdb_last_bgsave_status === '0' ? '否' : '是'
            }}
          </el-descriptions-item>
          <el-descriptions-item label="Key数量">{{ state.redis.dbSize }}</el-descriptions-item>
          <el-descriptions-item label="网络入口/出口">
            {{ state.redis.info.instantaneous_input_kbps + '/' + state.redis.info.instantaneous_output_kbps }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
    <div style="display: flex;justify-content: space-between; margin-top: 10px">
      <el-card style="width: 49%" shadow="never">
        <template #header>
          <div style="max-height: 16px">
            <span>命令统计</span>
          </div>
        </template>
        <div class="command-box" style="height:300px;width:100%;">
          <div ref="commandEcharts" style="padding-top: 20px;height:100%;width:100%;"></div>
        </div>
      </el-card>
      <el-card style="width: 49%" shadow="never">
        <template #header>
          <div style="max-height: 16px">
            <span>内存信息</span>
          </div>
        </template>
        <div class="mem-box" style="height:300px;width:100%;">
          <div ref="memEcharts"  style="padding-top: 20px;height:100%;width:100%;"></div>
        </div>
      </el-card>
    </div>
    <!--    <el-card shadow="never">-->
    <!--    {{ state.redis }}-->
    <!--    </el-card>-->
  </div>
</template>

<script lang="ts" setup>
import {useServerApi} from "@renderer/api/server";
import {onMounted, reactive, ref} from "vue";
import * as echart from 'echarts';

let commandEcharts = ref(null);
let memEcharts = ref(null);
let state = reactive({
  redis: {
    info: {},
    dbSize: 0,
    commandStats: []
  }
})

const initEcharts = () => {
  let mem = echart.init(memEcharts.value)
  let command = echart.init(commandEcharts.value)
  command.setOption({
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    series: [
      {
        name: "命令",
        type: "pie",
        roseType: "radius",
        radius: [15, 95],
        center: ["50%", "38%"],
        data: state.redis.commandStats,
        animationEasing: "cubicInOut",
        animationDuration: 1000,
      },
    ],
  })
  mem.setOption({
    tooltip: {
      formatter: "{b} <br/>{a} : " + state.redis.info['used_memory_human'],
    },
    series: [
      {
        name: "峰值",
        type: "gauge",
        min: 0,
        max: 5000,
        detail: {
          formatter: state.redis.info['used_memory_human'],
        },
        data: [
          {
            value: parseFloat(state.redis.info['used_memory_human']),
            name: "内存消耗",
          },
        ],
      },
    ],
  })

  window.onresize = function () {
    command.resize();
    mem.resize();
  };

}

const getRedisInfo = () => {
  useServerApi().getRedisInfo().then(res => {
    state.redis = res.result
    initEcharts()
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
:deep(.el-descriptions__cell) {
  padding: 8px 0;
}

:deep(.el-descriptions__label) {
  display: inline-block;
  padding-left: 12px;
  width: 45%;
  color: #909399;
  font-weight: bolder;
}
</style>