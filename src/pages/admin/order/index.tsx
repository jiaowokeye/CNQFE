import React from 'react';
import { Forms } from '@/components/Forms/forms'
import { Form } from '@ant-design/compatible';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { ArrowDownOutlined, ArrowUpOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Table, Modal, Input, Select, Row, Col, List, Tag, Radio,Descriptions,message,Upload,Switch ,Badge,Image  } from 'antd';
import Request, { Delete, Get } from '@/utils/request'
import UploadS from '@/components/Upload/index'
import styles from './index.less';
import bgPng from './bgPng.png';
import RichTextEditor from '@/commonComponents/richText';
import defaultPng from './d.png';
let container: any | null = null;
let container1: any | null = null;
let editorState = null;
let HOST = '';
if(process.env.NODE_ENV!=='development'){
  HOST = 'https://www.chenyoung.cn/ntz/api/v1';
}else{
  HOST = '/psy';
}
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
    Request('/psy/mng/bill/query', {
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
        label: '导出结果',
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

      <EditUser ref="editUser" callback={()=>this.getList()}/>
    </div>
  }
}



class EditUser extends React.Component{
  state = {
    data:null,
    "visible":false,
    visible1:false,
    "message":''
  }
  init(id:any){
    if(id){
      this.setState({
        "visible":true,
        visible1:false,
        "message":''
      },()=>{
        Get('/psy/mng/bill/info/'+id, {
       
        }).then((res) => {
         this.setState({
          data:res.data
         })
        })
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
      data:null,
    },()=>{
      this.props.callback&&this.props.callback();
    })
  }
  beforeUpload = ()=>{
    return false;
  }
  refund=()=>{
    let _this = this;
    Modal.confirm({
      title: '确认发起退款？',
      content: '',
      onOk() {
        Request('/psy/mng/refund/apply', {
          busi_type:'bill',
          busi_id:_this.state.data.id,
          reason:''
         }).then((res) => {
           _this.setState({
             visible1:false
           },()=>{
             _this.init(_this.state.data.id)
           })
         })
      },
      onCancel() {
        
      },
    });
  }
  render(){
    const {data} = this.state;
    console.log(data);
    return  <Modal title={
      '订单详情'
    }
    width={800}
    centered
     visible={this.state.visible} 
     bodyStyle={{
       maxHeight:600,
       overflowY:'auto'
     }}
     footer={<div>
      
        {
           data!==null&&['normal','success'].indexOf(this.state.data['state'])!==-1&& <div className="ant-btn success_btn" onClick={()=>this.setState({
            visible1:true
          })} style={{marginRight:'15px'}}>退款</div>
        }
      
       <div className="ant-btn error_btn" onClick={()=>this.handleCancel()}>关闭</div>

     </div>}
      onCancel={this.handleCancel}>
        {
          data!=null?<div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="权利人信息">
                {
                  data!=null&&data['right_holder']!=null&&<div>
                     

                      {
                        data['right_holder'].type=='person'&&<div>
                            权利人姓名：{data['right_holder']['name']}<br />
                            权利人身份证号码：{data['right_holder']['id_number']}<br />
                            手机号码：{data['right_holder']['phone']}
                            </div>
                      }
                      {
                        data['right_holder']['type']=='company'&&<div>
                            公司：{data['right_holder']['company']}<br />
                            法人姓名：{data['right_holder']['name']}<br />
                            法人手机号：{data['right_holder']['phone']}
                        </div>
                      }
                      {
                        data['right_holder'].type=='company_hk'&&<div>
                            公司：{data['right_holder']['company']}<br />
                            董事姓名：{data['right_holder']['name']}<br />
                            董事手机号：{data['right_holder']['phone']}
                        </div>
                      }
                  </div>
                }

              
              </Descriptions.Item>
              {
                data['assignee']&&data['assignee']['id']&&<Descriptions.Item label="受让方信息">
                  <div>
                    受让方：{data['assignee']['type']=='person'?data['assignee']['name']:data['assignee']['company']}<br />
                    {data['assignee']['type']=='person'?<div>
                      <Image width={100} className={styles.assigneeImg} src={HOST+'/mini/mss/annex/image/'+data['assignee']['idcard']['face']['id']} />
                      <Image width={100} className={styles.assigneeImg} src={HOST+'/mini/mss/annex/image/'+data['assignee']['idcard']['back']['id']} />
                    </div>:<div>
                      <Image width={100} className={styles.assigneeImg} src={HOST+'/mini/mss/annex/image/'+data['assignee']['license']['id'] }/>
                    </div>
  }
                  </div>
                </Descriptions.Item>
              }
              
              <Descriptions.Item label="商标信息">
                
                  {
                    data['trademarks']&&data['trademarks'].length>0&&data['trademarks'].map((e,i)=>{
                      return <div key={i} className={styles.trademarkItem}>
                        <Row>
                          <Col span={4}>商标名称：</Col>
                          <Col span={20}>{e.name}</Col>
                        </Row>
                        <Row>
                          <Col span={4}>商标注册号：</Col>
                          <Col span={20}>{e.number}</Col>
                        </Row>
                        <Row>
                          <Col span={4}>商标类别：</Col>
                          <Col span={20}>{e.type}</Col>
                        </Row>
                        <Row>
                          <Col span={24}>商标证书附件</Col>
                          <Col span={24}>
                            <Image width={100} className={styles.assigneeImg1} src={HOST+'/mini/mss/annex/image/'+e['license']['id'] }/>
                            {
                              e['annexs']&&e['annexs'].length>0&&e['annexs'].map((el,il)=>{
                                return  <Image key={il} width={100} className={styles.assigneeImg1} src={HOST+'/mini/mss/annex/image/'+el['id'] }/>
                              })
                            }
                          </Col>
                        </Row>
                      </div>
                    })
                  }
                
              </Descriptions.Item>
            </Descriptions>
          </div>:<div></div>
        }

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
      </Modal>
  }
}
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
const columns = [
  
  {
    title: '订单号',
    dataIndex: 'bill_no',
    key: 'bill_no',
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    width:"90px",
    render(str,record){
      let stateObj = {
        'draft':'待付款',
        'normal':'待公证',
        'success':'已完成',
        'canceled':'已取消',
        'stoped':'已终止'
      }
      return <span>{stateObj[record.state]?stateObj[record.state]:record.state}</span>
    }
  },
  
    {
      title: '操作',
      dataIndex: 'scan',
      key: 'scan',
      width:"80px",
      render:(str,record)=>{
        return <div>
           <span className="link" onClick={()=>container.refs.editUser.init(record.id)}>查看</span>
           
        </div>
      }
    },
  ];

export default DataPage;