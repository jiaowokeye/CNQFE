import request from '@/utils/request';

export async function getCompInfo(params:any) { //公司详情
    return request('/yunzhu/comp/get', params);
}



