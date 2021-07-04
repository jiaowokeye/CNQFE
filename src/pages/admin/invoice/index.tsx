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
    Request('/psy/mini/mall/invoice/mng/query', {
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
      // {
      //   label: '新增用户',
      //   props: {
      //     className: 'success_btn',
      //     onClick: () => { 
      //       console.log('123');
      //       container.refs.editUser.init();
      //     }
      //   }
      // }
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
    'number':''
  }
  init(data:any){
    this.setState({
      "visible":true,
      id:data.id,
      'number':''
    })
  }
  handleOk = ()=>{
    console.log(this.state);
    let params = {
      ...this.state,
      ...{}
    }
    let url = '/psy/mini/mall/invoice/mng/issue';
    Request(url, params).then((res) => {
      this.handleCancel();
    })
  }
  handleCancel = ()=>{
    this.setState({
      "id":"",
      "visible":false,
      'number':''
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
      '填写开票信息'
    }
     visible={this.state.visible} 
     onOk={this.handleOk}
      onCancel={this.handleCancel}>
        <Form {...formItemLayout}>
            <Form.Item label="发票号">
              <Input value={this.state.number} onChange={(e)=>{
                this.setState({
                  number:e.target.value
                })
              }}/>
            </Form.Item>
           
        </Form>
      </Modal>
  }
}
const columns = [
  {
    title: '订单类型',
    dataIndex: 'target_type',
    key: 'target_type',
    render(str,record){
      return str=='card'?'会员卡开票':'订单开票'
    }
  },
  {
    title: '金额（元）',
    dataIndex: 'money',
    key: 'money',
    render(str,record){
      return record['money']/100
    }
  },
  {
    title: '公司名称',
    dataIndex: 'name',
    key: 'name',
    render(str,record){
      return record['title']['company']
    }
  },
  {
    title: '公司税号',
    dataIndex: 'name',
    key: 'name',
    render(str,record){
      return record['title']['account']
    }
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
  },
    {
      title: '操作',
      dataIndex: 'scan',
      key: 'scan',
      width:"140px",
      render:(str,record)=>{
        return <div>
            {
              record.state=='申请'?<span className="link" onClick={()=>container.refs.editUser.init(record)}>开具发票</span>:<span></span>
            }
           
        </div>
      }
    },
  ];

export default DataPage;