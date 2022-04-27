<template>
  <form class="login_form">
    <div class="login_form_r1">
      <div class="login_text">
        <login-text-field icon="user" label="姓名"></login-text-field>
      </div>
    </div>
    <div class="login_form_r2">
      <login-text-field icon="envelope" label="邮箱"></login-text-field>
    </div>
    <div class="login_form_r3">
      <login-text-field icon="lock" label="密码" type="password"></login-text-field>
    </div>
    <div class="login_form_r4">
      <login-text-field icon="lock" label="重复密码"></login-text-field>
    </div>
    <div class="login_form_r5">
      <label></label>
      <label>忘记密码?</label>
    </div>
    <div>
      <login-submit @submit="submit"/>
    </div>
  </form>
</template>
<script lang="ts" setup>
import LoginTextField from '@renderer/views/login/loginTextField.vue'
import LoginSubmit from '@renderer/views/login/loginSubmit.vue'
import {useUserApi} from "@renderer/api/user";
import {Session} from '@renderer/utils/storage'
import router from "@renderer/router";
import {store} from "@renderer/store";
import {initFrontEndControlRoutes} from "@renderer/router/frontEnd";
import {computed, reactive} from "vue";
import {formatAxis} from "@renderer/utils/formatTime";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";

const route = useRoute();

const state = reactive({
  loading: {
    signIn: false,
  },
});

const submit = async () => {
  state.loading.signIn = true;
  let params = {
    username: 'TyinZero',
    password: 'tyinzero'
  }
  useUserApi().login(params).then(res => {
    let userInfo = {
      nickName: res.result.nickName,
      avatar: res.result.avatar,
      roles: res.result.roles,
      authBtnList: res.result.btn,
    }
    Session.set('Authentication', res.result.token)
    Session.set('userInfo', userInfo)
    store.dispatch('userInfos/setUserInfos', {
      token: res.result.token,
      userInfos: userInfo,
    }).then(() => {
      initFrontEndControlRoutes().then(() => {
        signInSuccess();
      });
    })
  })
}
// 时间获取
const currentTime = computed(() => {
  return formatAxis(new Date());
});
// 登录成功后的跳转
const signInSuccess = () => {
  // 初始化登录成功时间问候语
  let currentTimeInfo = currentTime.value;
  // 登录成功，跳到转首页
  // 添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
  // 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
  if (route.query?.redirect) {
    router.push({
      path: <string>route.query?.redirect,
      query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '',
    });
  } else {
    router.push('/');
  }
  // 登录成功提示
  // 关闭 loading
  state.loading.signIn = true;
  const signInText = '欢迎回来！';
  ElMessage.success(`${currentTimeInfo}，${signInText}`);
};


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

.login_form > div {
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