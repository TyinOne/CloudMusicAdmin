<template>
  <div class="system-user-detail-container">
    <el-dialog v-if="isShowDialog" v-model="isShowDialog" :destroy-on-close="true" :title="'生成邀请码'"
               class="dialog-self">
      <div v-loading="loading">
        <el-form ref="ruleFormRef" :model="formData" :rules="rules">
          <el-form-item label="角色选择" prop="roleId">
            <el-select v-model="formData.roleId">
              <el-option v-for="item in roleLists" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="box">
          <div class="code-box">
            <div v-if="isShowMessage" class="message">
              <span>已生成邀请码：</span>
              <span style="color: #63b536">{{ message.code }}</span>
              <span>，有效期 </span>
              <span style="color: #63b536">{{ message.time }}</span>
              <span> 分钟</span>
              <div class="link">
                <el-link type="primary" @click.stop="copyCode">点击复制</el-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
				<span class="dialog-footer">
					<el-button :loading="loading" size="default" @click.stop="cancel">关 闭</el-button>
					<el-button :loading="loading" size="default" type="primary"
                     @click.stop="onSubmit(ruleFormRef)">生 成</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" name="generateCode" setup>
import {onMounted, reactive, ref} from "vue";
import {useRoleApi} from "@renderer/api/role";
import {useInviteCodeApi} from "@renderer/api/invite";
import commonFunction from "@renderer/utils/commonFunction";
import type {FormInstance, FormRules} from 'element-plus'

const isShowDialog = ref(false);

const loading = ref(false)

const ruleFormRef = ref<FormInstance>();

const rules = reactive<FormRules>({
  roleId: [
    {trigger: 'change', message: '请选择角色', required: true}
  ]
})

const roleLists = ref([])

const formData = reactive({
  roleId: undefined,
})
const message = reactive({
  code: '',
  time: '',
})

const isShowMessage = ref(false)

const cancel = () => {
  isShowDialog.value = false
  isShowMessage.value = false
}

const onSubmit = (fromEl: FormInstance | undefined) => {
  loading.value = true
  fromEl.validate((valid, fields) => {
    if (valid) {
      useInviteCodeApi().generateInviteCode({id: formData.roleId}).then(res => {
        message.code = res.result.code
        message.time = res.result.time
        isShowMessage.value = true
        loading.value = false
      }).catch(e => {
        loading.value = false
      })
    } else {
      loading.value = false
    }
  })
}

const copyCode = () => {
  commonFunction().copyText(message.code)
}

const openDialog = () => {
  formData.roleId = undefined
  message.code = ''
  message.time = ''
  isShowMessage.value = false
  isShowDialog.value = true
}

const getRoleList = () => {
  loading.value = true
  useRoleApi().getRoleLabel().then(res => {
    roleLists.value = res.result.list
    loading.value = false
  }).catch(e => {
    loading.value = false
  })
}

onMounted(() => {
  getRoleList()
})

defineExpose({
  openDialog
})
</script>

<style scoped>
.box {
  min-height: 72px;
  max-height: 72px;
}

.code-box {
  padding: 20px 0 0 0;
}

.message {
  font-size: 20px;
}

.link {
  float: right;
}
</style>