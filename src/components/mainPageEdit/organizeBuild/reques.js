import { MostRequest } from '@/tools/request';
import '@com/richText.less';
export const GetOrgList = () => {
  return new Promise((resolve, reject) => {
    MostRequest.Get('/v1/document/org_building').then(res => {
      resolve(res)
    }).catch(e => {
      reject(e)
    })
  })
}


export const SaveOrgBuild = ({title, rich_text, id, cover_image}) => {
  const params = {
    title, rich_text,
    cover_image
  }
  if (!id) {
    params['type'] = 'org_building';
  } else {
    params['id'] = id;
  }
  return new Promise((resolve, reject) => {
    MostRequest.Post('/v1/document/create', params).then(res => {
      resolve(res);
    }).catch((e) => {
      reject(e)
    })
  })
}