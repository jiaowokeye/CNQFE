import { MostRequest } from '@/tools/request';
export const GetNewsList = (params) => {
  /* 
  tag_id, sub_tag_id, offset = 1, count = 10,k


  offset偏移   count 是请求数量  offset是偏移量（从0开始的current

  eg   offset 0   count 20     offset 20   count29
  从第0条请求20条   从第20条起再请求20条
  */
  return new Promise((resolve, reject) => {
    MostRequest.Get('/v1/tag/document/list', {
      ...params,
      offset: (params.offset - 1) * params.count,
    }).then(res => {
      console.log(res);
      try {
        resolve(res.data);
      } catch{
        resolve(null);
      }
    }).catch(e => {
      console.log(e);
      resolve(null)
    })
  })
}
 
export const GetDocumentDetails = (id) => {
  return new Promise(resolve => {
    MostRequest.Get('/v1/document', {
      id
    }).then(res => {
      resolve(res.data)
    }).catch(() => {
      resolve(null)
    })
  })
}
