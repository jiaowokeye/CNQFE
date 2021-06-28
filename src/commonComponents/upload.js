/* 
@flow
*/

import { Icon as LegacyIcon } from '@ant-design/compatible';

import { Button, Upload, Progress } from 'antd';
import React from 'react';
import './upload.less';
import * as qiniu from 'qiniu-js'
import { MostRequest } from '@/tools/request';
import moment from 'moment';
let uploadAPI = '/api/v1/upload';
if (window.DEV) {
  uploadAPI = uploadAPI + '?ud=23'
}
console.log(uploadAPI);
type Props = {
  onUploadSuccess: Function,//上传成功的回调
  renderHtml: any,// 扩展
  renderInsideHtml: any,//渲染到组件内部  可以点击上传
  accept: any,//上传的格式
}

class UploadS extends React.Component<Props, any> {

  state = {
    loading: false,
    renderHtml: this.props.renderHtml,
    accept: this.props.accept || null,
    renderInsideHtml: this.props.renderInsideHtml || null,
    percent:0
  }

  handleChange = (info: Object) => {
    // if (info.file.status === 'uploading') {
    //   this.setState({ loading: true });
    //   return;
    // }
    // if (info.file.status === 'done') {
    //   // Get this url from response in real world.
    //   this.setState({ loading: false });
    //   this.props.onUploadSuccess && this.props.onUploadSuccess(info.file.response.data);
    // }
    // if (info.file.status === 'error') {
    //   this.setState({ loading: false });
    // }
  };

  UNSAFE_componentWillReceiveProps (n: Props) {
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
  getToken(){
    return MostRequest.Get('/v1/upload/qiniu_upload_token')
  }
  customRequest(data){
    const _this = this;
    this.getToken().then((res)=>{
      const date = moment().format('YYYY/MM/DD')+"/"+new Date().getTime();
      var observable = qiniu.upload(data.file, date+'_'+data.file.name, res.data, {
        fname: "",
        mimeType: null,
      }, {disableStatisticsReport: false,
        region: "z2",
        retryCount: 6,
        useCdnDomain: true})
      var observer = {
        next(response){
          var total = response.total;
          _this.setState({
            percent:parseInt(total.percent)
          })
          // ...
          //this.setState({ loading: true });
        },
        error(err){
          console.log(err);
          //this.setState({ loading: false });
        }, 
        complete(res){
          _this.setState({
            loading: false,
            renderHtml:res.key
          })
          //this.setState({ loading: false });
          const label_keys = _this.props.label_keys?_this.props.label_keys:'';
          _this.props.onUploadSuccess && _this.props.onUploadSuccess('https://file.dangjianos.com/'+res.key,label_keys,data.file.name);
        }
      }
      observable.subscribe(observer) // 上传开始
      this.setState({
        loading:true
      })
    });
    
  }
  render () {
    const { loading, renderHtml, renderInsideHtml, accept } = this.state;
    const prop = {};
    if (accept) {
      prop.accept = accept;
    }
    return (
      <div className='upload_box'>
        <Upload
          name='file'
          {...prop}
          showUploadList={false}
          onChange={this.handleChange}
          customRequest={this.customRequest.bind(this)}
          beforeUpload={this.beforeUpload}
          // action={uploadAPI}
        >
          {
            renderInsideHtml || <Button>
              {
                loading&&this.props.showProgress?<Progress type="circle" width={20} percent={this.state.percent} size="small"/>:<LegacyIcon type={'upload'} />
              }
              
              
            </Button>
          }
        </Upload>
        {
          renderHtml && renderHtml
        }
      </div>
    );
  }
}

export default UploadS