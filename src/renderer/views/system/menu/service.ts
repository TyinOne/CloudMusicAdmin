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

    const handleMenuRef = ref()
    const searchMenu = () => {
        let params = {
            keywords: state.keywords,
            roleId: state.roleId,
            disabled: state.disabled
        }
        useMenuApi().getMenuRes(params).then(res => {
            state.dataSource = res.result.list
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
        state, handleMenuRef, searchMenu, onOpenAddMenu, onOpenEditMenu, onRowDel, getMenuType
    }
}