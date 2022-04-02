<template>
  <span class="login_button">
    <label>注 册</label>
    <label>登 录</label>
    <input type="button"/>
  </span>
</template>
<script lang="ts" setup></script>
<script lang="ts">
export default {
  name: "loginSubmit"
}
</script>

<style>
.login_button {
  position: relative;
  display: flex;
  flex: 1;
  overflow: hidden;
}
.login_button span:active {
  /*background-color: #8d8d8d;*/
}
.login_button input {
  display: block;
  flex: 1;
  width: 0;
  height: 40px;
  border: none;
  border-radius: 2px;
  outline: none;
  background-color: #8a8a8a;
}
.login_button label {
  position: absolute;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  transition: all .6s ease;
  cursor: pointer;
  font-size: 16px;
  font-weight: bolder;
  word-spacing: 16px;
  text-align: center;
  user-select: none;
}
.login_button label:hover {
  background-color: #676767;
}
</style>