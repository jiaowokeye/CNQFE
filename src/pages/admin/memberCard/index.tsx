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
  deleteCard(id){
    Modal.confirm({
      title: '确认删除？',
      content: '删除后，会员卡将消失',
      cancelText:'取消',
      okText:'确认',
      onOk() {
        Request('/psy/mng/card/del', {
          id:id
         }).then((res) => {
           container.getList();
         })
      },
      onCancel() {
        
      },
    });
  }
  changeState(data){
    console.log(JSON.stringify(data) );
    let url = '';
    let id = data.id;
    if(data.on_sale){
      url = '/psy/mng/card/unsale';
    }else{
      url = '/psy/mng/card/onsale';
    }
    Request(url, {
     id:id
    }).then((res) => {
      this.getList();
    })
  }
  
  getList() {
    this.setState({
      loading: true
    })
    Request('/psy/mng/card/query', {
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
        label: '新增会员卡',
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
    "name": "",//卡名称
    "count": "",//次数
    "original_price": "",//原价
    "selling_price": "",//销售价
    "on_sale": false,
    "timer": {
        "count": "",//月度、年度数
        "type": ""//周期类型  day	 天 week	周 month	月 year	年
    },
    "explain": "",//说明
    "regulations": "",//章程
    "card_no_prefix": "",//卡号前缀
    "visible":false
  }
  init(data){
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
      ...{
        original_price:Number(this.state.original_price) ,
        selling_price:Number(this.state.selling_price) ,
        count:Number(this.state.count) ,
        timer:{
          ...this.state.timer,
          ...{
            count:Number(this.state.timer.count) ,
          }
        }
      }
    }
    let url = '/psy/sys/user/update';
    if(this.state.id){
      url = '/psy/mng/card/update';
    }else{
      delete params['id'];
      url = '/psy/mng/card/add';
    }
    Request(url, params).then((res) => {
      this.handleCancel();
    })
  }
  handleCancel = ()=>{
    this.setState({
      "id":"",
      "name": "",//卡名称
      "count": "",//次数
      "original_price": "",//原价
      "selling_price": "",//销售价
      "on_sale": false,
      "timer": {
          "count": "",//月度、年度数
          "type": ""//周期类型  day	 天 week	周 month	月 year	年
      },
      "explain": "",//说明
      "regulations": "",//章程
      "card_no_prefix": "",//卡号前缀
      "visible":false
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
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
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
            <Form.Item label="卡名称">
              <Input value={this.state.name} onChange={(e)=>{
                this.setState({
                  name:e.target.value
                })
              }}/>
            </Form.Item>
            <Form.Item label="次数">
              <Input value={this.state.count} onChange={(e)=>{
                this.setState({
                  count:e.target.value
                })
              }}/>
            </Form.Item>
            <Form.Item label="原价(单位分)">
              <Input value={this.state.original_price} onChange={(e)=>{
                this.setState({
                  original_price:e.target.value
                })
              }}/>
            </Form.Item>
            <Form.Item label="销售价(单位分)">
              <Input value={this.state.selling_price} onChange={(e)=>{
                this.setState({
                  selling_price:e.target.value
                })
              }}/>
            </Form.Item>
            <Form.Item label="有效期">
              <Row>
                <Col span={16}>
                  <Input value={this.state.timer.count} onChange={(e)=>{
                    this.setState({
                      timer:{
                        ...this.state.timer,
                        ...{
                          count:e.target.value
                        }
                      }
                    })
                  }}/>
                </Col>
                <Col span={7} offset={1}>
                  <Select value={this.state.timer.type} onChange={(value)=>{
                    this.setState({
                      timer:{
                        ...this.state.timer,
                        ...{
                          type:value
                        }
                      }
                    })
                  }}>
                    	  	 	 	
                    <Option value="day">天</Option>
                    <Option value="week">周</Option>
                    <Option value="month">月</Option>
                    <Option value="year">年</Option>
                  </Select>
                </Col>
              </Row>
              
            </Form.Item>
            <Form.Item label="说明">
              <Input.TextArea value={this.state.explain} onChange={(e)=>{
                this.setState({
                  explain:e.target.value
                })
              }}/>
            </Form.Item>
            <Form.Item label="章程">
              <Input.TextArea value={this.state.regulations} onChange={(e)=>{
                this.setState({
                  regulations:e.target.value
                })
              }}/>
            </Form.Item>
            <Form.Item label="卡号前缀">
              <Input value={this.state.card_no_prefix} onChange={(e)=>{
                this.setState({
                  card_no_prefix:e.target.value
                })
              }}/>
            </Form.Item>
        </Form>
      </Modal>
  }
}
const columns = [
  
  {
    title: '会员卡',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '原价',
    dataIndex: 'original_price',
    key: 'original_price',
    render(str,record){
      return str/100+'元'
    }
  },
  {
    title: '售价',
    dataIndex: 'selling_price',
    key: 'selling_price',
    render(str,record){
      return str/100+'元'
    }
  },
  {
    title: '说明',
    dataIndex: 'explain',
    key: 'explain',
  },
    {
      title: '操作',
      dataIndex: 'scan',
      key: 'scan',
      width:"140px",
      render:(str,record)=>{
        return <div>
          {
            record.on_sale?<span  style={{marginLeft:'12px'}}>编辑</span>:<span className="link" onClick={()=>container.refs.editUser.init(record)}>编辑</span>
          }
         
           <span className="link" onClick={()=>container.changeState(record)}>
            {
              record.on_sale?'下架':'上架'
            }

           </span>
           {
            record.on_sale?<span  style={{marginLeft:'12px'}}>删除</span>:<span className="link" onClick={()=>container.deleteCard(record.id)}>删除</span>
          }
           
           
        </div>
      }
    },
  ];

export default DataPage;