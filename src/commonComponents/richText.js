import { PictureFilled } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import React from 'react';
import './richText.less';
import {FormDataSubmit} from '@/utils/request';

class RichTextEditor extends React.Component {

  constructor(props) {
    super(props);
    const value = props.richText ? BraftEditor.createEditorState(props.richText) : null
    this.state = {
      editorState: value
    };
    this.extendControls = [
      {
        key: 'antd-uploader',
        type: 'component',
        component: (
          <Upload
            accept="image/*"
            action={`/v1/upload`}
            showUploadList={false}
            onChange={this.handleChange}
            customRequest={this.myUploadFn}
          >
            {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
            <Button
              style={{ border: 0 }}
              className='control-item button button-indent-increase'
              data-title="插入图片">
              <PictureFilled />
            </Button>
          </Upload>
        )
      }
    ]
  }

  handleChange = (file) => {
    console.log(file);
  }

  UNSAFE_componentWillReceiveProps (nextPorps) {
    if (this.props.richText !== nextPorps.richText) {
      this.setState({
        editorState: BraftEditor.createEditorState(nextPorps.richText)
      })
    }
  }

  componentDidMount () {
  }

  myUploadFn = (param) => {
    let serverURL = '';
    if(process.env.NODE_ENV!=='development'){
      serverURL = 'https://www.emeast.com/pa/api/v1/sys/file/upload';
    }else{
      serverURL = '/psy/sys/file/upload';
    }

    const xhr = new XMLHttpRequest();
    const fd = new FormData();

    const successFn = (response) => {
      const upLoadObject = JSON.parse(response && response.currentTarget && response.currentTarget.response);
      param.success({
        url: upLoadObject.data,
        meta: {
          id: upLoadObject && upLoadObject.id,
          title: upLoadObject && upLoadObject.fileName,
          alt: upLoadObject && upLoadObject.fileName,
          loop: false, // 指定音视频是否循环播放
          autoPlay: false, // 指定音视频是否自动播放
          controls: false, // 指定音视频是否显示控制栏
          poster: '', // 指定视频播放器的封面
        }
      })
    };
    const progressFn = (event) => {
      param.progress(event.loaded / event.total * 100)

    };
    const errorFn = (response) => {
      param.error({
        msg: 'unable to upload.'
      })
    };
    
    xhr.upload.addEventListener("progress", progressFn, false);
    xhr.addEventListener("load", successFn, false);
    xhr.addEventListener("error", errorFn, false);
    xhr.addEventListener("abort", errorFn, false);
    fd.append('file', param.file);
    xhr.open('POST', serverURL, true);
    xhr.send(fd)
  }

  onSave = () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = this.state.editorState?this.state.editorState.toHTML():'<p></p>';
    return htmlContent

  }

  handleEditorChange = (editorState) => {
    this.setState({ editorState },()=>{
      const htmlContent = this.state.editorState?this.state.editorState.toHTML():'<p></p>';
      this.props.changeStr&&this.props.changeStr(htmlContent);
    })
  }


  render () {
    const { editorState } = this.state;
    return (
      <div>
        <BraftEditor
          value={editorState}
          onChange={this.handleEditorChange}
          onSave={this.onSave}
          media={{ uploadFn: this.myUploadFn }}
        // extendControls={this.extendControls}
        />
      </div>
    )
  }
}


export default RichTextEditor