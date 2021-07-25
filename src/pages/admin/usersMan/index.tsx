import React from 'react';
import { Forms } from '@/components/Forms/forms'
import { Form } from '@ant-design/compatible';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { ArrowDownOutlined, ArrowUpOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Table, Modal, Input, Select, Row, Col, List, Tag, Radio,Descriptions,message,Upload,Switch } from 'antd';
import Request, { Delete, Get } from '@/utils/request'
import UploadS from '@/components/Upload/index'
import styles from './index.less';
import bgPng from './bgPng.png';
import RichTextEditor from '@/commonComponents/richText';
import defaultPng from './d.png';
let container: any | null = null;
let container1: any | null = null;
let editorState = null;
const { Option } = Select;
const { CheckableTag } = Tag;
const obj = {
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D',
  4: 'E'
}

const list = [
  {
    input: true,
    key: 'k',
    placeholder: '关键字'
  }
]

class DataPage extends React.Component {
  componentDidMount() {
    container = this;
    this.getList();
  }
  state = {
    list: [],
    loading: false,
    offset: 0,
    count: 10,
    total: 0,
    index: -1,
    k:'',
    top: '',
    visible: true,
  }
  
  onCurrentChange = (offset: number) => {
    this.setState({
      offset: offset - 1
    }, () => {
      this.getList()
    })
  };
  changeState(data){
    console.log(JSON.stringify(data) );

    Request('/psy/sys/user/update', {
      ...data,
      ...{
        'available':!data.available
      }
    }).then((res) => {
      this.getList();
    })
  }
  
  getList() {
    this.setState({
      loading: true
    })
    Request('/psy/sys/user/query', {
      k: this.state.k,
      offset: this.state.offset * this.state.count,
      count: this.state.count,
      online:-1,
      free:-1
    }).then((res) => {
      this.setState({
        loading: false,
        list: res.data.data,
        total: res.data.total_count
      })
    })
  }
  onSearch = (values)=>{
    console.log(values);
    this.setState({
      offset: 0,
      count: 10,
      k:values.k
    },()=>{
      this.getList();
    })
  }
  render() {
    let btns = [
      {
        label: '新增用户',
        props: {
          className: 'success_btn',
          onClick: () => { 
            console.log('123');
            container.refs.editUser.init();
          }
        }
      }
    ];
    return <div>
      <div className="module-title">
        {this.props.route.name}
      </div>
      <Forms
        btns={btns}
        onSearch={this.onSearch}
        list={list}
        reset={this.reset}
      />
      <div className="table-box">
       <Table pagination={{
            current: this.state.offset + 1,
            total: this.state.total,
            onChange: this.onCurrentChange,
            pageSize: this.state.count,
            showSizeChanger:false
            }} loading={this.state.loading} dataSource={this.state.list} columns={columns} />
      </div>
      <Resetpwd ref="resetpwd" callback={()=>this.getList()}/>
      <EditUser ref="editUser" callback={()=>this.getList()}/>
    </div>
  }
}



class EditUser extends React.Component{
  state = {
    "id":"",
    "mobile":"",
    "name":"",
    "is_admin":false,
    "id_number":"",
    "email":"",
    "pwd":'',
    "avatar":"",
    "gender":"1",
    "available":false,
    "visible":false
  }
  init(data:any){
    if(data){
      this.setState({
        ...data,
        ...{
          "visible":true
        }
      })
    }else{
      this.setState({
        ...{
          "visible":true
        }
      })
    }
  }
  handleOk = ()=>{
    console.log(this.state);
    let params = {
      ...this.state,
      ...{}
    }
    let url = '/psy/sys/user/update';
    if(this.state.id){
      url = '/psy/sys/user/update';
    }else{
      delete params['id'];
      url = '/psy/sys/user/add';
    }
    Request(url, params).then((res) => {
      this.handleCancel();
    })
  }
  handleCancel = ()=>{
    this.setState({
      "visible":false,
      "id":"",
      "mobile":"",
      "pwd":'',
      "name":"",
      "is_admin":false,
      "id_number":"",
      "email":"",
      "avatar":"",
      "gender":"男",
      "available":false,
    },()=>{
      this.props.callback&&this.props.callback();
    })
  }
  beforeUpload = ()=>{
    return false;
  }
  render(){
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
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return  <Modal title={
      this.state.id?'修改':'新增'
    }
     visible={this.state.visible} 
     onOk={this.handleOk}
      onCancel={this.handleCancel}>
        <Form {...formItemLayout}>
            <Form.Item label="头像">
              
              <UploadS renderHtml={
                this.state.avatar ? <img src={this.state.avatar} alt="avatar" style={{ width: '100%' }} /> : uploadButton
              } callback={(data)=>{
                this.setState({ 
                  avatar:data
                })
              }}/>
            </Form.Item>
            <Form.Item label="姓名">
              <Input value={this.state.name} onChange={(e)=>{
                this.setState({
                  name:e.target.value
                })
              }}/>
            </Form.Item>
            <Form.Item label="手机号">
              <Input value={this.state.mobile} onChange={(e)=>{
                this.setState({
                  mobile:e.target.value
                })
              }}/>
            </Form.Item>
            {
              !this.state.id&&<Form.Item label="密码">
              <Input value={this.state.pwd} onChange={(e)=>{
                this.setState({
                  pwd:e.target.value
                })
              }}/>
            </Form.Item>
            }
            <Form.Item label="性别">
              <Select value={this.state.gender} onChange={(value)=>{
                this.setState({
                  gender:value
                })
              }}>
                <Option value="男">男</Option>
                <Option value="女">女</Option>
              </Select>
            </Form.Item>
            <Form.Item label="管理员">
              <div >
                <Switch checked={this.state.is_admin} onChange={(checked)=>{
                  console.log(checked);
                  this.setState({
                    is_admin:checked
                  })
                }} />
              </div>
             
            </Form.Item>
        </Form>
      </Modal>
  }
}

class Resetpwd extends React.Component{
  state = {
    visible:false,
    npwd:'',
    spwd:'',
    id:'',
  }
  init(id:any){
    this.setState({
      visible:true,
      npwd:'',
      spwd:'',
      id:id,
    })
  }
  handleOk = ()=>{
    if(this.state.spwd!=this.state.npwd){
      message.error('两次输入的密码不一致');
      return;
    }
    Request('/psy/sys/user/resetpwd', {
      pwd:this.state.npwd,
      id:this.state.id
    }).then((res) => {
      this.setState({
        visible:false,
        pwd:'',
        npwd:'',
        spwd:''
      },()=>{
        this.props.callback&&this.props.callback();
      })
    })
  }
  render(){
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
    return <Modal title='修改密码'
    visible={this.state.visible} 
     onOk={this.handleOk}
     onCancel={()=>{
       this.setState({
         visible:false,
         pwd:'',
         npwd:''
       })
     }}>
       <Form {...formItemLayout}>
           <Form.Item label="新密码">
             <Input value={this.state.npwd} onChange={(e)=>{
               this.setState({
                 npwd:e.target.value
               })
             }}/>
           </Form.Item>
           <Form.Item label="确认密码">
             <Input value={this.state.spwd} onChange={(e)=>{
               this.setState({
                 spwd:e.target.value
               })
             }}/>
           </Form.Item>
       </Form>
     </Modal>
  }
}
const columns = [
  
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    key: 'mobile',
  },
  {
    title: '性别',
    dataIndex: 'gender',
    key: 'gender',
  },
    {
      title: '操作',
      dataIndex: 'scan',
      key: 'scan',
      width:"180px",
      render:(str,record)=>{
        return <div>
           <span className="link" onClick={()=>container.refs.editUser.init(record)}>编辑</span>
           <span className="link" onClick={()=>container.refs.resetpwd.init(record.id)}>重置密码</span>
           <span className="link" onClick={()=>container.changeState(record)}>
            {
              record.available?'停用':'启用'
            }

           </span>
          
           
        </div>
      }
    },
  ];

export default DataPage;