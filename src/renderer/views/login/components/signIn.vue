<template>
  <el-form class="login-content-form" ref="formState"
           :model="state.ruleForm"
           :rules="state.rules" size="large">
    <el-form-item class="login-animation1" prop="account">
      <el-input v-model="state.ruleForm.account" :placeholder="'请输入用户名/手机号/邮箱'" autocomplete="off"
                clearable
                spellcheck="false" type="text">
        <template #prefix>
          <SvgIcon name="ele-User"/>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation2" prop="password">
      <el-input
          v-model="state.ruleForm.password"
          :placeholder="'请输入密码'"
          :type="state.isShowPassword ? 'text' : 'password'"
          autocomplete="off" spellcheck="false"
          v-on:keyup.enter="onSignIn">
        <template #prefix>
          <SvgIcon name="ele-Unlock"/>
        </template>
        <!--        <template #suffix>-->
        <!--          <i :class="state.isShowPassword ? 'i-cloud-buxianshimima' : 'i-cloud-xianshimima'"-->
        <!--             class="iconfont el-input__icon login-content-password"-->
        <!--             @click="state.isShowPassword = !(state.isShowPassword)">-->
        <!--          </i>-->
        <!--        </template>-->
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation3">
      <el-checkbox v-model="state.saveAccount">{{ '记住密码' }}</el-checkbox>
    </el-form-item>
    <el-form-item class="login-animation4">
      <el-button :loading="state.loading.signIn" class="login-content-submit" round type="primary"
                 @click="onSignIn(formState)">
        <span>{{ '登 录' }}</span>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" name="signUp" setup>
import {computed, onMounted, reactive, ref} from "vue";
import {formatAxis} from "@renderer/utils/formatTime";
import {useUserApi} from "@renderer/api/user";
import {Local} from "@renderer/utils/storage";
import {initBackEndControlRoutes} from "@renderer/router/backEnd";
import {useRoute} from "vue-router";
import {useStore} from "@renderer/store";
import router from "@renderer/router";
import {ElMessage} from "element-plus";
import Base64 from "@renderer/utils/Base64";
import {Md5} from "ts-md5";

let sessionSave;

const route = useRoute();
const store = useStore();
const formState = ref(null)
const state = reactive({
  isShowPassword: false,
  ruleForm: {
    account: '',
    password: ''
  },
  rules: {
    account: [
      {required: true, message: '请输入用户名/手机号/邮箱', trigger: 'blur'},
      {min: 4, max: 12, message: '请输入6 ~ 12位用户名 ', trigger: 'blur'}
    ],
    password: [
      {required: true, message: '请输入密码', trigger: 'change'},
      {min: 8, max: 12, message: '请输入8～12位密码 ', trigger: 'blur'}
    ]
  },
  loading: {
    signIn: false,
  },
  saveAccount: sessionSave ?  Base64.decode(sessionSave.saveAccount) : false
});
// 时间获取
const currentTime = computed(() => {
  return formatAxis(new Date());
});
const onSignIn = async (formStateRef) => {
  state.loading.signIn = true;
  if (!formStateRef) {
    state.loading.signIn = false;
    return
  }
  formStateRef.validate((valid, fields) => {
    if (valid) {
      let {account, password} = state.ruleForm
      let saveAccount = state.saveAccount
      if (saveAccount) {
        Local.set("saveAccount", {account, password: Base64.encode(password), saveAccount: saveAccount})
      } else {
        Local.remove("saveAccount")
      }
      signIn(account, Md5.hashStr(password))
    }
    state.loading.signIn = false;
  })
};
let {ipcRenderer} = window;
const isWeb = ref(process.env.IS_WEB);
const signIn = (account, password) => {
  let params = {account, password}
  useUserApi().signIn(params).then(res => {
    let userInfo = {
      nickName: res.result.nickName,
      avatar: res.result.avatar,
      authBtnList: res.result.btn,
      account: res.result.account
    }
    Local.set('Authorization', res.result.token)
    if (!isWeb) {
      ipcRenderer.invoke('userLogin', {
        account: userInfo.account
      })
    }
    store.dispatch('userInfos/setUserInfos', {
      Authorization: res.result.token,
      userInfos: userInfo,
    }).then(() => {
      initBackEndControlRoutes().then(() => {
        signInSuccess();
      });
    }).catch(e => {
      state.loading.signIn = false;
    })
  }).catch(e => {
    state.loading.signIn = false;
  })
}
// 登录成功后的跳转
const signInSuccess = () => {
  // 初始化登录成功时间问候语
  let currentTimeInfo = currentTime.value;
  // 登录成功，跳到转首页
  // 添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
  // 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
  if (route.query?.redirect) {
    console.log(route.query?.redirect)
    router.push({
      path: <string>route.query?.redirect,
      query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '',
    });
  } else {
    router.replace('home');
  }
  // 登录成功提示
  // 关闭 loading
  state.loading.signIn = true;
  const signInText = '欢迎回来！';
  ElMessage.success(`${currentTimeInfo}，${signInText}`);
};
const initForm = (info) => {
  if (info) {
    let {account, password, saveAccount} = info
    state.ruleForm.account = account
    state.ruleForm.password = Base64.decode(password)
    state.saveAccount = saveAccount

  }
}
onMounted(() => {
  sessionSave = Local.get("saveAccount");
  initForm(sessionSave)
})
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

  .login-content-password {
    display: inline-block;
    width: 20px;
    cursor: pointer;

    &:hover {
      color: #909399;
    }
  }

  .login-content-code {
    width: 100%;
    padding: 0;
    font-weight: bold;
    letter-spacing: 5px;
  }

  .login-content-submit {
    width: 100%;
    letter-spacing: 2px;
    font-weight: 300;
    margin-top: 15px;
  }
}
</style>
