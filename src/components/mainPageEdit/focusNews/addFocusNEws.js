import { LeftOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, message, Modal, Input, DatePicker,Table } from 'antd';
import React from 'react';
import MiddleFormItem from '@/commonComponents/middleForm';
import RichTextEditor from '@/commonComponents/richText';
import Switch from '@/commonComponents/switch';
import UploadS from '@/components/Upload/index';
import './addFocusNews.less';
import { GetUrlParams, FormatDateStr } from '@/tools/tools';
import Request,{Get} from '@/utils/request';
import moment from 'moment';
import {setCallBack,showBack} from '@/layouts/BasicLayout';
class AddFocusNews_ extends React.Component {
 
  constructor(props) {
    super(props);
    this.state = {
      is_online: false,
      tag_id: props.page_id,
      id: props.id,
      sub_tag_id: '',
      cover_image: null,
      video_: null,
      richText: null,
      author_name:'',
      author_from:'',
      pubdate:'',
      annexes:[],
      index: -1,
      top: '',
      visible: true,
      visibleType:1,// 1作者 2标题
    }
  }

  componentDidMount () {
    // if (!this.state.tag_id) {
    //   this.props.history.goBack();
    // }
    showBack(true);
    setCallBack(()=>{
      this.props.goBack();
    });
    this.setState({
      id:this.props.form.getFieldValue('id')?this.props.form.getFieldValue('id'):''
    },()=>{
      this.state.id && this.getDocumentDetail();
    })
  }
  componentWillUnmount() {
    showBack(false);
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        if (this.state.id) {
          this.update({
            ...fieldsValue,
            // publish_time: (new Date(fieldsValue['publish_time'].format('YYYY-MM-DD')).getTime()),
            id: this.state.id,
            title:this.state.title
          })
        } else {
          this.query({
            ...fieldsValue,
            title:this.state.title
            // publish_time: (new Date(fieldsValue['publish_time'].format('YYYY-MM-DD')).getTime())
          })
        }

      }
    })
  }
  //
  getDocumentDetail () {
    Get('/psy/portlet/article/get/'+this.state.id, {}).then((res) => {
      if (res.data) {
        this.setFormsValue(res.data)
      }
    })
  }

  setFormsValue (data) {
    this.setState({
      is_online: data.is_online,
      cover_image: data.image,
      title: data.title,
      video_: data.media_url,
      richText: data.content,
      author_name:data.original_author.name,
      author_from:data.original_author.url,
      pubdate:data.pubdate,
      annexes:data.annexes?data.annexes:[],
    }, () => {
      this.props.form.setFieldsValue({
        author_name: data.name,
        from: data.from,
        publish_time: moment(FormatDateStr(data.publish_time), 'YYYY-MM-DD'),
      });
    });
  }

  query (value) {
    console.log(this.rich_text);
    const { tag_id, sub_tag_id, is_online, cover_image, video_ ,annexes} = this.state;
    const sub_tag_ids = sub_tag_id ? [sub_tag_id] : [];
    let data = {
      ...value,
      page_id: tag_id,
      sub_tag_ids, 
      content: this.rich_text.onSave(),
      is_online: is_online,
      images: [],
      image: cover_image,
      // videos: [{ url: video_ }],
      annexes:annexes,
      pubdate:Number(this.state.pubdate),
      "original_author": {
        //author_name:data.original_author.name,
        "name": this.state.author_name,
        "avatar": '',
        "url": this.state.author_from,
      },
    }
    if(this.rich_text.onSave()==='<p></p>'){
      message.error('内容不能为空')
      return;
    }

    Request('/psy/portlet/article/add', data).then((res) => {
      this.props.goBack();
    })
  }

  update (value) {
    const { tag_id, sub_tag_id, is_online, cover_image, video_,annexes } = this.state;
    const sub_tag_ids = sub_tag_id ? [sub_tag_id] : [];
    let data = {
      ...value,
      page_id: tag_id,
      sub_tag_ids, 
      id:this.state.id,
      content: this.rich_text.onSave(),
      is_online: is_online,
      images: [],
      image: cover_image,
      pubdate:this.state.pubdate,
      annexes:annexes,
      "original_author": {
        //author_name:data.original_author.name,
        "name": this.state.author_name,
        "avatar": '',
        "url": this.state.author_from,
      },
    }
    // if(video_){
    //   data = this.checkAnnex(data,video_);
    // }
    
    Request('/psy/portlet/article/update', data).then((res) => {
      this.props.goBack();
    })
  }
  checkAnnex = (url)=>{
    const annexType = url.split('.').slice(-1)[0].toLowerCase();
    let media_type = 'video';
    if(annexType=='mp3'){
      media_type = 'audio';
    }
    return media_type;
  }
  onSwitchChange = (value) => {
    this.setState({
      is_online: value
    })
  }

  onUploadSuccess = (cover_image) => {
    this.setState({
      cover_image
    })
  }
  onUploadVideoSuccess = (url) => {
    const annexes = this.state.annexes.concat([]);
    annexes.push({
      sno:annexes.length,
      title:'',
      media_type:this.checkAnnex(url),
      media_url:url,
    })
    this.setState({
      annexes:annexes
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
  // index 下标 type 1-作者 2-标题
  toTop(index,type) {
    const top = type==1?this.state.annexes[index]['content']:this.state.annexes[index]['title'];
    this.setState({
      index: index,
      top: top,
      visible: true,
      visibleType:type
    })
  }
  handleOk = () => {
    // this.setState({
    //   visible: false,
    // });
    
    let annexes = this.state.annexes.concat([]);
    if(this.state.visibleType==1){
      annexes[this.state.index]['content'] = this.state.top
    }else{
      annexes[this.state.index]['title'] = this.state.top
    }
    this.setState({
      annexes:annexes,
      visible:false
    })
  };
  render () {
    const { getFieldDecorator } = this.props.form;
    const { is_online, cover_image, richText, annexes } = this.state;
    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        render:(text,record,index)=>{
          return this.state.visible&&this.state.visibleType==2 && this.state.index == index ? <div>
          <Input value={this.state.top} addonAfter={<div onClick={() => this.handleOk()}>确定</div>} onChange={(e) => this.setState({ top: e.target.value })} />
        </div> : <div onClick={() => this.toTop(index,2)}>{text?text:'点击修改标题'}</div>
        }
      },
      {
        title: '类型',
        dataIndex: 'media_type',
        key: 'media_type',
        render:(text,record,index)=>{
          return <div>
            {
              text=='video'?'视频':'音频'
            }
          </div>
        }
      },
      {
        title: '播放地址',
        dataIndex: 'media_url',
        key: 'media_url',
      },
      {
        title: '作者',
        dataIndex: 'content',
        key: 'content',
        render:(text,record,index)=>{
          return this.state.visible &&this.state.visibleType==1&& this.state.index == index ? <div>
          <Input value={this.state.top} addonAfter={<div onClick={() => this.handleOk()}>确定</div>} onChange={(e) => this.setState({ top: e.target.value })} />
        </div> : <div onClick={() => this.toTop(index,1)}>{text?text:'点击修改作者'}</div>
        }
      },
      {
        title: '操作',
        dataIndex: 'scan',
        key: 'scan',
        width:'100px',
        render:(text,record,index)=>{
          return <span className="link">删除</span>
        }
      },
    ]
    return (
      <div className='add_focus_news'>
        <Form
          onSubmit={this.handleSubmit}
        >
          <MiddleFormItem
            getFieldDecorator={getFieldDecorator}
            label='标题'
            require={true}
            renderHtml={() => (
              <Input value={this.state.title} onChange={(e)=>this.setState({
                title:e.target.value
              })}/>
            )}
          />

          <div className="line_form_item between_flex">
            <MiddleFormItem
              getFieldDecorator={getFieldDecorator}
              label='作者'
              key_='author_name'
              renderHtml={() => (
                <Input value={this.state.author_name} onChange={(e)=>this.setState({
                  author_name:e.target.value
                })}/>
              )}
            />
            
            <MiddleFormItem
              getFieldDecorator={getFieldDecorator}
              label='来源'
              key_='from'
              renderHtml={() => (
                <Input value={this.state.author_from} onChange={(e)=>this.setState({
                  author_from:e.target.value
                })}/>
              )}
            />
            <MiddleFormItem
              getFieldDecorator={getFieldDecorator}
              label='发布时间'
              key_='pubdate'
              type='time'
              renderHtml={() => (
                <div>
                    <DatePicker value={this.state.pubdate?moment(this.state.pubdate):''} onChange={(val,str)=>{
                      this.setState({
                        pubdate:str
                      })
                    }} />
                </div>
               
              )}
            />

            <MiddleFormItem
              label='是否上架'
              className='img_item'
              key_='online'
              renderHtml={() => (
                <Switch
                  onSwitchChange={this.onSwitchChange}
                  selected={is_online} />
              )}
            />
          </div>

          <div>
            {!this.props.nocover_image&&<MiddleFormItem
              label='标题图片'
              key_='img'
              className='img_item'
              renderHtml={() => (
                <div>
                  <UploadS
                    accept="image/png, image/jpeg, image/jpg"
                    renderHtml={cover_image ? <img onClick={this.preCover} src={cover_image} alt='' className='upload_cover_image' /> : null}
                    onUploadSuccess={this.onUploadSuccess}
                  />
                </div>

              )}
            />}
            {
              this.props.hasVideo&&<MiddleFormItem
              label='附件'
              className='img_item'
              renderHtml={() => (
                <div>
                  <UploadS
                    accept=".mp4,.mp3"
                    renderInsideHtml={
                      <Input  style={{
                        cursor:'pointer',
                        width:'200px'
                      }}  placeholder="选择附件" disabled className='chooseInput'/>
                    }
                    renderHtml={<div>
                      <Table pagination={false} dataSource={annexes} columns={columns} />
                    </div>}
                    onUploadSuccess={this.onUploadVideoSuccess}
                  />
                </div>
              )}
            />
            }
            
            
          </div>

          <MiddleFormItem
            label='内容'
            renderHtml={() => (
              <RichTextEditor
                richText={richText}
                ref={rich => this.rich_text = rich} />
            )}
          />

          <div className="btn_box between_flex">
            
            <div></div>
            <div>
              <Button className='success_btn' htmlType="submit">
                保存
              </Button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}
const AddFocusNews = Form.create({ 
  name: '',
  goBack(){
    props.goBack()
  },
  mapPropsToFields(props) {
    return {
      id: Form.createFormField({
        ...props.id,
        value: props.id,
      }),
      page_id: Form.createFormField({
        ...props.page_id,
        value: props.page_id,
      }),
      nocover_image: Form.createFormField({
        ...props.nocover_image,
        value: props.nocover_image,
      }),
      hasVideo: Form.createFormField({
        ...props.hasVideo,
        value: props.hasVideo,
      }),
    };
  },
})(AddFocusNews_);
export default AddFocusNews