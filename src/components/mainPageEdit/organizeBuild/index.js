import React from 'react'
import VerticalForm from '@com/verticalForm';
import './index.less'
import MiddleFormItem from '@com/middleForm';
import { Button, Modal,notification } from 'antd';
import RichTextEditor from '@com/richText';
import { GetOrgList, SaveOrgBuild } from './reques';
import UploadS from '@com/upload';

class OrganizeBuild extends React.Component {

  state = {
    id: null,
    title: '',
    richText: null,
    cover_image: null
  }

  componentDidMount () {
    GetOrgList().then(res => {
      this.setState({
        title: res.data.title,
        richText: res.data.rich_text,
        cover_image: res.data.cover_image
      })
    }).catch(e => {
      console.log(e);
    })
  }

  saveOrgBuild = () => {
    const { id, title, cover_image } = this.state;
    SaveOrgBuild({ title, rich_text: this.rich_text.onSave(), id, cover_image }).then(res => {
      notification.success({
        message: '操作成功',
      });
    }).catch(e => {
      notification.error({
        message: '操作失败',
      });
    })
  }

  onChange = (value) => {
    this.setState({
      title: value
    })
  }

  onUploadSuccess = (cover_image) => {
    this.setState({
      cover_image
    })
  }
  preCover = () => {
    Modal.info({
      title: '封面图',
      content: (
        <img onClick={this.preCover} src={this.state.cover_image} alt='' className='pre_upload_cover_image' />
      ),
    });
  }
  render () {
    const { richText, title, cover_image } = this.state;
    return (
      <div className='organize_build'>
        <VerticalForm
          onChange={this.onChange}
          require
          value={title}
          controlValue
          label='部门名称' />
        <div>
          <MiddleFormItem
            label='组织建设图片'
            key_='img'
            className='img_item'
            renderHtml={() => (
              <div>
                <UploadS
                  renderHtml={cover_image ? <img onClick={this.preCover} src={cover_image} alt='' className='upload_cover_image' /> : null}
                  onUploadSuccess={this.onUploadSuccess}
                />
              </div>

            )}
          />
        </div>
        <div>

          <p className='organize_title_'>内容</p>
          <RichTextEditor
            richText={richText}
            ref={rich => this.rich_text = rich} />
        </div>
        <div className="btn_box">
          <Button className='cancel_btn'>取消</Button>
          <Button onClick={this.saveOrgBuild} className='success_btn'>保存修改</Button>
        </div>
      </div>
    )
  }
}

export default OrganizeBuild