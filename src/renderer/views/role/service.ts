import {onMounted, ref, unref} from 'vue'
import {useRoleApi} from '@renderer/api/role';

interface Page {
    current: number
    size: number
    total: number
}

export default function getService() {
    const handleRoleRef = ref(null)
    let keywords = ref('')
    let loading = ref(false)
    const dataSource = ref([]);
    const pagination = ref({
        current: 1,
        size: 20,
        total: 0,
    })
    const onHandleCurrentChange = async (val: number) => {
        pagination.value.current = val;
        await getInfo(pagination.value)
    };
    const searchRole = () => {
        let page = unref(pagination)
        page.current = 1
        getInfo(page)
    }
    const getInfo = (page: Page) => {
        let params = {
            keywords: keywords.value,
            current: page.current,
            size: page.size
        }
        loading.value = true
        useRoleApi().getRoleList(params).then(res => {
            dataSource.value = res.result.list
            pagination.value = {
                current: res.result.current,
                size: res.result.size,
                total: res.result.total
            }
            loading.value = false
        }).catch(e => {
            loading.value = false
        })
    }
    const onOpenAddRole = () => {
        handleRoleRef.value.openDialog({
            title: '新增角色',
            submit: '新 增',
            callback: searchRole
        });
    }
    const onOpenEditRole = (row) => {
        handleRoleRef.value.openDialog({
            title: '修改角色',
            submit: '修 改',
            init: true,
            callback: searchRole
        }, row);
    }
    const onRowDel = (row) => {

    }
    onMounted(async () => {
        await searchRole()
    })
    return {
        keywords, dataSource, pagination, loading, searchRole, onHandleCurrentChange, onOpenAddRole, onOpenEditRole, onRowDel,
        handleRoleRef,
    }
}