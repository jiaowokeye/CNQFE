import { MostRequest } from './request';
import {Modal} from 'antd';
export function GetUrlParams () {
  let name, value;
  let str = window.location.search; //取得整个地址栏
  str = str.split("?")[1]; //取得所有参数   stringvar.substr(start [, length ]
  if (!str) {
    return {}
  }
  let arr = str.split("&"); //各个参数放到数组里
  let params = {};
  let num;
  for (let i = 0; i < arr.length; i++) {
    num = arr[i].indexOf("=");
    if (num > 0) {
      name = arr[i].substring(0, num);
      value = arr[i].substr(num + 1);
      params[name] = value;
    }
  }
  return params
}

export function FormatDateStr (t) {
  const d = new Date(t);
  const month = d.getMonth() + 1;
  const date = d.getDate();
  return `${d.getFullYear()}-${month >= 10 ? month : `0${month}`}-${date >= 10 ? date : `0${date}`}`
}

/**
 * 获取本月｜本年的首日期
 * @param {month|year} type 
 */
export function GetNowYearDateStr (type = 'month') {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const lastDay = new Date(year, month, 0).getDate();
  if (type === 'month') {
    return [`${year}/${month}/1`, `${year}/${month}/${lastDay}`];
  }
  return [`${year}/1`, `${year}/12`];
}

export const DeleteSource = (coll_name, ids) => {
 
  /**
    coll_name
    friend_link	| [string]
    document	| [string]
    banner	| [string]
    layer_data	| [string]
  */
  return new Promise(resolve => {
    Modal.confirm({
      title: '确认删除？',
      content: '删除后将消失',
      onOk() {
        MostRequest.Post('/v1/del', {
          ids,
          coll_name
        }).then(res => {
          resolve(res.data)
        }).catch(() => {
          resolve(null)
        })
      },
      onCancel() {
        resolve(null);
      },
    })
    
  })
}

export const OfflineSource = (coll_name, ids, is_online) => {
  return new Promise(resolve => {
    MostRequest.Post('/v1/set/online_status', {
      coll_name,
      ids,
      is_online
    }).then(res => {
      resolve(res.data)
    }).catch(() => {
      resolve(null)
    })
  })
}

export const FuncDebounce = function (fn, time) {
  // 函数防抖   最后执行一次
  let timer = 1;
  return function () {
    timer && clearTimeout(timer);
    const context = this;
    const args = arguments;
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, time || 0)
  }
}

export const FuncThrottle = function (fn, time) {
  let timer;
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        fn();
        clearTimeout(timer);
        timer = null;
      }, time)
    }
  }
}

export const CheckIsPhone = (phone) => {
  return (/^1[3456789]\d{9}$/.test(phone))
}

let config;

export const GetPageConfig = () => {
  if (config) {
    MostRequest.Get('/v1/config', { key: 'system_setting_normal_setting' }).then(res => {
      config = res.data;
    }).catch(e => {
      console.log(e);
    })
    return Promise.resolve(config);
  }
  return new Promise((resolve) => {
    MostRequest.Get('/v1/config', { key: 'system_setting_normal_setting' }).then(res => {
      config = res.data;
      resolve(res.data);
    }).catch(e => {
      console.log(e);
    })
  })
}

export const Report = ({ trace_type, id, ext }) => {
  MostRequest.Post('/v1/trace', {
    trace_type,
    id,
    ext
  },
    null,
    {
      catchError: false
    },
  )
}

export function DownloadExcel ({ data, header = null, name }) {
  if (!header) return;
  let csvContent = "data:text/csv;charset=utf-8,%EF%BB%BF";
  let csv = header.map(ele => ele.title).join(",") + "\n";
  for (let i in data) {
    let item = data[i];
    csv += header.map(ele => item[ele.dataIndex]).join(",");
    csv += "\n"
  }
  let encodedUri = csvContent + encodeURI(csv);
  let link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${name}.csv`);
  document.body.appendChild(link); // Required for FF
  link.click();
}