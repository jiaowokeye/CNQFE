/* 
@flow
*/

import { Icon as LegacyIcon } from '@ant-design/compatible';

import { Button, Progress,Upload } from 'antd';
import React from 'react';
import './index.less';
import * as qiniu from 'qiniu-js'
import  Request,{Get} from '@/utils/request';
import moment from 'moment';

let uploadAPI = '/api/v1/upload';
if(process.env.NODE_ENV=="development"){
    uploadAPI = uploadAPI + '?ud=23'
}
console.log(uploadAPI);
class UploadS extends React.Component{

  state = {
    renderHtml: this.props.renderHtml,
    fileList: [],
  }


  UNSAFE_componentWillReceiveProps (n) {
    if (n.renderHtml !== this.props.renderHtml) {
      this.setState({
        renderHtml: n.renderHtml
      })
    } if (n.renderInsideHtml !== this.props.renderInsideHtml) {
      this.setState({
        renderInsideHtml: n.renderInsideHtml
      })
    }
  } 
 
  handleChange = (info)=>{
    console.log(info);
    console.log(info.data);
    let HOST = '';
    if(process.env.NODE_ENV!=='development'){
      HOST = 'https://www.chenyoung.cn/ntz_dev/api/v1';
    }else{
      HOST = '/psy';
    }
    this.props.callback&&this.props.callback(HOST+info.data);
  } 
  render () {
    const { renderHtml,fileList } = this.state;
   
    return (
      <div className='upload_box'>
        <Upload action="/psy/common/file/upload"   name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false} onSuccess={this.handleChange} showUploadList={false}>
            {
              renderHtml
            } 

          </Upload>
      </div>
    );
  }
}

export default UploadS