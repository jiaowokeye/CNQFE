import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/yunzhu/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/yunzhu/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request('/yunzhu/notices');
}


export async function UserAdd(params: any) {              //2.4.3	添加公司员工
  return request('/yunzhu/user/basic/extend/add',params);
}

export async function UserQuery(params: any) {          //2.4.5	查询项目经历
  return request('/yunzhu/user/basic/extend/query',params);
}


export async function QueryRetreat(params: any) {       //2.4.6	进退场查询
  return request('/yunzhu/user/basic/extend/queryRetreat',params);
}
 
export async function modifyCompAccount(params: any) {    //2.2.4	修改公司账户密码
  return request('/yunzhu/user/account/modifyCompAccount',params);
}

export async function updateBatch(params: any) {          //2.4.11	人员移除 退场 
  return request('/yunzhu/user/basic/extend/updateBatch',params);
}
export async function userExtUpdate(params: any) {        //    2.4.4	修改公司员工
  return request('/yunzhu/user/basic/extend/update',params);
}

export async function userDelete(params: any) {             //2.4.13	人员删除
  return request('/yunzhu/user/basic/extend/delete',params);
}

export async function queryUserByGropId(params: any) {      //2.4.2	通过班组查询人员
  return request('/yunzhu/user/basic/extend/queryByGropId',params);
}
export async function queryUserList(params: any) {          //2.4.1	工人花名册处 查询列表
  return request('/yunzhu/user/basic/extend/queryList',params);
}
export async function queryUserProject(params: any) {       //2.4.5	查询项目经历
  return request('/yunzhu/user/basic/extend/queryById',params);
}


export async function updateFavorite(params: any) {         //2.4.9	修改收藏
  return request('/yunzhu/user/favorite/update',params);
}
export async function addProAdminUser(params: any) {        //2.4.10	设置分包/角色
  return request('/yunzhu/user/basic/extend/updateSub',params);
}
export async function getUserDetailByExtendId(params: any) {  //2.4.12	人员详情
  return request('/yunzhu/user/basic/extend/getDetail',params);
}
export async function addConstruction(params: any) {
  return request('/yunzhu/user/basic/extend/addConstruction',params);
}
export async function deleteAdminUser(params: any) {    //2.4.13	人员删除
  return request('/yunzhu/user/basic/extend/delete',params);
}


export async function selectTeamUsers(params: any) {  
  return request('/yunzhu/user/basic/extend/selectTeamUsers',params);
}

// 个人合同
export async function userContractAdd(params: any) {
  return request('/yunzhu/user/contract/add',params);
}
export async function userContractUpdate(params: any) {
  return request('/yunzhu/user/contract/update',params);
}
export async function userContractDelete(params: any) {
  return request('/yunzhu/user/contract/delete',params);
}
export async function userContractQuery(params: any) {
  return request('/yunzhu/user/contract/query',params);
}
export async function userContractDetail(params: any) {
  return request('/yunzhu/user/contract/getDetail',params);
}