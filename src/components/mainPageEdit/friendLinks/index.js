import React from 'react'
import './index.less'
import Title from '@com/title'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Modal, Table } from 'antd';
import '@com/switch.less';
import Switch from '@com/switch';
import { MostRequest } from '@/tools/request';
class FriendPage extends React.Component {

  state = {
    is_online: false,
    id:'',
    title: '',
    url: '',
    list: [],
    visible:false
  }

  componentDidMount () {
    this.getF()
  }

  getF () {
    MostRequest.Get('/v1/friend_link/list').then(res => {
      this.setState({
        list: res.data || []
      })
    }).catch(e => {
      console.log(e);
    })
  }

  addFunc = () => {
    const { is_online, title, url,id } = this.state;
    if(id){
      MostRequest.Put('/v1/friend_link', {
        is_online, title, url,id
      }).then(res => {
        this.setState({
          visible: false,
        });
        this.getF()
      }).catch(e => {
        console.log(e);
      })
    }else{
      MostRequest.Post('/v1/friend_link', {
        is_online, title, url
      }).then(res => {
        this.setState({
          visible: false,
        });
        this.getF()
      }).catch(e => {
        console.log(e);
      })
    }
    
  }

  DelFunc = (id) => {
    MostRequest.Post('/v1/del', {
      coll_name: 'friend_link',
      ids: [id]
    }).then(res => {
      this.getF()
    }).catch(e => {
      console.log(e);
    })
  }
  showModal = (info) => {
    if(info){
      this.setState({
        visible: true,
        is_online: info.is_online,
        id:info.id,
        title: info.title,
        url: info.url,
      });
    }else{
      this.setState({
        visible: true,
        is_online: false,
        id:'',
        title: '',
        url: '',
      });
    }
    
  };

  handleOk = e => {
    console.log(e);
    this.addFunc();
    
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  render () {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };
    const { is_online, title, url, list } = this.state;
    const columns = [
      {
        title: '网站名称',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '网站地址',
        dataIndex: 'url',
        key: 'url',
      },
      {
        title: '是否上线',
        dataIndex: 'is_online',
        key: 'is_online',
        render:(text)=>{
        return <span>{text?'是':'否'}</span>
        }
      },
      {
        title: '操作',
        dataIndex: 'scan',
        key: 'scan',
        width:'100px',
        render:(text,record)=>{
        return <div>
          <a style={{marginRight:'10px'}} onClick={()=>this.showModal(record)}>编辑</a>
          <a onClick={()=>this.DelFunc(record.id)}>删除</a>
        </div>
        }
      },
    ];
    
    
    return (
      <div className='friend_page'>
        <div className="friend_header">
          <Title
            className='focus_news_title'
            title={'友情链接'} 
          />
          <button className="ant-btn success_btn" onClick={()=>this.showModal()}>添加</button>
        </div>
        <div className="table-box">
        <Table dataSource={list} columns={columns} pagination={false}/>
        </div>
        
        <Modal
          title="友情链接"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form {...formItemLayout}>
            <Form.Item label="网站名称">
              <Input
                value={title}
                placeholder=''
                onChange={e => this.setState({ title: e.target.value })} />
            </Form.Item>
            <Form.Item label="网站地址">
              <Input
                value={url}
                placeholder=''
                onChange={e => this.setState({ url: e.target.value })} />
            </Form.Item>
            <Form.Item label="是否上线">
              <div style={{paddingTop:'8px'}}>
              <Switch
                  selected={is_online}
                  onSwitchChange={is_online => this.setState({ is_online })}
                />
              </div>
              
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

const List = (props) => (
  <div className='friend_page_list between_flex'>
    <span>{props.data.title}</span>
    <span
      onClick={() => props.onDelete(props.data.id)}
      className='link'>删除</span>
  </div>
)


export default FriendPage