<template>
  <div class="login_container">
    <div class="login" :class="{login_sign_in: isSignIn, login_sign_up : isSignUp}">
      <login-tabs @click.native="switchState"></login-tabs>
      <login-form />
    </div>
  </div>
</template>
<script lang="ts" setup>
import LoginTabs from '@renderer/views/login/loginTabs.vue'
import LoginForm from '@renderer/views/login/loginForm.vue'
import {computed, onMounted, ref} from "vue";

let state = ref(1);

const isSignIn = computed(() => {
  return state.value === 1
})
const isSignUp = computed(() => {
  return state.value === 2
})
const switchState = () => {
  state.value = state.value === 1 ? 2 : 1
}
</script>
<script lang="ts">
export default {
  name: "index"
}
</script>

<style scoped>
.login_container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #2a2a2a;
}
.login {
  width: 100%;
  color: white;
  font-size: 14px;
  background: #2a2a2a;
  max-height: 400px;
  max-width: 400px;
}
.login_sign_up,.login_sign_in {
  position: relative;
  bottom: 100px;
}
</style>