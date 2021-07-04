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
    visible1:false,
    message:'',
    refundid:''
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
    Request('/psy/mng/membercard/query', {
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
  refundModal = (id)=>{
    this.setState({
      visible1:true,
      message:'',
      refundid:id
    })
  }
  refund=()=>{
    let _this = this;
    Modal.confirm({
      title: '确认发起退款？',
      content: '',
      onOk() {
        Request('/psy/mng/refund/apply', {
          busi_type:'card',
          busi_id:_this.state.refundid,
          reason:_this.state.message
         }).then((res) => {
           _this.setState({
             visible1:false
           },()=>{
             _this.getList();
           })
         })
      },
      onCancel() {
        
      },
    });
  }
  render() {
    let btns = [
     
    ];
    return <div>
      <div className="module-title">
        {this.props.route.name}
      </div>
      {/* <Forms
        btns={btns}
        onSearch={this.onSearch}
        list={list}
        reset={this.reset}
      /> */}
      <div className="table-box">
       <Table pagination={{
            current: this.state.offset + 1,
            total: this.state.total,
            onChange: this.onCurrentChange,
            pageSize: this.state.count,
            showSizeChanger:false
            }} loading={this.state.loading} dataSource={this.state.list} columns={columns} />
      </div>

      <EditUser ref="editUser" callback={()=>this.getList()}/>

      <Modal title='退款申请'
        visible={this.state.visible1} 
        centered
        bodyStyle={{
          height:'200px'
        }}
        onOk={()=>this.refund()}
          onCancel={()=>{
            this.setState({
              visible1:false,
              message:''
            })
          }}>
           <Input.TextArea style={{height:'120px'}} value={this.state.message} onChange={(e)=>{
                this.setState({
                  message:e.target.value
                })
              }}/>
          </Modal>
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
              <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="mini/mss/annex/upload"
                onChange={(info)=>{
                  console.log(info);
                }}
              >
                {this.state.avatar ? <img src={this.state.avatar} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
              </Upload>
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
const columns = [
  
  {
    title: '编号',
    dataIndex: 'card_no',
    key: 'card_no',
  },
  {
    title: '购买时间',
    dataIndex: 'buy_time',
    key: 'buy_time',
    render(str,record){
      return moment(record.buy_time).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    title: '到期时间',
    dataIndex: 'expire',
    key: 'expire',
    render(str,record){
      return moment(record.expire).format('YYYY-MM-DD HH:mm:ss')
    }
  },
 
  {
    title: '状态',
    dataIndex: 'pay_state',
    key: 'pay_state',
  },
  {
    title: '剩余次数',
    dataIndex: 'remaining_time',
    key: 'remaining_time',
  },
  {
    title: '开票状态',
    dataIndex: 'invoice_flag',
    key: 'invoice_flag',
    render(str,record){
      return record.invoice_flag?'已开票':'未开票'
    }
  },
  {
    title: '退款状态',
    dataIndex: 'refund',
    key: 'refund',
    render(str,record){
      return record.refund=='已退款'?'已退款':'未退款'
    }
  },
  {
    title: '操作',
    dataIndex: 'scan',
    key: 'scan',
    render(str,record){
      return record.pay_state=='已付款'&&record.refund!='已退款'?<span className="link" onClick={()=>container.refundModal(record.id)}>退款</span>:<span></span>
    }
  },
  ];

export default DataPage;