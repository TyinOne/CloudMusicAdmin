<template>
  <div class="element-container">
  <el-card shadow="hover" :header="`element plus 字体图标(自动载入，增加了 ele- 前缀，使用时：ele-Aim)：${state.sheetsIconList.length}个`">
    <el-scrollbar height="calc(100vh - 240px)">
      <el-row class="iconfont-row">
        <el-col v-for="(v, k) in state.sheetsIconList" :key="k" :lg="4" :md="6" :sm="8" :xl="2" :xs="12">
          <div class="iconfont-warp" @click="copyIcon(v)">
            <div class="flex-margin">
              <div class="iconfont-warp-value">
                <SvgIcon :name="v" :size="30"/>
              </div>
              <div class="iconfont-warp-label mt10">{{ v }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-scrollbar>
  </el-card>
</div>
</template>

<script lang="ts" setup>
import {onMounted, reactive} from "vue";
import initIconfont from "@renderer/utils/getStyleSheets";
import SvgIcon from "@renderer/components/svgIcon/index.vue";
import commonFunction from "@renderer/utils/commonFunction";

const state = reactive({
  sheetsIconList: [],
})
const initElementIcons = () => {
  initIconfont.ele().then((res:any) => {
    state.sheetsIconList = res
  })
}
const copyIcon = (text) => {
  commonFunction().copyText(text)
}
onMounted(() => {
  initElementIcons()
})
</script>
<style scoped lang="scss">
.element-container {
  .iconfont-row {
    border-top: 1px solid var(--next-border-color-light);
    border-left: 1px solid var(--next-border-color-light);
    .iconfont-warp {
      text-align: center;
      border-right: 1px solid var(--next-border-color-light);
      border-bottom: 1px solid var(--next-border-color-light);
      height: 120px;
      overflow: hidden;
      display: flex;
      transition: all 0.3s ease;
      &:hover {
        box-shadow: 0 2px 12px var(--next-color-dark-hover);
        cursor: pointer;
        transition: all 0.3s ease;
        .iconfont-warp-value {
          i {
            color: var(--el-color-primary);
            transition: all 0.3s ease;
          }
        }
        .iconfont-warp-label {
          color: var(--el-color-primary);
          transition: all 0.3s ease;
        }
      }
      .iconfont-warp-value {
        i {
          color: #606266;
          font-size: 32px;
          transition: all 0.3s ease;
        }
      }
      .iconfont-warp-label {
        color: #99a9bf;
        transition: all 0.3s ease;
      }
    }
  }
}
</style>

