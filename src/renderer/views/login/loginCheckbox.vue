<template>
  <span class="login_checkbox">
    <input :id="id" type="checkbox"/>
    <label :for="id">{{ label }}</label>
  </span>
</template>
<script lang="ts" setup>
const props = defineProps({
  label: {
    type: String
  }
})
let GID = 1
let id = `login-checkbox-${GID++}`

</script>
<script lang="ts">
export default {
  name: "loginCheckbox"
}
</script>

<style scoped>
.login_checkbox input {
  display: none;
}

.login_checkbox label::before,
.login_checkbox label::after {
  content: '';
  display: inline-block;
  margin-right: 5px;
  margin-top: 3px;
  width: 14px;
  height: 14px;
  vertical-align: top;
}

.login_checkbox label::before {
  border-radius: 3px;
  background-color: white;
  box-shadow: 0 1px 1px #2a2a2a;
}

.login_checkbox label::after {
  content: '\f00c';
  position: relative;
  display: none;
  z-index: 10;
  margin-right: -14px;
  width: 12px;
  height: 12px;
  padding: 1px;
  font: normal normal normal 12px/1 FontAwesome;
  color: #232323;
  float: left;
}

.login_checkbox input:checked + label::after {
  display: inline-block;
}


</style>