<template>
  <div :style="imageBox" @click="onCropperDialogOpen">
    <el-image v-if="src" alt="" :src="src" :style="imageContainer" :class="circle ? 'circle dashed':'dashed'"
              ref="avatarImg">
      <input type="file">
    </el-image>
    <div v-else :class="circle ? 'circle addPicture dashed' : 'addPicture dashed'">
      <SvgIcon name="ele-Plus" color="white" :size="30" style="font-weight: bold"></SvgIcon>
    </div>
  </div>
  <CropperDialog @confirm="confirmImage" ref="cropperDialogRef"/>
</template>

<script setup name="UpdatePicture" lang="ts">
import {ref} from "vue";
import CropperDialog from '@renderer/components/cropper/index.vue'
import SvgIcon from "@renderer/components/svgIcon/index.vue";

const emits = defineEmits<{
  (e: 'confirm', result: Object): void
}>()
const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  size: {
    type: Number || Array,
    required: true
  },
  circle: {
    type: Boolean,
    default: false
  }
})
const cropperDialogRef = ref();
let avatarImg = ref()
let imageBox = ref({
  height: (typeof (props.size) === 'number') ? props.size + 'px' : props.size[0] + 'px',
  width: (typeof (props.size) === 'number') ? props.size + 'px' : props.size[1] || props.size[0] + 'px',
})
let imageContainer = ref({
  width: '100%'
})
const onCropperDialogOpen = () => {
  cropperDialogRef.value.openDialog(props.src)
};
const confirmImage = (e) => {
  emits('confirm', e)
}
</script>
<style scoped>

.dashed:hover {
  cursor: pointer;
  border: 1px dashed #9b9b9b;
}

.addPicture {
  background-color: #dadada;
  display: flex;
  justify-content: center;
  align-items: center;
}

.circle {
  height: 100%;
  width: 100%;
  border-radius: 50%;
}

</style>