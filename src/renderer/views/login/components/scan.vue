<template>
  <div id="qrcode"></div>
</template>

<!--<script lang="ts" name="scan" setup>-->

<!--</script>-->
<script lang="ts" name="scan" setup>
import wxLogin from './wxLogin'
import {onMounted} from "vue";

onMounted(() => {
  let obj = wxLogin( window,document, {
    self_redirect: true,
    id: "qrcode",
    appid: "wxcee890e05de28fa9",
    scope: "snsapi_login",
    redirect_uri: 'https://admin.tyin.vip',
    state: "",
    style: "",
    href: ""
  });
})
</script>
<style scoped>
#qrcode {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>