import request from '@/utils/request';


export async function AttQueryRate(params: any) { //	2.7.1	总包按项目 分包公司查询出勤率
  return request('/yunzhu/attendance/queryRate',params);
}

export async function AttQueryPage(params: any) { //2.7.3		查询考勤列表
  return request('/yunzhu/attendance/queryPage',params);
}
export async function AttDetail(params: any) {  //
  return request('/yunzhu/attendance/getDetail',params);
}

export async function AttRuleAdd(params: any) {
  return request('/yunzhu/attendance/rule/add',params);
}
export async function AttRuleUpdate(params: any) {
  return request('/yunzhu/attendance/rule/update',params);
}
export async function AttRuleDelete(params: any) {
  return request('/yunzhu/attendance/rule/delete',params);
}
export async function AttRuleQuery(params: any) {
  return request('/yunzhu/attendance/rule/query',params);
}
export async function AttRuleQueryTeam(params: any) {
  return request('/yunzhu/attendance/rule/queryTeam',params);
}
export async function AttRuleDetail(params: any) {
  return request('/yunzhu/attendance/rule/getDetail',params);
}