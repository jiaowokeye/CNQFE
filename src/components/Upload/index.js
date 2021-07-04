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

function getBase64(file) {
  if(file){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }else{
    return new Promise((resolve, reject) => {
      resolve('');
    });
  }
 
}
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
 
  customRequest = async (option)=>{
    const formData = new FormData();
    formData.append("files[]", option.file);
    const reader = new FileReader();
    reader.readAsDataURL(option.file);
    reader.onloadend = (e)=> {
      console.log(e.target.result);// 打印图片的base64
      this.props.callback&&this.props.callback(e.target.result);
      if (e && e.target && e.target.result) {
        option.onSuccess();
      }
    };

  } 
  render () {
    const { renderHtml,fileList } = this.state;
   
    return (
      <div className='upload_box'>
        <Upload  name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false} customRequest={this.customRequest} showUploadList={false}>
            {
              renderHtml
            } 

          </Upload>
      </div>
    );
  }
}

export default UploadS