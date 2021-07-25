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
    loading: false,
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
    this.props.callback&&this.props.callback(info.data,this.imageUrl);
  } 

  handleChange1 = info => {
    getBase64(info.file.originFileObj, imageUrl =>
      this.imageUrl = imageUrl
    );
  };

  render () {
    const { renderHtml,fileList } = this.state;
    
    return (
      <div className='upload_box'>
        <Upload  onChange={this.handleChange1} withCredentials={true}  action={this.props.action}  name="file"
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
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default UploadS