<template>
  <el-form class="login-content-form" size="large">
    <el-form-item class="login-animation1">
      <el-input v-model="state.ruleForm.account"
                :placeholder="'请输入用户名'"
                autocomplete="off" clearable spellcheck="false"
                type="text">
        <template #prefix>
          <SvgIcon name="ele-User"/>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation2">
      <el-input
          v-model="state.ruleForm.password"
          :placeholder="'请输入密码'"
          :type="state.isShowPassword ? 'text' : 'password'"
          autocomplete="off"
          spellcheck="false"
      >
        <template #prefix>
          <el-icon class="el-input__icon">
            <SvgIcon name="ele-Unlock"/>
          </el-icon>
        </template>
        <template #suffix>
          <i :class="state.isShowPassword ? 'i-cloud-buxianshimima' : 'i-cloud-xianshimima'"
             class="iconfont el-input__icon login-content-password"
             @click="state.isShowPassword = !state.isShowPassword"
          >
          </i>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation3">
      <el-input v-model="state.ruleForm.code" :placeholder="'请输入邀请码'" autocomplete="off"
                clearable maxlength="4" type="text">
        <template #prefix>
          <SvgIcon name="ele-Link"/>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation3">
      <el-button class="login-content-submit" round type="primary">
        <span>{{ '注 册' }}</span>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" name="signIn" setup>
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

<style lang="scss" scoped>
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