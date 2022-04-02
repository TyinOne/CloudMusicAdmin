<template>
  <form class="login_form">
    <div class="login_form_r1">
      <div class="login_text">
        <login-text-field label="姓名" icon="user"></login-text-field>
      </div>
    </div>
    <div class="login_form_r2">
      <login-text-field label="邮箱" icon="envelope"></login-text-field>
    </div>
    <div class="login_form_r3">
      <login-text-field type="password" label="密码" icon="lock"></login-text-field>
    </div>
    <div class="login_form_r4">
      <login-text-field label="重复密码" icon="lock"></login-text-field>
    </div>
    <div class="login_form_r5">
      <label></label>
      <label>忘记密码?</label>
    </div>
    <div>
      <login-submit/>
    </div>
  </form>
</template>
<script lang="ts" setup>
import LoginTextField from '@renderer/views/login/loginTextField.vue'
import LoginCheckbox from '@renderer/views/login/loginCheckbox.vue'
import LoginSubmit from '@renderer/views/login/loginSubmit.vue'






</script>
<script lang="ts">
export default {
  name: "loginForm"
}
</script>

<style>
.login_form {
  padding: 20px;
}
.login_form>div{
  padding-bottom: 10px;
  display: flex;
  min-height: 40px;
  justify-content: space-between;
  transition: all .6s ease;
}
.login_text {
  display: flex;
  flex: 1;
}
.login_text .login_text_field {
  border-radius: 0;
}
.login_text .login_text_field:first-child {
  border-radius: 2px 0 0 2px;
}
.login_text .login_text_field:last-child {
  border-radius: 0 2px 2px 0;
}
.login_sign_up .login_form_r5 {
  opacity: 0;
  transition-duration: .4s;
}
.login_sign_in .login_form_r1,
.login_sign_in .login_form_r4 {
  transform: translateY(30%) scale(0.8);
  opacity: 0;
}
.login_sign_in .login_form_r2,
.login_sign_in .login_form_r3 {
  transform: translateY(-100%);
}
.login_sign_in .login_form_r5 {
  transform: translateY(-200%);
}
.login_form_r5 label:last-child {
  user-select: none;
  cursor: pointer;
  text-decoration: underline #ffffff;
}
.login_sign_in .login_button label:nth-child(1) {
  transform: translateY(100%);
  opacity: 0;
}
.login_sign_up .login_button label:nth-child(2) {
  transform: translateY(-100%);
  opacity: 0;
}
</style>