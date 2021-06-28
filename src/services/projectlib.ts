import request from '@/utils/request';

export async function projectAdd(params:any) {            //2.5.1	总包添加项目
    return request('/yunzhu/project/info/add', params);
}
export async function projectUpdate(params:any) {         //2.5.2	修改项目
  return request('/yunzhu/project/info/update', params);
}
export async function projectList(params:any) {           //2.5.3	查询项目列表
  
  return request('/yunzhu/project/info/queryPage', params);
}


export async function cityGetAll(params:any|null) {        //省市区
  return request('/yunzhu/city/getAll',params);
}

export async function getProjectDetail(params: any) {     //2.5.5	项目详情
  return request('/yunzhu/project/info/getDatil',params);
}

