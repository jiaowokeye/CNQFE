import request from '@/utils/request';



export async function getCode(params:any) { //获取验证码
  return request('/yunzhu/code/getCode', params);
}

