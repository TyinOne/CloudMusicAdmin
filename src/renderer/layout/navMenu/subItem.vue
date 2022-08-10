<template>
  <template v-for="val in child">
    <el-sub-menu v-if="val.children && val.children.length > 0" :key="val.path" :index="val.path">
      <template #title>
        <SvgIcon :name="val.meta.icon"/>
        <span>{{ val.meta.title }}</span>
      </template>
      <sub-item :child="val.children"/>
    </el-sub-menu>
    <template v-else>
      <el-menu-item :key="val.path" :index="val.path">
        <template v-if="!val.meta.isLink || (val.meta.isLink && val.meta.isIframe)">
          <SvgIcon :name="val.meta.icon"/>
          <span>{{ val.meta.title }}</span>
        </template>
        <template v-else>
          <a :href="val.meta.isLink" class="w100" rel="opener" target="_blank">
            <SvgIcon :name="val.meta.icon"/>
            {{ val.meta.title }}
          </a>
        </template>
      </el-menu-item>
    </template>
  </template>
</template>
<script lang="ts" setup>
import {computed} from "vue";

const props = defineProps({
  child: {
    type: Array,
    default: () => [],
  },
})
const child = computed(() => {
  return <any>props.child;
});
</script>
<script lang="ts">
export default {
  name: "navMenuSubItem"
}
</script>

<style scoped>

</style>