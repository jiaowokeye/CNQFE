import qs from "qs";
import 'es6-promise'
import axios from 'axios';
import {notification,message} from 'antd';
import router from 'umi/router';
const jsonpAdapter = require('axios-jsonp');
console.log(process.env);
const history = require("history").createBrowserHistory();
// import * as API from './api'
// let pathname = 'http://120.27.40.138:8094';
let pathname = '';

const service = axios.create({
    timeout: 600000
}); 

const CancelToken = axios.CancelToken;
let source = CancelToken.source();
service.interceptors.request.use(config => {
    config.cancelToken = source.token;
    if(process.env.NODE_ENV!=='development'){
        
        config.url = 'https://www.chenyoung.cn/ntz_dev/api/v1'+(config.url.replace('/psy/','/'));
    }else{
        config.url = pathname+config.url;
    }
    config.withCredentials = true;
    config.headers['Content-Type']='application/json; charset=utf-8';
    if(config.data&&config.data.isFormData){
        config.headers['Content-Type']='multipart/form-data';
    }
    if(config.data&&config.data.urlencoded){
        config.headers['Content-Type']='application/x-www-form-urlencoded';
    }
    
    return config
}, error => {
    return Promise.reject(error)
});

service.interceptors.response.use(response => {
    if(response.headers['content-disposition']){
        convertRes2Blob(response);
        return Promise.resolve({})
    }
    if (response.status >= 200 && response.status < 300) {
        switch (response.data.code) {
            case 1000:
            case 2002:
                notification.open({
                    message: response.status,
                    description: response.data.msg,
                    onClick: () => {
                        console.log('Notification Clicked!');
                    },
                });
                if(response.data.msg=="登录已过期，或没有登录。"){
                    history.push("/user/login");
                }
                return Promise.reject({});
            case 2014:
                notification.open({
                    message: response.status,
                    description: response.data.msg,
                    onClick: () => {
                        console.log('Notification Clicked!');
                    },
                });
                return Promise.resolve({});
                break;
            default:
                return Promise.resolve(response.data);
        }
    }else{
        
    }
    const codeMessage = {
        200: '服务器成功返回请求的数据。',
        201: '新建或修改数据成功。',
        202: '一个请求已经进入后台排队（异步任务）。',
        204: '删除数据成功。',
        400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
        401: '用户没有权限（令牌、用户名、密码错误）。',
        403: '用户得到授权，但是访问是被禁止的。',
        404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
        406: '请求的格式不可得。',
        410: '请求的资源被永久删除，且不会再得到的。',
        422: '当创建一个对象时，发生一个验证错误。',
        500: '服务器发生错误，请检查服务器。',
        502: '网关错误。',
        503: '服务不可用，服务器暂时过载或维护。',
        504: '网关超时。',
    };
    notification.open({
        message: response.status,
        description: codeMessage[response.status],
        onClick: () => {
            console.log('Notification Clicked!');
        },
    });
    const error = new Error(response.statusText);
    error.response = response;
    return Promise.reject(error)
}, error => {
    if (error.response.data.code === 2002) {
        window.location.href = window.location.origin + '/#/user/login';
  }
    return Promise.reject(error)
});


const requestion= (config={}) =>{
    return service(config)
}
export default  function Request(url:string, data:any) {
    let params = {
        url: url,
        method: 'post',
        data: data,
        
    }
 
  return requestion(params)
};
export  function Download(url:string, data:any) {
    let params = {
        url: url,
        method: 'post',
        data: data,
        responseType:'blob',
    }
   
  return requestion(params)
};
export function Get(url:string, data:any) {
    return requestion({
        url: url,
        method: 'get',
        params: data
    })
}

export function Post(url:string, data:any) {
    return requestion({
        url: url,
        method: 'post',
        data: data
    })
} 


export function Delete(url:string, data:any) {
    return requestion({
        url: url,
        method: 'delete',
        data: data
    })
}
export function Put(url:string, data:any) {
    return requestion({
        url: url,
        method: 'put',
        data: data
    })
}
export function FormDataSubmit(url:string, data:any) {
    return requestion({
        url: url,
        method: 'post',
        data: {
            ...data,
            ...{
                isFormData:true
            }
        }
    })
}
const  MostRequest = {
    Get:Get,
    Post:Post,
    Put:Put,
    Download:Download,
    Delete:Delete,
    FormDataSubmit:FormDataSubmit
}
export {
    MostRequest
}
export function All(optionArr:any) {
    return axios.all(optionArr)
        .then(axios.spread(function (acct, perms) {
            // 两个请求现在都执行完成
        }));
}


// export function JSONP(url:string) {
//     return axios.jsonp(url);
// }

// axios.jsonp = (url) => {
//     if(!url){
//         console.error('Axios.JSONP 至少需要一个url参数!')
//         return;
//     }
//     return new Promise((resolve,reject) => {
//         window.jsonCallBack =(result) => {
//             resolve(result)
//         }
//         var JSONPDOM=window.document.createElement("script");
//         JSONPDOM.type="text/javascript";
//         JSONPDOM.src=`${url}&jsoncallback=window.jsonCallBack`;
//         document.getElementsByTagName("head")[0].appendChild(JSONPDOM);
//         setTimeout(() => {
//             document.getElementsByTagName("head")[0].removeChild(JSONPDOM)
//         },500)
//     })
// }
function convertRes2Blob(response) {
    console.log(response);
    // 提取文件名
    let fileName = response.headers['content-disposition'].match(
      /filename=(.*)/
    )[1]
    fileName = decodeURI(fileName)

    const type = response.headers['content-type'];
    console.log(type)
    // 将二进制流转为blob
    const blob = new Blob([response.data], {  type: type })
    
    if ('msSaveOrOpenBlob' in navigator) {
            
          window.navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
          
          var url = window.URL.createObjectURL(blob);
          var link = document.createElement('a');
          
          link.style.display = 'none';
          link.href = url;
          link.setAttribute('download', fileName);
          link.setAttribute('id', 'downLoadFile');
          console.log(link);
          window.document.body.appendChild(link);
         
          link.click();
    
        }
  }

export {
    pathname
}