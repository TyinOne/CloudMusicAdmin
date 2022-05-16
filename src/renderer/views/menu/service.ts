import {onMounted, reactive, ref} from "vue";
import {useMenuApi} from "@renderer/api/menu";
import {useRoleApi} from "@renderer/api/role";
import {Label} from "@renderer/types/interface";

export default function getService() {

    let state = reactive({
        keywords: '',
        roleId: 0,
        disabled: '',
        dataSource: [],
        roleOptions: <Array<Label>>[]
    })
    let loading = ref(false)
    const handleMenuRef = ref()
    const searchMenu = () => {
        let params = {
            keywords: state.keywords,
            roleId: state.roleId,
            disabled: state.disabled
        }
        loading.value = true
        useMenuApi().getMenuRes(params).then(res => {
            state.dataSource = res.result.list
            loading.value = false
        }).catch(e => {
            loading.value = false
        })
    }
    const onOpenAddMenu = (parentId:number) => {
        let message = {
            init: false,
            title: '新增 MENU',
            submit: '保存',
            parentId: parentId,
            callback: searchMenu
        }
        if (parentId > 0) message.init = true
        handleMenuRef.value.openDialog(message)
    }
    const onHandleCurrentChange = (val: number) => {

    }
    const onOpenEditMenu = (row) => {
        let message = {
            init: true,
            title: '修改 MENU',
            submit: '保存',
            parentId: row.parentId,
            callback: searchMenu
        }
        handleMenuRef.value.openDialog(message, row)
    }
    const onRowDel = (row) => {

    }
    const getRoleOptions = () => {
        useRoleApi().getRoleLabel().then(res => {
            state.roleOptions = res.result.list
        })
    }
    /**
     * bi图标有自定义style
     * @param name
     */
    const getIconName = (name) => {
        if (name.indexOf(' bi') == -1) return name;
        return name.split(' bi')[0]
    }
    const getMenuType = (val: number) => {
        switch (val) {
            case 1:
                return '菜单'
            case 2:
                return '按钮'
        }
    }
    onMounted(() => {
        getRoleOptions()
        searchMenu()
    })
    return {
        state, handleMenuRef, loading, searchMenu, onOpenAddMenu, onOpenEditMenu, onRowDel, getMenuType, getIconName
    }
}