import axios from 'axios'
import ReactDOM from 'react-dom';
import { notification ,message } from 'antd';
// 当前正在请求的数量
let requestCount = 0;

// 显示loading
function showLoading (text='请求进行中，请稍后') {
  if (requestCount === 0) {
      var dom = document.createElement('div')
      dom.setAttribute('id', 'globalLoading')
      dom.innerHTML = text;
      window.document.body.appendChild(dom);

      // ReactDOM.render(<Spin tip="加载中..." size="large"/>, dom)
  }
  requestCount++
}

// 隐藏loading
function hideLoading () {
  if(requestCount>0){
      requestCount--;
  }
  if (requestCount === 0) {
      document.body.removeChild(document.getElementById('globalLoading'))
  }
}
// let hide = null;
const service = axios.create({
      timeout: 15000
});
window.DEV = process.env.NODE_ENV === 'development';
service.interceptors.request.use(config => {
      config.url = '/api' + config.url;
      if (window.DEV) {
            config.params = {
                  ...config.params,
                  uid: 48,
            }
      }
      console.log(config.loading);
      if(config.loading.show){
            showLoading(config.loading.text);
      }
      return config
}, error => {
      console.log(error);
      return Promise.reject(error)
});

service.interceptors.response.use(response => {
      console.log(response);
      if(response.config.loading.show){
            hideLoading();
      }
      if (response.data.code !== 0) {
            if (response.data.code === 2002 && (window.location.pathname !== '/login'&&window.location.pathname !== '/scanCodeSuccess')) {
                  notification.error({
                        message: '未登录或登录超时，请重新登录',
                        description: response.data.desc
                  });
                  window.location.href = window.location.origin + '/login?url=' + encodeURIComponent(window.location.href);
                  return false
            }
            notification.error({
                  message: 'error',
                  description: `${response.data.desc} - ${response.data.msg}`
            });
            return Promise.reject()
      }
      if (!response.data) {
            axios.post('/api/v1/error/trace', {
                  url: window.location.href,
                  from: 'PC',
                  msg: '数据为null'
            });
            return Promise.reject()
      }
      return Promise.resolve(response.data)
}, error => {
      if (error.response.data.code === 2002 && window.location.pathname !== '/login' && window.location.pathname !== '/scanCodeSuccess') {
            window.location.href = window.location.origin + '/login?url=' + encodeURIComponent(window.location.href);
      }
      // notification.error({
      //   message: 'error', 
      //   description: '服务器错误，请联系开发同学'
      // });
      console.log(error);
      if (error.config.options.catchError) {
            return Promise.reject(error)
      }
});
const option = {
      catchError: true
}
export const MostRequest = {
      Get (path = '', params = {}, header, options = option,loading = {
            show:false,
            text:''
      }) {
            return this.requestion({
                  url: path,
                  headers: header || {},
                  method: 'get',
                  params: params,
                  options,
                  loading:loading,
                  
            })
      },

      Post (path, data, header, options = option,loading = {
            show:false,
            text:''
      }) {
            return this.requestion({
                  url: path,
                  headers: header || {},
                  method: 'post',
                  data: data,
                  options,
                  loading:loading
            })
      },
      Put (path, data, header, options = option,loading = {
            show:false,
            text:''
      }) {
            return this.requestion({
                  url: path,
                  headers: header || {},
                  method: 'put',
                  data: data,
                  options,
                  loading:loading
            })
      },
      Delete (path, data, header, options = option,loading = {
            show:false,
            text:''
      }) {
            return this.requestion({
                  url: path,
                  headers: header || {},
                  method: 'delete',
                  data: data,
                  options,
                  loading:loading
            })
      },
      requestion (config) {
            return service(config)
      },

      all (config) {
            return axios.all(config)
      },
};
