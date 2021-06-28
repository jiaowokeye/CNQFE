import request from '@/utils/request';


export async function queryCompList(params: any) {  //2.3.6	公司列表
  return request('/yunzhu/comp/queryList',params);
}
export async function addComp(params: any) {  //2.3.1	新增公司
  return request('/yunzhu/comp/add',params);
}
export async function updateComp(params: any) { //
  return request('/yunzhu/comp/update',params);
}

export async function cnki(params: any) { //2.3.5	公司查重
  return request('/yunzhu/comp/cnki',params);
}
export async function updateAdmin(params: any) {  //
  return request('/yunzhu/comp/updateAdmin',params);
}
export async function getCompReviewLis(params: any) {
  return request('/yunzhu/comp/reviewList',params);
}
export async function compReview(params: any) { //2.3.4	系统审核公司
  return request('/yunzhu/comp/reviewComp',params);
}

 


export async function reviweturnQuery(params: any) {  //
  return request('/yunzhu/comp/reviweturn/query',params);
}
export async function reviweturnAdd(params: any) {
  return request('/yunzhu/comp/reviweturn/add',params);
}
export async function reviweturnUpdate(params: any) {
  return request('/yunzhu/comp/reviweturn/update',params);
}
export async function reviweturnDetail(params: any) {
  return request('/yunzhu/comp/reviweturn/getDetail',params);
}
