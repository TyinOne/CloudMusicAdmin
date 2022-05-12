import {Module} from 'vuex';
import {Session} from '@renderer/utils/storage';
import {RootStateTypes, UserInfosState} from '@renderer/store/interface/index';
import {useUserApi} from "@renderer/api/user";

const userInfosModule: Module<UserInfosState, RootStateTypes> = {
    namespaced: true,
    state: {
        userInfos: {
            nickName: '',
            avatar: '',
            token: ''
        },
    },
    mutations: {
        // 设置用户信息
        getUserInfos(state, data: any) {
            state.userInfos = data;
        },
    },
    actions: {
        // 设置用户信息
        async setUserInfos({commit}, data: UserInfosState) {
            if (data) {
                commit('getUserInfos', data);
            } else {
                let res = await useUserApi().getUserSession();
                Session.set('Authentication', res.result.token)
                Session.set('userInfo', res.result)
                commit('getUserInfos', res.result);
            }
        },
    },
};

export default userInfosModule;
