import {onMounted, reactive, ref, toRefs} from "vue";
import {useMenuApi} from "@renderer/api/menu";
import {useRoleApi} from "@renderer/api/role";

export default function getService(){

    let state = reactive({
        keywords: '',
        roleId: 0,
        disabled: '',
        dataSource: [],
        roleOptions: []
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
    const onOpenAddMenu = () => {

    }
    const onHandleCurrentChange = (val: number) => {

    }
    const onOpenEditMenu = (row) => {

    }
    const onRowDel = (row) => {

    }
    const getRoleOptions = () => {
        useRoleApi().getRoleLabel().then(res => {
            state.roleOptions = res.result.list
        })
    }
    onMounted(() => {
        getRoleOptions()
        searchMenu()
    })
    const getMenuType = (val: number) => {
        switch (val) {
            case 1:
                return '菜单'
            case 2:
                return '按钮'
        }
    }
    return {
        state, handleMenuRef, loading, searchMenu, onOpenAddMenu, onOpenEditMenu, onRowDel, getMenuType
    }
}