<template>
  <ul class="login_tabs">
    <li><span>注 册</span></li>
    <li class="login_tabs_s">or</li>
    <li><span>登 录</span></li>
  </ul>
</template>
<script lang="ts" setup></script>
<script>
export default {
  name: "LoginTabs"
}
</script>

<style scoped>
.login_tabs {
  display: flex;
  padding: 0 34px;
  user-select: none;
}

.login_tabs li {
  display: flex;
  padding: 10px;
  flex: 1;
  justify-content: space-around;
  align-items: center;
  transition: all .6s ease;
}

.login_tabs span {
  display: block;
  padding: 4px 10px;
  border: 1px solid white;
  border-radius: 3px;
  text-align: center;
  transition: all .6s ease;
  cursor: pointer;
  word-spacing: 10px;
  font-weight: bolder;
}

.login_tabs .login_tabs_s {
  justify-content: center;
  transition-duration: .55s;
  transition-delay: .05s;
}

.login_tabs_s {
  font-size: 12px;
}

.login_tabs_s::before,
.login_tabs_s::after {
  content: '-';
}

.login_sign_up .login_tabs li:first-child {
  transition-duration: .5s;
  transition-delay: .1s;
  transform: translateX(100%) scale(1.5);
}

.login_sign_up .login_tabs li:first-child span {
  border-color: transparent;
}

.login_sign_up .login_tabs li:last-child {
  transform: scale(0.6);
  opacity: 0.4;
}

.login_sign_up .login_tabs_s {
  transform: translateX(58%);
  opacity: 0.8;
}

.login_sign_in .login_tabs li:last-child {
  transition-duration: .5s;
  transition-delay: .1s;
  transform: translateX(-100%) scale(1.5);
}

.login_sign_in .login_tabs li:last-child span {
  border-color: transparent;
}

.login_sign_in .login_tabs li:first-child {
  transform: scale(0.6);
  opacity: 0.4;
}

.login_sign_in .login_tabs_s {
  transform: translateX(-58%);
  opacity: 0.8;
}
</style>