import request from '@/utils/request';

// 工资单接口

/*2.10.1	查询工资单
    pageNum         默认页数1
    rows            页数量
    projectId       项目id
    teamId          班组
    applyType       1代提交2待审批3审批中 4审批通过 5审批未通过6待复核  7复核中8               复核通过9复核未通过
    month           月份
    code         	工资单号
*/
export async function SalaryQuery(params: any) { 
  return request('/yunzhu/salary/query',params);
}

/*2.10.2	等我批复的工资单
    pageNum         默认页数1
    rows         
    userId          项目id
    code         	工资单号
*/
export async function SalaryQueryReview(params: any) { 
    return request('/yunzhu/salary/queryReview',params);
}

/*2.10.3	添加工资单
    userId         	制单人
    compId			公司        
    projectId       项目id
    teamId          班组
    month           月份
    code         	工资单号
    remark          备注
*/
export async function SalaryAdd(params: any) { 
    return request('/yunzhu/salary/add',params);
}

/*2.10.4	工资单详情
    salaryId        工资单id
*/
export async function SalaryGetDetail(params: any) { 
    return request('/yunzhu/salary/getDetail',params);
}

/*2.10.5	工资单删除
    salaryId        工资单id
*/
export async function SalaryDelete(params: any) { 
    return request('/yunzhu/salary/delete',params);
}

/*2.10.6	添加工资单详情
    salaryDetails   工资单详情json
*/
export async function SalaryDetailAdd(params: any) { 
    return request('/yunzhu/salary/detail/add',params);
}

/*2.10.7	修改工资单详情
    salaryDetails          工资单详情json
    salaryId          		工资单id
*/
export async function SalaryDetailUpdate(params: any) { 
    return request('/yunzhu/salary/detail/update',params);
}

/*2.10.8	修改工资单时获取最新工资单详情
    salaryId          		工资单id
*/
export async function SalaryDetailGetNewDetail(params: any) { 
    return request('/yunzhu/salary/detail/getNewDetail',params);
}

/*2.10.9	工资结算查询
    pageNum          默认页数1
    rows         
    projectId        项目id
    teamId           班组
    name             姓名/身份证
*/
export async function SalaryDetailQuery(params: any) { 
    return request('/yunzhu/salary/detail/query',params);
}

/*2.10.10	获取个人工资单列表
    userId 
*/
export async function SalaryDetailGetByUid(params: any) { 
    return request('/yunzhu/salary/detail/getByUid',params);
}

/*2.10.11	工资单提交审核
    salaryId        工资单
    reivewUid       指定审核人
    subUid          提交人
*/
export async function SalaryReviewSubReview(params: any) { 
    return request('/yunzhu/salary/review/subReview',params);
}

/*2.10.12	工资单审核
    reviewId        审批单
    applyType       审批状态 3审批通过 4审批未通过 6复核通过 7复核未通过
    nextUid         指定审核人
    salaryId        工资单
    isContract       指定总包审批 1
    remark         备注
*/
export async function SalaryReviewDoReview(params: any) { 
    return request('/yunzhu/salary/review/doReview',params);
}

/*2.10.13	获取工资单审批流水
    salaryId
*/
export async function SalaryReviewList(params: any) { 
    return request('/yunzhu/salary/review/list',params);
}

/*2.10.14	工资单撤回
    salaryId
*/
export async function SalaryReviewReturnReview(params: any) { 
    return request('/yunzhu/salary/review/returnReview',params);
}

/*2.10.15	获取工资审核人
    projectId
*/
export async function getReviewUser(params: any) { 
    return request('/yunzhu/salary/review/getReviewUser',params);
}
/*2.10.16	分批发放时获取分批添加内容
    salaryId        工资单id
    amount      	限定金额      

*/
export async function getBatchInfo(params: any) { 
    return request('/yunzhu/salary/grant/getBatchInfo',params);
}

/*2.10.17	添加全款发放
    salaryId        工资单id
    useId       	 发放人
    compId         公司
    amount         限定金额
	grantType       1直接发放 2银行代发 3融资发放 
*/
export async function addAll(params: any) { 
    return request('/yunzhu/salary/grant/addAll',params);
}

/*2.10.18	添加分批发放
    salaryId        工资单id
    userId       	发放人
    compId          公司
    grantType1      1直接发放 2银行代发 3融资发放 
    grantType2      1直接发放 2银行代发 3融资发放   
    count1          人数1   
    count2          人数2     		
    amountAll1      分批金额1
    amountAll2      分批金额2

*/
export async function addBatch(params: any) { 
    return request('/yunzhu/salary/grant/addBatch',params);
}

/*2.10.19	获取工资发放详情
    grantId        发放id

*/
export async function getGrantDetail(params: any) { 
    return request('/yunzhu/salary/grant/getDetail',params);
}

/*2.10.20	工资发放
    grantId        发放id

*/
export async function getLunch(params: any) { 
    return request('/yunzhu/salary/grant/lunch',params);
}

/*2.10.21	获取登录人作为工资管理人管理的项目
    userId        发放id
    compId
*/
export async function getSalaryProjects(params: any) { 
    return request('/yunzhu/project/info/getSalaryProjects',params);
}

 
/*2.10.22	取消分批
    salaryId        
*/
export async function getCancleBatch(params: any) { 
    return request('/yunzhu/salary/grant/cancleBatch',params);
}

/*2.10.23	上传发放工资凭证
    grantId 发放id
    file    附件
*/
export async function grantUpload(params: any) { 
    return request('/yunzhu/salary/grant/upload',params);
}

/*2.10.24	删除凭证
    grantId 发放id      
*/
export async function deletePhoto(params: any) { 
    return request('/yunzhu/salary/grant/deletePhoto',params);
}

/*2.10.24	总包发放管理查询
    pageNum         默认页数1
    rows            页数量
    subCompId       分包公司
    projectId       项目id
    teamId          班组
    applyType       1代提交2待审批3审批中 4审批通过 5审批未通过6待复核  7复核中8               复核通过9复核未通过
    month           月份
    code         	工资单号 
*/
export async function queryContract(params: any) { 
    return request('/yunzhu/salary/queryContract',params);
}