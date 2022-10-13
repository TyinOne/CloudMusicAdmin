<template>
  <el-form size="large" class="login-content-form">
    <el-form-item class="login-animation1">
      <el-input type="text" :placeholder="'请输入用户名'" v-model="state.ruleForm.account" clearable autocomplete="off">
        <template #prefix>
          <SvgIcon name="ele-User"/>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation2">
      <el-input
          :type="state.isShowPassword ? 'text' : 'password'"
          :placeholder="'请输入密码'"
          v-model="state.ruleForm.password"
          autocomplete="off"
      >
        <template #prefix>
          <el-icon class="el-input__icon">
            <SvgIcon name="ele-Unlock"/>
          </el-icon>
        </template>
        <template #suffix>
          <i class="iconfont el-input__icon login-content-password"
             :class="state.isShowPassword ? 'i-cloud-buxianshimima' : 'i-cloud-xianshimima'"
             @click="state.isShowPassword = !state.isShowPassword"
          >
          </i>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation3">
      <el-input type="text" maxlength="4" :placeholder="'请输入邀请码'"
                v-model="state.ruleForm.code" clearable autocomplete="off">
        <template #prefix>
          <SvgIcon name="ele-Link"/>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation3">
      <el-button round type="primary" class="login-content-submit">
        <span>{{ '注 册' }}</span>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup name="signIn">
// 定义接口来定义对象的类型
import {reactive} from "vue";

interface SignInState {
  account: any;
  password: any;
  code: string | number | undefined;
}

// 定义对象与类型
const ruleForm: SignInState = {
  account: '',
  password: '',
  code: '',
};
const state = reactive({
  ruleForm: ruleForm,
  isShowPassword: false,
});
</script>

<style scoped lang="scss">
.login-content-form {
  margin-top: 20px;
  @for $i from 1 through 4 {
    .login-animation#{$i} {
      opacity: 0;
      animation-name: error-num;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
      animation-delay: calc($i/10) + s;
    }
  }

  .login-content-code {
    width: 100%;
    padding: 0;
  }

  .login-content-submit {
    width: 100%;
    letter-spacing: 2px;
    font-weight: 300;
    margin-top: 15px;
  }

  .login-msg {
    color: var(--el-text-color-placeholder);
  }
}
</style>