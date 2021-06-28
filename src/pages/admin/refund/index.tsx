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
import moment from 'moment';
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
    Request('/psy/mng/refund/query', {
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
        label: '导出退款结果',
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
            pageSize: this.state.count
            }} loading={this.state.loading} dataSource={this.state.list} columns={columns} />
      </div>

      <EditUser ref="editUser" callback={()=>this.getList()}/>
    </div>
  }
}



class EditUser extends React.Component{
  state = {
    "id":"",
    "visible":false,
    "message":''
  }
  init(id){
    this.setState({
      "id":id,
      "visible":true,
      "message":''
    })
  }
  approved = ()=>{
    if(this.state.message==''){
      message.error('请输入审批意见')
      return;
    }
    Request('/psy/mng/refund/approved', {
      refund_id:this.state.id,
      message:this.state.message
    }).then((res) => {
      this.handleCancel();
    })
  }
  refuse = ()=>{
    if(this.state.message==''){
      message.error('请输入审批意见')
      return;
    }
    Request('/psy/mng/refund/refuse', {
      refund_id:this.state.id,
      message:this.state.message
    }).then((res) => {
      this.handleCancel();
    })
  }
  handleCancel = ()=>{
    this.setState({
      "visible":false,
      "id":"",
      "message":''
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
    return  <Modal title='退款审批'
     visible={this.state.visible} 
     centered
     footer={<div>
      <div className="ant-btn success_btn" onClick={()=>this.approved()} style={{marginRight:'15px'}}>同意</div>
      <div className="ant-btn error_btn" onClick={()=>this.refuse()}>驳回</div>

    </div>}
      onCancel={this.handleCancel}>
        <Form {...formItemLayout}>
            
            <Form.Item label="审核意见">
              <Input value={this.state.message} onChange={(e)=>{
                this.setState({
                  message:e.target.value
                })
              }}/>
            </Form.Item>
        </Form>
      </Modal>
  }
}
const columns = [
  
  {
    title: '描述',
    dataIndex: 'describe',
    key: 'describe',
  },
  {
    title: '申请退款时间',
    dataIndex: 'apply_time',
    key: 'apply_time',
    render(str,record){
      return <div>
        {moment(record.apply_time).format('YYYY-MM-DD')}
      </div>
    }
  },
  {
    title: '退款时间',
    dataIndex: 'check_time',
    key: 'check_time',
    render(str,record){
      return <div>
        {record.check_time!=0?moment(record.check_time).format('YYYY-MM-DD'):''}
      </div>
    }
  },
    {
      title: '操作',
      dataIndex: 'scan',
      key: 'scan',
      width:"90px",
      render:(str,record)=>{
        const stateObj = {
          '审批中':'审批中',
          'refused':"已驳回",
          'refunded':'已通过'
        }
        return <div>
            {
              record.state=='审批中'?<span className="link" onClick={()=>container.refs.editUser.init(record.id)}>去审批</span>:<span className="link" style={{color:'#333'}}> {stateObj[record.state]}</span>
            }
           
          
        </div>
      }
    },
  ];

export default DataPage;