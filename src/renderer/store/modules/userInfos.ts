import {Module} from 'vuex';
import {Session} from '@renderer/utils/storage';
import {RootStateTypes, UserInfosState} from '@renderer/store/interface/index';

const userInfosModule: Module<UserInfosState, RootStateTypes> = {
    namespaced: true,
    state: {
        token: '',
        userInfos: {
            name: '',
            avatar: '',
            roles: [],
            authBtnList: [],
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
                if (Session.get('userInfo')) commit('getUserInfos', Session.get('userInfo'));
            }
        },
    },
};

export default userInfosModule;
