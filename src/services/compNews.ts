import request from '@/utils/request';



export async function newsAdd(params:any) { //云筑咨询2.9.1	添加
  return request('/yunzhu/compNews/add', params);
}
export async function newsUpdate(params:any) {  //修改
  return request('/yunzhu/compNews/update', params);
}
export async function newsDelete(params:any) {  //删除
  return request('/yunzhu/compNews/delete', params);
}
export async function newsQuert(params:any) {   //列表
  return request('/yunzhu/compNews/query', params);
}
export async function newsDetail(params:any) {  //详情
  return request('/yunzhu/compNews/getDetail', params);
}
export async function attGetUrl(params: any) {
  return request('/yunzhu/attach/getUrl',params);
}