<template>
  <el-dialog v-model="state.isShowDialog" class="dialog-self" title="更换头像" width="769px" @close="onCloseDialog">
    <div class="cropper-warp">
      <div class="cropper-warp-left">
        <img ref="cropperImgRef" :src="state.cropperImg" alt="" class="cropper-warp-left-img"/>
      </div>
      <div class="cropper-warp-right">
        <div class="cropper-warp-right-title">预览</div>
        <div class="cropper-warp-right-item">
          <div class="cropper-warp-right-value">
            <el-image :src="state.cropperImgBase64" class="cropper-warp-right-value-img">
              <template #error>{{ '' }}</template>
            </el-image>
          </div>
          <div class="cropper-warp-right-label">100 x 100</div>
        </div>
        <div class="cropper-warp-right-item">
          <div class="cropper-warp-right-value">
            <el-image :src="state.cropperImgBase64" class="cropper-warp-right-value-img cropper-size">
              <template #error>{{ '' }}</template>
            </el-image>
          </div>
          <div class="cropper-warp-right-label">50 x 50</div>
        </div>
      </div>
    </div>
    <template #footer>
      <div style="display: flex;justify-content: space-between">
        <el-upload
            :httpRequest="uploadImage"
            :show-file-list="false"
            action="action"
            class="avatar-uploader"
        >
          <el-button>选择图片</el-button>
        </el-upload>
        <span class="dialog-footer">
            <el-button size="default" @click="onCancel">取 消</el-button>
            <el-button v-if="state.isCropper" size="default" type="primary" @click="onSubmit">更 换</el-button>
            <el-button v-else size="default" type="primary" @click="onCancel">确 定</el-button>
          </span>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" name="cropperIndex" setup>
import {reactive, ref} from 'vue';
import Cropper from 'cropperjs'
import {useCommonApi} from "@renderer/api/common";
import {UploadRequestOptions} from "element-plus";
import 'cropperjs/dist/cropper.css'

const emits = defineEmits<{
  (e: 'confirm', result: Object): void
}>()

const state = reactive({
  isShowDialog: false,
  cropperImg: '',
  cropperImgBase64: null,
  cropper: null,
  isCropper: ref(false)
});

let cropperImgRef = ref()

// 打开弹窗
const openDialog = (src) => {
  if (src) {
    state.cropperImg = src
    initImagesBase64(src)
  } else {
    state.cropperImgBase64 = ''
  }
  state.isShowDialog = true;
  // initCropper()
};
// 关闭弹窗
const closeDialog = () => {
  state.isShowDialog = false;
};
const onCloseDialog = () => {
  destroy()
  console.log(123)
}
// 取消
const onCancel = () => {
  closeDialog();
};
const uploadImage = async (param: UploadRequestOptions) => {
  let reader = new FileReader();
  reader.readAsDataURL(param.file);
  state.cropperImg = URL.createObjectURL(param.file)
  reader.onload = (evt) => {
    state.cropperImgBase64 = evt.target.result.toString()
    initCropper()
  }
}
const initImagesBase64 = (url) => {
  console.log(url)
  let image = new Image()
  image.src = url + '?v=' + Math.random() // 处理缓存
  image.setAttribute('Origin', 'Anonymous');
  image.setAttribute('crossOrigin', 'Anonymous');
  // image.crossOrigin = 'anonymous' // 支持跨域图片
  image.onload = function () {
    state.cropperImgBase64 = toTrans(image)
  }
  // console.log(toTrans(image))
}
const toTrans = (img) => {
  let canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  let ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, img.width, img.height)
  return canvas.toDataURL('image/png')
}
// 更换
const onSubmit = () => {
  let file = base64ImgToFile(state.cropper.getCroppedCanvas({
    imageSmoothingQuality: 'high'
  }).toDataURL('image/jpeg'));
  const formData = new FormData()
  formData.append('file', file)
  useCommonApi().uploadImg(formData).then(res => {
    state.cropperImg = res.result.src
    emits('confirm', res.result)
    destroy()
  })
};

// 初始化cropperjs图片裁剪
const initCropper = () => {
  if (cropperImgRef.value) {
    state.cropperImgBase64 = "";
    state.isCropper = true
    state.cropper = new Cropper(cropperImgRef.value, {
      viewMode: 1,
      dragMode: 'none',
      initialAspectRatio: 1,
      aspectRatio: 1,
      preview: '.before',
      background: false,
      autoCropArea: 0.6,
      zoomOnWheel: false,
      crop: () => {
        state.cropperImgBase64 = state.cropper.getCroppedCanvas().toDataURL('image/jpeg')
      }
    });
  }
};
const destroy = () => {
  if (state.cropper) {
    state.cropper.destroy()
  }
  state.isCropper = false
}

const base64ImgToFile = (base64, filename = 'file') => {
  let arr = base64.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let suffix = mime.split('/')[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], `${filename}.${suffix}`, {
    type: mime
  })
}

defineExpose({
  openDialog,
})
</script>

<style lang="scss" scoped>
.cropper-warp {
  display: flex;

  .cropper-warp-left {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 350px;
    flex: 1;
    border: var(--el-border-base);
    background: var(--el-color-white);
    overflow: hidden;
    background-repeat: no-repeat;
    cursor: move;
    border-radius: var(--el-border-radius-base);

    .cropper-warp-left-img {
      width: 100%;
      height: 100%;
      object-fit: scale-down;
    }
  }

  .cropper-warp-right {
    width: 150px;
    height: 350px;

    .cropper-warp-right-title {
      text-align: center;
      height: 20px;
      line-height: 20px;
    }

    .cropper-warp-right-item {
      margin: 15px 0;

      .cropper-warp-right-value {
        display: flex;

        .cropper-warp-right-value-img {
          width: 100px;
          height: 100px;
          border-radius: var(--el-border-radius-circle);
          margin: auto;
        }

        .cropper-size {
          width: 50px;
          height: 50px;
        }
      }

      .cropper-warp-right-label {
        text-align: center;
        font-size: 12px;
        color: var(--el-text-color-primary);
        height: 30px;
        line-height: 30px;
      }
    }
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.cropper-warp-left:first-child {
  height: 350px;
}
</style>
