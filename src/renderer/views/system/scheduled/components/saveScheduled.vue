<template>
  <div class="system-save-scheduled-container">
    <el-dialog v-model="isShowDialog" :title="dialogMessage.title" class="dialog-self" destroy-on-close draggable
               width="600px">
      <el-form label-position="left" label-width="120px">
        <el-form-item label="任务名称:" required>
          <el-input v-model="dialogMessage.data.scheduledName" placeholder="请输入任务名称"/>
        </el-form-item>
        <el-form-item label="任务分组:" required>
          <el-select v-model="dialogMessage.data.scheduledGroup" class="w100" placeholder="请选择任务分组">
            <el-option v-for="item in scheduledGroupOptions" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item required>
          <template #label>
            <el-space :size="3" style="display: flex;align-items: center">
              <span>目标方法: </span>
              <el-tooltip
                  effect="dark"
                  placement="top-start"
              >
                <template #content>
                  Bean调用示例：systemTask.loadConfig('configName')
                  <br/>Class类调用示例：com.tyin.quartz.task.ClassName.methodName('abc')
                  <br/>参数说明：支持字符串，布尔类型，长整型，浮点型，整型
                </template>
                <svg-icon name="ele-Warning"/>
              </el-tooltip>
            </el-space>
          </template>
          <el-input v-model="dialogMessage.data.invokeTarget" placeholder="请输入目标方法字符串"/>
        </el-form-item>
        <el-form-item label="cron表达式:">
          <el-input v-model="dialogMessage.data.cronExpression" placeholder="请输入cron执行表达式">
            <template #append>
              <el-button type="primary" @click.stop="openCronDialog">cron表达式</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="错误策略:">
          <el-select v-model="dialogMessage.data.misfirePolicy" class="w100" placeholder="请选择错误策略">
            <el-option v-for="item in misfirePolicyOptions" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="是否并发:">
          <el-switch v-model="dialogMessage.data.concurrent"/>
        </el-form-item>
        <el-form-item label="是否禁用:">
          <el-switch v-model="dialogMessage.data.disabled"/>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button :loading="loading" size="default" @click.stop="onCancel">取 消</el-button>
					<el-button :loading="loading" size="default" type="primary" @click.stop="onSubmit">{{
              dialogMessage.submit
            }}</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" name="addScheduled" setup>
import {reactive, ref} from "vue";
import {useScheduledApi} from "@renderer/api/scheduled";
import SvgIcon from "@renderer/components/svgIcon/index.vue";
import {ElMessage} from "element-plus";

let isShowDialog = ref(false)
let loading = ref(false)
let scheduledGroupOptions = ref([])
let misfirePolicyOptions = ref([
  {value: '0', label: '默认'},
  {value: '1', label: '立即触发执行'},
  {value: '2', label: '触发一次执行'},
  {value: '3', label: '不触发立即执行'}
])
let dialogMessage = reactive({
  title: '',
  submit: '',
  data: {
    id: null,
    scheduledName: '',
    scheduledGroup: '',
    invokeTarget: '',
    cronExpression: '',
    misfirePolicy: '0',
    concurrent: false,
    disabled: false
  },
  callback: () => {
  }
})
const initData = (data) => {
  useScheduledApi().getEditDetail(data).then(res => {
    console.log(res)
    dialogMessage.data = res.result
  })
}
const openDialog = (message, row?) => {
  isShowDialog.value = true
  dialogMessage.title = message.title
  dialogMessage.submit = message.submit
  dialogMessage.callback = message.callback
  useScheduledApi().getGroups().then(res => {
    scheduledGroupOptions.value = res.result.list
    if (row) {
      initData(row)
    }
  })
}
const openCronDialog = () => {
  console.log('333')
}
const onSubmit = () => {
  let params = {...dialogMessage.data}
  useScheduledApi().saveSchedule(params).then(res => {
    ElMessage.success('操作成功')
    onCancel()
  })
}
const onCancel = () => {
  isShowDialog.value = false
  dialogMessage.callback()
}

defineExpose({
  openDialog
})
</script>

<style lang="scss" scoped>
:deep(.el-input-group__append button.el-button) {
  background-color: var(--el-button-bg-color);
  color: var(--el-button-text-color);

  &:hover {
    background-color: var(--el-button-hover-bg-color);
  }

  &:active {
    background-color: var(--el-button-active-color);
  }
}
</style>