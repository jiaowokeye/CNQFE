import request from '@/utils/request';

export async function deviceRelationAdd(params:any) {                   //2.5.14	闸机配置添加
    return request('/yunzhu/project/deviceRelation/add', params);
}
export async function deviceRelationQuery(params:any) {                 //2.5.18	闸机配置查询
    return request('/yunzhu/project/deviceRelation/query', params);
}

export async function deviceRelationDelete(params:any) {                //2.5.16	闸机配置删除
    return request('/yunzhu/project/deviceRelation/delete', params);
}

export async function deviceRelationUpdate(params:any) {                //2.5.15	闸机配置修改
    return request('/yunzhu/project/deviceRelation/update', params);
}

export async function deviceRelationDetail(params:any) {                //2.5.17	闸机配置详情
    return request('/yunzhu/project/deviceRelation/getDetail', params);
}

export async function projectCompleteSet(params:any) {                  //2.5.7	项目竣工/重新开工
    return request('/yunzhu/project/info/projectComplete', params);
}
export async function querySub(params:any) {                            //2.5.4	项目详情中查询此分包参与总包的项目
    return request('/yunzhu/project/info/querySub', params);
}
export async function subcontractorAdd(params:any) {                    //2.5.12	总包添加参见分包
    return request('/yunzhu/project/info/subcontractor/add', params);
}
export async function subcontractorDelete(params:any) {
    return request('/yunzhu/project/info/subcontractor/delete', params);    //1.1.1	总包 删除参见分包
}
export async function TeamQuery(params:any) {                               //2.6.4	班组列表
    return request('/yunzhu/project/team/queryPage', params);
}

export async function getTeamDetail(params:any) {                           //2.6.3	班组详情
    return request('/yunzhu/project/team/get', params);
}

export async function getProjectsCard(params:any) {                         //2.5.10	获取首页处根据登录人获取负责项目内容       
    return request('/yunzhu/project/info/getProjectsCard', params);
}
export async function getHomeProjectCount() {                               //2.5.9	获取首页处根据登录人获取在建项目数量
    return request('/yunzhu/project/info/getCount',{});
  }
export async function getFavProjectDetail(params:any) {                     //2.5.11	获取首页处获取首页收藏项目的具体内容
    return request('/yunzhu/project/info/getFavProjectDetail', params);
}
export async function addTeam(params:any) {                                 //2.6.1	分包添加班组
    return request('/yunzhu/project/team/add', params);
}


export async function updateTeam(params:any) {                              //2.6.2	修改班组
    return request('/yunzhu/project/team/update', params);
}
export async function contractQuery(params:any) {                           
    return request('/yunzhu/project/contract/query', params);
}
export async function contractAdd(params:any) {
    return request('/yunzhu/project/contract/add', params);
}

export async function contractDelete(params:any) {
    return request('/yunzhu/project/contract/delete', params);
}
export async function contractUpdate(params:any) {
    return request('/yunzhu/project/contract/update', params);
}

export async function contractDetail(params:any) {
    return request('/yunzhu/project/contract/getDetail', params);
}