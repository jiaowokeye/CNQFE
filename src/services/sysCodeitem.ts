import request from '@/utils/request';

export async function Query(params:any) {                   //2.8	公司码表 2.8.4	查询
    return request('/yunzhu/sysCodeitem/query', params);
}

export async function Add(params:any) {                     //添加
    return request('/yunzhu/sysCodeitem/add', params);
}
export async function Update(params:any) {                  //修改
    return request('/yunzhu/sysCodeitem/update', params);
}
export async function Delete(params:any) {                  //删除
    return request('/yunzhu/sysCodeitem/delete', params);
}

