import { Reducer } from 'redux';
import { Effect } from 'dva';
import { stringify } from 'querystring';
import router from 'umi/router';

import { fakeAccountLogin, getFakeCaptcha } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    getCaptcha: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },
  
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      console.log(response);
      
       
      // Login successfully
      if (response.code === 0) {
        if(process.env.NODE_ENV=="development"){
          console.log('setcookie')
          document.cookie = "SessionID=c60307910fb67f938cb404777dcafb61fbe87697;";
        }
        const userInfo  = response.data;
        window.localStorage.setItem("userInfo", JSON.stringify(userInfo));
        let res = {
          status: 'ok',
          type:'account',
          currentAuthority: 'user',
        }
        console.log(userInfo.is_admin);
        if(userInfo.is_admin){
          res = {
            status: 'ok',
            type:'account',
            currentAuthority: 'admin',
          }
        }else{
          res = {
            status: 'ok',
            type:'account',
            currentAuthority: 'user',
          }
        }
        yield put({ 
          type: 'changeLoginStatus',
          payload: res,
        });
        window.location.href = '/#/admin/order';
      }else{
       
      }
    },
 
    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    logout() {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      window.localStorage.clear();
      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
        });  
      } 
    },
  },

  reducers: { 
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
