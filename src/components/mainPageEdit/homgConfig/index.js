import { MostRequest } from '@/tools/request';
import MiddleFormItem from '@com/middleForm';
import UploadS from '@com/upload';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Modal, notification, Typography } from 'antd';
import React from 'react';
import './index.less';
import { GetPageConfig } from '../../../tools/tools';
import RichTextEditor from '@com/richText';

const { Paragraph } = Typography;
class HomeConfig extends React.Component {

  state = {
    config: '',
    bottomBanner: '',//底部banner
    testUrl: '无',//获取上传图片地址
    richText: null,
  }

  componentDidMount () {
    this.getConfig()
  }

  getConfig () {
    GetPageConfig().then(res => {
      this.setFormsValue(res);
    }).catch(e => {
      console.log(e);
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const params = {
          k: 'system_setting_normal_setting',
          v: {
            ...fieldsValue,
            bottomBanner: this.state.bottomBanner,
            rich_text: this.rich_text.onSave(),
          }
        };
        this.saveConfig(params)
      }
    })
  }
  setFormsValue (data) {
    this.setState({
      bottomBanner: data.bottomBanner,
      richText: data.rich_text
    }, () => {
      this.props.form.setFieldsValue({
        party_link: data.party_link,
        partyOrgImg: data.partyOrgImg,
        party_link_img: data.party_link_img,
        new_link: data.new_link,
        new_link_img: data.new_link_img,
        elegant_link: data.elegant_link,
        elegant_link_img: data.elegant_link_img,
        affairs_link: data.affairs_link,
        affairs_link_img: data.affairs_link_img,
        bitMapImg: data.bitMapImg,
      });
    });
  }
  saveConfig = (params) => {
    MostRequest.Post('/v1/config', params).then(res => {
      notification.success({
        message: '保存成功',
      });
      GetPageConfig();
    }).catch(e => {
      console.log(e);
    })
  }

  preCover = () => {
    Modal.info({
      title: '封面图',
      content: (
        <img onClick={this.preCover} src={this.state.bottomBanner} alt='' className='pre_upload_cover_image' />
      ),
    });
  }

  onUploadSuccess = (bottomBanner) => {
    this.setState({
      bottomBanner
    })
  }
  onUploadImgSuccess = (testUrl) => {
    this.setState({
      testUrl
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form;
    const { bottomBanner, testUrl, richText } = this.state;
    return (
      <Form
        style={{ width: '100%' }}
        onSubmit={this.handleSubmit}
      >
        <div className="home_banner">
          <MiddleFormItem
            label='首页底部banner'
            key_='img'
            className='img_item'
            renderHtml={() => (
              <div>
                <UploadS
                  accept="image/png, image/jpeg, image/jpg"
                  renderHtml={bottomBanner ? <img onClick={this.preCover} src={bottomBanner} alt='' className='upload_cover_image' /> : null}
                  onUploadSuccess={this.onUploadSuccess}
                />
              </div>

            )}
          />
          <MiddleFormItem
            getFieldDecorator={getFieldDecorator}
            label='新时代党建banner'
            key_='partyOrgImg'
          />
          <hr />
          <MiddleFormItem
            getFieldDecorator={getFieldDecorator}
            label='首页习近平文汇'
            key_='bitMapImg'
          />
          <hr />
          <MiddleFormItem
            getFieldDecorator={getFieldDecorator}
            label='党建链接'
            key_='party_link'
          />
          <MiddleFormItem
            getFieldDecorator={getFieldDecorator}
            label='党建图片'
            key_='party_link_img'
          />
          <hr />
          <MiddleFormItem
            getFieldDecorator={getFieldDecorator}
            label='要闻链接'
            key_='new_link'
          />
          <MiddleFormItem
            getFieldDecorator={getFieldDecorator}
            label='要闻图片'
            key_='new_link_img'
          />
          <hr />
          <MiddleFormItem
            getFieldDecorator={getFieldDecorator}
            label='风采链接'
            key_='elegant_link'
          />
          <MiddleFormItem
            getFieldDecorator={getFieldDecorator}
            label='风采图片'
            key_='elegant_link_img'
          />
          <hr />
          <MiddleFormItem
            getFieldDecorator={getFieldDecorator}
            label='党务专区链接'
            key_='affairs_link'
          />
          <MiddleFormItem
            getFieldDecorator={getFieldDecorator}
            label='党务专区图片'
            key_='affairs_link_img'
          />
          <hr />
          <MiddleFormItem
            getFieldDecorator={getFieldDecorator}
            label='积分规则编辑'
            key_='2a'
            renderHtml={() => (
              <RichTextEditor
                richText={richText}
                ref={rich => this.rich_text = rich} />
            )}
          />
        </div>
        <Button className='success_btn' htmlType="submit">保存</Button>
        <hr />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ paddingRight: 20 }}>获取图片地址</span>
          <UploadS
            accept="image/png, image/jpeg, image/jpg"
            onUploadSuccess={this.onUploadImgSuccess}
          />
        </div>
        <Paragraph copyable>{testUrl}</Paragraph>
      </Form>
    )
  }
}
const HomeConfig_ = Form.create({ name: 'HomeConfig' })(HomeConfig);
export default HomeConfig_