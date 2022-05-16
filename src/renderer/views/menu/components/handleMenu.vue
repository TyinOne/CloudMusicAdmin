<template>
  <div class="system-add-role-container">
    <el-dialog v-model="isShowDialog" :title="dialogMessage.title" destroy-on-close draggable width="769px"
               custom-class="dialog-self">
      <div style="margin-top: 20px" v-loading="loading">
        <el-form label-width="75px" label-position="left">
          <div style="display: flex;justify-content: space-around">
            <div style="width: 47%">
              <el-form-item label="父级菜单:">
                <el-tree-select :disabled="isEdit" v-model="dialogMessage.formData.parentId" style="width: 100%"
                                :check-strictly=true
                                :data="menuOptions" @current-change="updateTypeState">
                </el-tree-select>
              </el-form-item>
            </div>
            <div style="width: 47%">
              <el-form-item label="元素类型:">
                <el-radio-group :disabled="isEdit" v-model="typeState.type" size="small">
                  <el-radio-button v-for="item in typeState.typeOptions" :value="item.value" :label="item.value">{{
                      item.label
                    }}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
          <div v-if="typeState.type === 0" style="display: flex;justify-content: space-around;margin-top: 20px">
            <div style="width: 47%">
              <el-form-item label="路由路径:">
                <el-input style="width: 100%;" v-model="dialogMessage.formData.path"></el-input>
              </el-form-item>
              <el-form-item label="组件路径:">
                <el-input style="width: 100%;" :disabled="dialogMessage.formData.type === 0"
                          v-model="dialogMessage.formData.component"></el-input>
              </el-form-item>
              <el-form-item label="组件名称:">
                <el-input style="width: 100%;" v-model="dialogMessage.formData.name"></el-input>
              </el-form-item>
              <el-form-item label="页面图标:">
                <el-input style="width: 100%;" v-model="dialogMessage.formData.metaIcons"></el-input>
              </el-form-item>
              <el-form-item label="是否内链:">
                <el-radio-group disabled v-model="dialogMessage.formData.metaIsIframe">
                  <el-radio :label="false">否</el-radio>
                  <el-radio :label="true">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否禁用:">
                <el-radio-group v-model="dialogMessage.formData.disabled">
                  <el-radio :label="false">否</el-radio>
                  <el-radio :label="true">是</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div style="width: 47%">
              <el-form-item label="页面标题:">
                <el-input style="width: 100%;" v-model="dialogMessage.formData.metaTitle"></el-input>
              </el-form-item>
              <el-form-item label="外链URL:">
                <el-input disabled style="width: 100%;" v-model="dialogMessage.formData.metaIsLink"></el-input>
              </el-form-item>
              <el-form-item label="重定向:">
                <el-input style="width: 100%;" :disabled="dialogMessage.formData.type === 1"
                          v-model="dialogMessage.formData.redirect"></el-input>
              </el-form-item>
              <el-form-item label="显示排序:">
                <el-input-number style="width: 100%;" v-model="dialogMessage.formData.sort"></el-input-number>
              </el-form-item>
              <el-form-item label="开启缓存:">
                <el-radio-group disabled v-model="dialogMessage.formData.metaIsKeepAlive">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否隐藏:">
                <el-radio-group disabled v-model="dialogMessage.formData.metaIsHide">
                  <el-radio :label="false">否</el-radio>
                  <el-radio :label="true">是</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
          <div v-else-if="typeState.type === 1" style="display: flex;justify-content: space-around;margin-top: 20px">
            <div style="width: 47%">
              <el-form-item label="路由路径:">
                <el-input style="width: 100%;" v-model="dialogMessage.formData.path"></el-input>
              </el-form-item>
              <el-form-item label="组件路径:">
                <el-input style="width: 100%;" v-model="dialogMessage.formData.component"></el-input>
              </el-form-item>
              <el-form-item label="组件名称:">
                <el-input style="width: 100%;" v-model="dialogMessage.formData.name"></el-input>
              </el-form-item>
              <el-form-item label="页面图标:">
                <el-input style="width: 100%;" v-model="dialogMessage.formData.metaIcons"></el-input>
              </el-form-item>
              <el-form-item label="是否内链:">
                <el-radio-group v-model="dialogMessage.formData.metaIsIframe">
                  <el-radio :label="false">否</el-radio>
                  <el-radio :label="true">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否禁用:">
                <el-radio-group v-model="dialogMessage.formData.disabled">
                  <el-radio :label="false">否</el-radio>
                  <el-radio :label="true">是</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div style="width: 47%">
              <el-form-item label="页面标题:">
                <el-input style="width: 100%;" v-model="dialogMessage.formData.metaTitle"></el-input>
              </el-form-item>
              <el-form-item label="外链URL:">
                <el-input style="width: 100%;" v-model="dialogMessage.formData.metaIsLink"></el-input>
              </el-form-item>
              <el-form-item label="重定向:">
                <el-input style="width: 100%;" :disabled="dialogMessage.formData.type === 1"
                          v-model="dialogMessage.formData.redirect"></el-input>
              </el-form-item>
              <el-form-item label="显示排序:">
                <el-input-number style="width: 100%;" v-model="dialogMessage.formData.sort"></el-input-number>
              </el-form-item>
              <el-form-item label="开启缓存:">
                <el-radio-group v-model="dialogMessage.formData.metaIsKeepAlive">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否隐藏:">
                <el-radio-group v-model="dialogMessage.formData.metaIsHide">
                  <el-radio :label="false">否</el-radio>
                  <el-radio :label="true">是</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
          <div v-else-if="typeState.type === 2" style="display: flex;justify-content: space-around;margin-top: 20px">
            <div style="width: 47%">
              <el-form-item label="页面组件:">
                <el-input style="width: 100%;" v-model="dialogMessage.formData.path"></el-input>
              </el-form-item>
              <el-form-item label="按钮名称:">
                <el-input style="width: 100%;" v-model="dialogMessage.formData.name"></el-input>
              </el-form-item>
              <el-form-item label="是否禁用:">
                <el-radio-group v-model="dialogMessage.formData.disabled">
                  <el-radio :label="false">否</el-radio>
                  <el-radio :label="true">是</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div style="width: 47%">
              <el-form-item label="页面标题:">
                <el-input style="width: 100%;" v-model="dialogMessage.formData.metaTitle"></el-input>
              </el-form-item>
              <el-form-item label="显示排序:">
                <el-input-number style="width: 100%;" v-model="dialogMessage.formData.sort"></el-input-number>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
					<el-button :loading="loading" size="default" @click.stop="onCancel">关 闭</el-button>
					<el-button :loading="loading" size="default" type="primary"
                     @click.stop="onSubmit">{{ dialogMessage.submit }}</el-button>
				</span>
      </template>
    </el-dialog>
  </div>

</template>

<script name="handleMenu" lang="ts" setup>
import {reactive, ref} from "vue";
import {useMenuApi} from "@renderer/api/menu";
import {TypeLabel} from "@renderer/types/interface";
import {ElMessage} from "element-plus";

const isShowDialog = ref(false)
const typeState = reactive({
  type: 1,
  typeOptions: <Array<TypeLabel>>[
    {label: '目录', value: 0, type: 0},
    {label: '菜单', value: 1, type: 1}
  ]
})
const isEdit = ref(false)
const loading = ref(false)
const dialogMessage = reactive({
  title: '',
  submit: '',
  message: '',
  formData: {
    id: null,
    parentId: null,
    metaIcons: '',
    path: '',
    name: '',
    component: '',
    security: '',
    redirect: '',
    metaTitle: '',
    metaIsKeepAlive: true,
    metaIsLink: '',
    metaIsHide: false,
    metaIsIframe: false,
    disabled: false,
    sort: 0
  },
  callback: () => {
  }
})
const menuOptions = ref([])


//目录仅新增目录或菜单， 菜单仅新增按钮
//按钮无法新增
const openDialog = (message, row?) => {
  isEdit.value = message.isEdit
  isShowDialog.value = true;
  dialogMessage.title = message.title
  dialogMessage.submit = message.submit
  dialogMessage.message = message.message
  dialogMessage.callback = message.callback
  dialogMessage.formData = {
    id: null,
    parentId: null,
    metaIcons: '',
    path: '',
    name: '',
    component: '',
    redirect: '',
    security: '',
    metaTitle: '',
    metaIsKeepAlive: true,
    metaIsLink: '',
    metaIsHide: false,
    metaIsIframe: false,
    disabled: false,
    sort: 0
  }
  dialogMessage.formData.parentId = message.parentId
  typeState.type = 0
  typeState.typeOptions = <Array<TypeLabel>>[
    {label: '目录', value: 0, type: 0},
    {label: '菜单', value: 1, type: 1}
  ]
  getMenuLabel()
  if (isEdit.value) {
    initDetail(row.id)
  }
};

const getMenuLabel = () => {
  useMenuApi().getMenuTreeSelectLabel().then(res => {
    let list = res.result.list
    list.unshift({
      label: '根目录',
      value: 0
    })
    menuOptions.value = list
  })
}

const initDetail = (id) => {
  loading.value = true
  useMenuApi().getMenuDetail({id: id}).then(res => {
    let result = res.result
    let type = result.type
    typeState.type = type
    switch (type) {
      case 0:
        initDirDetail(result);
        break;
      case 1:
        initPageDetail(result);
        break;
      case 2:
        initButtonDetail(result);
        break;
    }
    loading.value = false
  }).catch(e => {
    loading.value = false
  })
}

const updateTypeState = ({type}) => {
  // let type = e.type
  if (!type || type === 0) {
    typeState.type = 0
    typeState.typeOptions = [
      {label: '目录', value: 0, type: 0},
      {label: '菜单', value: 1, type: 1}
    ]
  } else if (type === 1) {
    typeState.type = 2
    typeState.typeOptions = [
      {label: '按钮', value: 2, type: 2}
    ]
  } else {
    typeState.type = type
  }
}

const initDirDetail = (result) => {
  console.log(result)
  dialogMessage.formData = result
}

const initPageDetail = (result) => {
  console.log(result)
  dialogMessage.formData = result
}

const initButtonDetail = (result) => {
  console.log(result)
  dialogMessage.formData = result
}

const onSubmit = () => {
  loading.value = true
  let {
    id,
    parentId,
    name,
    component,
    path,
    redirect,
    security,
    sort,
    disabled,
    metaIcons,
    metaTitle,
    metaIsHide,
    metaIsIframe,
    metaIsKeepAlive,
    metaIsLink
  } = dialogMessage.formData
  let params = {
    id,
    parentId,
    name,
    component,
    path,
    redirect,
    security,
    sort,
    disabled,
    metaIcons,
    metaTitle,
    metaIsHide,
    metaIsIframe,
    metaIsKeepAlive,
    metaIsLink,
    type: typeState.type
  }
  useMenuApi().saveMenu(params).then(res => {
    ElMessage.success('保存成功！')
    loading.value = false
    onCancel()
    dialogMessage.callback()
  }).catch(e => {
    loading.value = false
  })
}
const onCancel = () => {
  isShowDialog.value = false
}

defineExpose({
  openDialog
})
</script>

<style scoped>

</style>