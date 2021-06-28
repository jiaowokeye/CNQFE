import { MostRequest } from '@/tools/request';

export const SaveBanner = (params) => {
  return new Promise((resolve, reject) => {
    MostRequest.Post('/v1/banner', params).then(res => {
      resolve(res)
    }).catch(e => {
      reject(e);
    })
  })
}

export const UpdateBanner = (params) => {
  return new Promise((resolve, reject) => {
    MostRequest.Put('/v1/banner', params).then(res => {
      resolve(res)
    }).catch(e => {
      reject(e);
    })
  })
}