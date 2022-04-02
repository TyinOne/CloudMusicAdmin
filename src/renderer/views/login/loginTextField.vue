<template>
  <span class="login_text_field">
    <label>
      <i v-if="icon" :class="['fa', `fa-${icon}`]"></i>
      <i style="width: 60px"> {{label}}</i>
      <input :type="type" autocomplete="off"/>
    </label>
  </span>
</template>

<script lang="ts" setup>
const props = defineProps({
  label: {
    type: String
  },
  icon: {
    type: String
  },
  type: {
    type: String,
    default: 'text'
  }
})





</script>
<script lang="ts">
export default {
  name: "loginTextField"
}
</script>

<style>
.login_text_field {
  flex: 1;
  display: flex;
  padding: 10px;
  width: 100%;
  border-radius: 2px;
  background-color: white;
  box-shadow: 0 1px 1px #1c1c1c;
}
.login_text_field label {
  margin-right: 10px;
  color: #1c1c1c;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%
}
.login_text_field label i {
  width: 20px;
}
.login_text_field input {
  flex: 1;
  width: 100px;
  padding: 0;
  margin: 0;
  border: none;
  outline: none;
}
</style>