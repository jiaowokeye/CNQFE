import React from 'react';
import { Forms } from '@/components/Forms/forms'
import { Form } from '@ant-design/compatible';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { ArrowDownOutlined, ArrowUpOutlined, MinusOutlined,DeleteOutlined ,PlusOutlined ,EditOutlined} from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Table, Modal, Input, Select, Row, Col, List,Radio , Tag, Radio,Descriptions,message,Upload,Switch ,Badge,Image  } from 'antd';
import Request, { Delete, Get } from '@/utils/request'
import UploadS from '@/components/Upload/ocrUp'
import styles from './index.less';
import bgPng from './bgPng.png';
import RichTextEditor from '@/commonComponents/richText';
import defaultPng from './d.png';
let container: any | null = null;
let container1: any | null = null;
let editorState = null;
let HOST = '';
if(process.env.NODE_ENV!=='development'){
  HOST = 'https://www.chenyoung.cn/ntz_dev/api/v1';
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
      // {
      //   label: '导出结果',
      //   props: {
      //     className: 'success_btn',
      //     onClick: () => { 
            
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
  getFileAddress = (id)=>{
    return id?HOST+'/mini/mss/annex/image/'+id:''
  }
  init(id:any){
    if(id){
      this.setState({
        "visible":true,
        visible1:false,
        "message":''
      },()=>{
        Get('/psy/mng/bill/info/'+id, {
       
        }).then((response) => {
          const res = response.data;
          const idcard = res.assignee.idcard?res.assignee.idcard: {};
          const license_id = res.assignee.license?res.assignee.license.id:'';
          const as_idcard_face_ocr_id = res.assignee.idcard&&res.assignee.idcard.face?res.assignee.idcard.face.id:'';
          const as_idcard_back_ocr_id = res.assignee.idcard&&res.assignee.idcard.back?res.assignee.idcard.back.id:'';
         this.setState({
          data:res,
          "type": res.assignee.id?res.assignee.type:'company',//权利人类型：company:公司 person:个人
          "assignee": res.assignee,
          "as_ocr_id_img":this.getFileAddress(license_id),
          "as_ocr_id": license_id,//受让人营业执照，受让人为公司时有效
          "as_idcard_face_ocr_id_img":this.getFileAddress(as_idcard_face_ocr_id),
          "as_idcard_face_ocr_id": as_idcard_face_ocr_id,//受让人身份证正面ocr_id，受让人为公司时表示法人身份证正面
          "as_idcard_back_ocr_id_img":this.getFileAddress(as_idcard_back_ocr_id),
          "as_idcard_back_ocr_id": as_idcard_back_ocr_id,//受让人身份证背面ocr_id，受让人为公司时表示法人身份证背面
          "trademark": {
              "type": "",//商标类别
              "name": "",//商标名称
              "number": ""//商标注册号
          },
          "trademarks":res.trademarks?res.trademarks:[],
          "tm_ocr_id_img":'',
          "tm_ocr_id": "",//商标ocr_id
          "isReset":false,
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
              <Descriptions.Item label={
                <div>
                  权利人信息
                   {/* {
                      data!==null&&['draft','normal','success'].indexOf(this.state.data['state'])!==-1&& <EditOutlined onClick={()=>this.refs.RightHolderUpdate.init(data['id'])}/>
                    } */}
                </div>
              }>
                {
                  data!=null&&data['right_holder']!=null&&<div className={styles.trademarkItem}>
                     

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
                data['assignee']&&data['assignee']['id']&&<Descriptions.Item  label={
                  <div>
                    受让方信息
                     {
                        data!==null&&['draft','normal','success'].indexOf(this.state.data['state'])!==-1&& <EditOutlined onClick={()=>this.refs.AssigneeUpdate.init(data['id'])}/>
                      }
                  </div>
                }>
                  <div className={styles.trademarkItem}>
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
              
              <Descriptions.Item  label={
                  <div>
                    商标信息
                     {
                        data!==null&&['draft','normal','success'].indexOf(this.state.data['state'])!==-1&& <EditOutlined onClick={()=>this.refs.TrademarksUpdate.init(data['id'])}/>
                      }
                  </div>
                }>
                
                  {
                    data['trademarks']&&data['trademarks'].length>0&&data['trademarks'].map((e,i)=>{
                      return <div key={i} className={styles.trademarkItem}>
                        <div className="desc__title">商标证书</div>
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

          <RightHolderUpdate ref="RightHolderUpdate" callback= {()=>this.init(this.state.data.id)}/>
          <AssigneeUpdate ref="AssigneeUpdate" callback= {()=>this.init(this.state.data.id)}/>
          <TrademarksUpdate ref="TrademarksUpdate" callback= {()=>this.init(this.state.data.id)}/>
      </Modal>
  }
}

class RightHolderUpdate extends React.Component{
  state = {
    visible:false,
    data:null
  }
  init = (id)=>{
    Get('/psy/mng/bill/info/'+id, {
     
    }).then((res) => {
      this.setState({
        visible:true,
        data:res.data
      })
    })
  }
  handleOk = ()=>{

  }
  handleCancel = ()=>{
    this.setState({
      visible:false,
      data:null
    })
  }
  render(){
    return  <Modal title="修改权利人" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
    
  </Modal>
  }
}

class AssigneeUpdate extends React.Component{
  state = {
    visible:false,
    data:null,
    "type": "company",//权利人类型：company:公司 person:个人
    "assignee": {
      "type": "company",//受让人类型：company:公司 person:个人
      "name": "",//受让人名称
      "id_number": "",//受让人身份证号
      "phone": "",//电话号码
      "company": "",//公司名称  type为公司时，有效
      "license_number": ""//社会统一信用代码  type为公司时，有效
    },
    "as_ocr_id_img":'',
    "as_ocr_id": "",//受让人营业执照，受让人为公司时有效
    "as_idcard_face_ocr_id_img":'',
    "as_idcard_face_ocr_id": "",//受让人身份证正面ocr_id，受让人为公司时表示法人身份证正面
    "as_idcard_back_ocr_id_img":'',
    "as_idcard_back_ocr_id": "",//受让人身份证背面ocr_id，受让人为公司时表示法人身份证背面
    "trademark": {
      "type": "",//商标类别
      "name": "",//商标名称
      "number": ""//商标注册号
    },
    "trademarks":[],
    "tm_ocr_id_img":'',
    "tm_ocr_id": ""//商标ocr_id
  }
  getFileAddress = (id)=>{
    return id?HOST+'/mini/mss/annex/image/'+id:''
  }
  init(id:any){
    if(id){
      this.setState({
        "visible":true,
        visible1:false,
        "message":''
      },()=>{
        Get('/psy/mng/bill/info/'+id, {
       
        }).then((response) => {
          const res = response.data;
          const idcard = res.assignee.idcard?res.assignee.idcard: {};
          const license_id = res.assignee.license?res.assignee.license.id:'';
          const as_idcard_face_ocr_id = res.assignee.idcard&&res.assignee.idcard.face?res.assignee.idcard.face.id:'';
          const as_idcard_back_ocr_id = res.assignee.idcard&&res.assignee.idcard.back?res.assignee.idcard.back.id:'';
         this.setState({
          data:res,
          "type": res.assignee.id?res.assignee.type:'company',//权利人类型：company:公司 person:个人
          "assignee": res.assignee,
          "as_ocr_id_img":this.getFileAddress(license_id),
          "as_ocr_id": license_id,//受让人营业执照，受让人为公司时有效
          "as_idcard_face_ocr_id_img":this.getFileAddress(as_idcard_face_ocr_id),
          "as_idcard_face_ocr_id": as_idcard_face_ocr_id,//受让人身份证正面ocr_id，受让人为公司时表示法人身份证正面
          "as_idcard_back_ocr_id_img":this.getFileAddress(as_idcard_back_ocr_id),
          "as_idcard_back_ocr_id": as_idcard_back_ocr_id,//受让人身份证背面ocr_id，受让人为公司时表示法人身份证背面
          "trademark": {
              "type": "",//商标类别
              "name": "",//商标名称
              "number": ""//商标注册号
          },
          "trademarks":res.trademarks?res.trademarks:[],
          "tm_ocr_id_img":'',
          "tm_ocr_id": "",//商标ocr_id
          "isReset":false,
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
    if(this.state.type=='person'){
      if(!this.state.as_idcard_face_ocr_id){
        message.error({
          title: '请正确填写受让人信息',
        })
        return;
      }
    }
    if(this.state.type=='company'){
      if(!this.state.as_ocr_id){
        message.error({
          title: '请正确填写受让公司信息',
        })
        return;
      }
    }
    let params = {
      "bill_id": this.state.data.id,
      "type": this.state.type,
      "name": this.state.assignee.name,
      "id_number": this.state.assignee.id_number,
      "phone": this.state.assignee.phone,
      "company": this.state.assignee.company,
      "license_number": this.state.assignee.license_number,
      "license_ocr_id":this.state.as_ocr_id,
      // "sumbit_annexs":this.state.sumbit_annexs,
      "id_card_ocr": {
          "face_ocr_id": this.state.as_idcard_face_ocr_id,
          "back_ocr_id": this.state.as_idcard_back_ocr_id
      },
    };
    Request('/psy/mng/bill/assignee/update',params).then((res) => {
      this.handleCancel();
    })
  }
  handleCancel = ()=>{
    this.setState({
      visible:false,
      data:null,
    "type": "company",//权利人类型：company:公司 person:个人
    "assignee": {
      "type": "company",//受让人类型：company:公司 person:个人
      "name": "",//受让人名称
      "id_number": "",//受让人身份证号
      "phone": "",//电话号码
      "company": "",//公司名称  type为公司时，有效
      "license_number": ""//社会统一信用代码  type为公司时，有效
    },
    "as_ocr_id_img":'',
    "as_ocr_id": "",//受让人营业执照，受让人为公司时有效
    "as_idcard_face_ocr_id_img":'',
    "as_idcard_face_ocr_id": "",//受让人身份证正面ocr_id，受让人为公司时表示法人身份证正面
    "as_idcard_back_ocr_id_img":'',
    "as_idcard_back_ocr_id": "",//受让人身份证背面ocr_id，受让人为公司时表示法人身份证背面
    "trademark": {
      "type": "",//商标类别
      "name": "",//商标名称
      "number": ""//商标注册号
    },
    "trademarks":[],
    "tm_ocr_id_img":'',
    "tm_ocr_id": ""//商标ocr_id
    },()=>{
      this.props.callback&&this.props.callback();
    })
  }
  businesslicenseChange(res,img){
    this.setState({
      as_ocr_id:res.ocr_id,
      as_ocr_id_img:img,
      assignee:{
        ...this.state.assignee,
        ...{
          "name": res['result']['legal_person'],//法人姓名或自然人姓名
          "company": res['result']['company_name'],//type为公司时，有效 公司名称
          "license_number": res['result']['lisence_number'],//type为公司时，有效 社会统一信用码
        }
      }
    })
  }
  businesslicenseChange1(res,img){
    this.setState({
      as_idcard_face_ocr_id:res.ocr_id,
      as_idcard_face_ocr_id_img:img,
      assignee:{
        ...this.state.assignee,
        ...{
          "name": res.result.name,//法人姓名或自然人姓名
          "id_number": res.result.number,//法人身份证或自然人身份证
        }
      }
    })
  }
  businesslicenseChange2(res,img){
    this.setState({
      as_idcard_back_ocr_id:res.ocr_id,
      as_idcard_back_ocr_id_img:img,
    })
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
        <div style={{ marginTop: 8 }}>营业执照</div>
      </div>
    );
    const uploadButton1 = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>身份证正面</div>
      </div>
    );
    const uploadButton2 = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>身份证反面</div>
      </div>
    );
    return  <Modal width={500} title="修改受让方" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
        {
          this.state.data!=null&&<Form {...formItemLayout}>
          <Form.Item label="受让类型" style={{marginBottom:'0'}}>
            <Radio.Group onChange={(e)=>{
                this.setState({
                  type:e.target.value
                })
              }} value={this.state.type}>
              <Radio value={'company'}>公司</Radio>
              <Radio value={'person'}>个人</Radio>
            </Radio.Group>
          </Form.Item>
          {
            this.state.type=='company'&&<div>

              <div className="desc__title">营业执照</div>
              <div>
                <UploadS callback={(data,img)=>{
                  this.businesslicenseChange(data,img);
                }} action="/psy/mini/ocr/businesslicense" renderHtml={
                  this.state.as_ocr_id_img?<img className={styles.img1} src={this.state.as_ocr_id_img}/>:uploadButton
                }/>
              </div>
              <div className="desc__title">核实受让公司信息</div>
              <Form.Item label="受让人公司名称">
                  <Input value={this.state['assignee']['company']} onChange={(e)=>{
                    this.setState({
                      assignee:{
                        ...this.state.assignee,
                        ...{
                          company:e.target.value
                        }
                      }
                    })
                  }}/>
                </Form.Item>
                <Form.Item label="受让人类型">
                  <Input value={'公司'} disabled />
                </Form.Item>
            </div>
          }
          {
            this.state.type=='person'&&<div>

              <div className="desc__title">身份证</div>
              <div>
                <UploadS callback={(data,img)=>{
                  this.businesslicenseChange1(data,img);
                }} action="/psy/mini/ocr/idcard/face" renderHtml={
                  this.state.as_idcard_face_ocr_id_img?<img className={styles.img1} src={this.state.as_idcard_face_ocr_id_img}/>:uploadButton1
                }/>
                <UploadS callback={(data,img)=>{
                  this.businesslicenseChange2(data,img);
                }} action="/psy/mini/ocr/idcard/back" renderHtml={
                  this.state.as_idcard_back_ocr_id_img?<img className={styles.img1} src={this.state.as_idcard_back_ocr_id_img}/>:uploadButton2
                }/>
              </div>
              <div className="desc__title">核实受让人信息</div>
              <Form.Item label="受让人姓名">
                  <Input value={this.state['assignee']['name']} onChange={(e)=>{
                    this.setState({
                      assignee:{
                        ...this.state.assignee,
                        ...{
                          name:e.target.value
                        }
                      }
                    })
                  }}/>
                </Form.Item>
                <Form.Item label="受让人身份证号">
                <Input value={this.state['assignee']['id_number']} onChange={(e)=>{
                    this.setState({
                      assignee:{
                        ...this.state.assignee,
                        ...{
                          id_number:e.target.value
                        }
                      }
                    })
                  }}/>
                </Form.Item>
            </div>
          }
        </Form>
        }
        
     
  </Modal>
  }
}
class TrademarksUpdate extends React.Component{
  state = {
    visible:false,
    data:null,
    "type": "company",//权利人类型：company:公司 person:个人
    "assignee": {
      "type": "company",//受让人类型：company:公司 person:个人
      "name": "",//受让人名称
      "id_number": "",//受让人身份证号
      "phone": "",//电话号码
      "company": "",//公司名称  type为公司时，有效
      "license_number": ""//社会统一信用代码  type为公司时，有效
    },
    "as_ocr_id_img":'',
    "as_ocr_id": "",//受让人营业执照，受让人为公司时有效
    "as_idcard_face_ocr_id_img":'',
    "as_idcard_face_ocr_id": "",//受让人身份证正面ocr_id，受让人为公司时表示法人身份证正面
    "as_idcard_back_ocr_id_img":'',
    "as_idcard_back_ocr_id": "",//受让人身份证背面ocr_id，受让人为公司时表示法人身份证背面
    "trademark": {
      "type": "",//商标类别
      "name": "",//商标名称
      "number": ""//商标注册号
    },
    "trademarks":[],
    "tm_ocr_id_img":'',
    "tm_ocr_id": ""//商标ocr_id
  }
  getFileAddress = (id)=>{
    return id?HOST+'/mini/mss/annex/image/'+id:''
  }
  init(id:any){
    if(id){
      this.setState({
        "visible":true,
        visible1:false,
        "message":''
      },()=>{
        Get('/psy/mng/bill/info/'+id, {
       
        }).then((response) => {
          const res = response.data;
          const idcard = res.assignee.idcard?res.assignee.idcard: {};
          const license_id = res.assignee.license?res.assignee.license.id:'';
          const as_idcard_face_ocr_id = res.assignee.idcard&&res.assignee.idcard.face?res.assignee.idcard.face.id:'';
          const as_idcard_back_ocr_id = res.assignee.idcard&&res.assignee.idcard.back?res.assignee.idcard.back.id:'';
         this.setState({
          data:res,
          "type": res.assignee.id?res.assignee.type:'company',//权利人类型：company:公司 person:个人
          "assignee": res.assignee,
          "as_ocr_id_img":this.getFileAddress(license_id),
          "as_ocr_id": license_id,//受让人营业执照，受让人为公司时有效
          "as_idcard_face_ocr_id_img":this.getFileAddress(as_idcard_face_ocr_id),
          "as_idcard_face_ocr_id": as_idcard_face_ocr_id,//受让人身份证正面ocr_id，受让人为公司时表示法人身份证正面
          "as_idcard_back_ocr_id_img":this.getFileAddress(as_idcard_back_ocr_id),
          "as_idcard_back_ocr_id": as_idcard_back_ocr_id,//受让人身份证背面ocr_id，受让人为公司时表示法人身份证背面
          "trademark": {
              "type": "",//商标类别
              "name": "",//商标名称
              "number": ""//商标注册号
          },
          "trademarks":res.trademarks?res.trademarks:[],
          "tm_ocr_id_img":'',
          "tm_ocr_id": "",//商标ocr_id
          "isReset":false,
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
    if(this.state.type=='person'){
      if(!this.state.as_idcard_face_ocr_id){
        message.error({
          title: '请正确填写受让人信息',
        })
        return;
      }
    }
    if(this.state.type=='company'){
      if(!this.state.as_ocr_id){
        message.error({
          title: '请正确填写受让公司信息',
        })
        return;
      }
    }
    let params = {
      "bill_id": this.state.data.id,
      "type": this.state.type,
      "name": this.state.assignee.name,
      "id_number": this.state.assignee.id_number,
      "phone": this.state.assignee.phone,
      "company": this.state.assignee.company,
      "license_number": this.state.assignee.license_number,
      "license_ocr_id":this.state.as_ocr_id,
      // "sumbit_annexs":this.state.sumbit_annexs,
      "id_card_ocr": {
          "face_ocr_id": this.state.as_idcard_face_ocr_id,
          "back_ocr_id": this.state.as_idcard_back_ocr_id
      },
    };
    Request('/psy/mng/bill/assignee/update',params).then((res) => {
      this.handleCancel();
    })
  }
  handleCancel = ()=>{
    this.setState({
      visible:false,
      data:null,
      "type": "company",//权利人类型：company:公司 person:个人
      "assignee": {
        "type": "company",//受让人类型：company:公司 person:个人
        "name": "",//受让人名称
        "id_number": "",//受让人身份证号
        "phone": "",//电话号码
        "company": "",//公司名称  type为公司时，有效
        "license_number": ""//社会统一信用代码  type为公司时，有效
      },
      "as_ocr_id_img":'',
      "as_ocr_id": "",//受让人营业执照，受让人为公司时有效
      "as_idcard_face_ocr_id_img":'',
      "as_idcard_face_ocr_id": "",//受让人身份证正面ocr_id，受让人为公司时表示法人身份证正面
      "as_idcard_back_ocr_id_img":'',
      "as_idcard_back_ocr_id": "",//受让人身份证背面ocr_id，受让人为公司时表示法人身份证背面
      "trademark": {
        "type": "",//商标类别
        "name": "",//商标名称
        "number": ""//商标注册号
      },
      "trademarks":[],
      "tm_ocr_id_img":'',
      "tm_ocr_id": ""//商标ocr_id
      },()=>{
        this.props.callback&&this.props.callback();
      })
  }
  businesslicenseChange(res,img){
    this.setState({
      as_ocr_id:res.ocr_id,
      as_ocr_id_img:img,
      assignee:{
        ...this.state.assignee,
        ...{
          "name": res['result']['legal_person'],//法人姓名或自然人姓名
          "company": res['result']['company_name'],//type为公司时，有效 公司名称
          "license_number": res['result']['lisence_number'],//type为公司时，有效 社会统一信用码
        }
      }
    })
  }
  deleteTradeMark = (id)=>{
    const _this = this;
    Modal.confirm({
      title: '确认删除？',
      content: '',
      onOk() {
        Request('/psy/mini/mall/bill/trademark/del', {
          tm_id:id
         }).then((res) => {
          _this.init(_this.state.data.id);
         })
      },
      onCancel() {
        
      },
    });
  }
  render(){
    return  <Modal title="修改商标" footer={
      <div>
        <div className="ant-btn error_btn" onClick={this.handleCancel}>关闭</div>
      </div>
    } visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
      {
        this.state.data!=null&&<div>
          {
            this.state['trademarks']&&this.state['trademarks'].length>0&&this.state['trademarks'].map((e,i)=>{
              return <div key={i} className={styles.trademarkItem}>
                <div className="desc__title">商标证书</div>
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
                <div className={styles.trademarkItemDlete} onClick={()=>this.deleteTradeMark(e.id)}>
                  <DeleteOutlined />
                </div>
              </div>
            })
          }
        </div>
      }
      <div className="ant-btn success_btn" style={{marginTop:'15px'}} onClick={()=>this.refs.AddTrademarks.init(this.state.data.id)}>新增</div>
      <AddTrademarks ref={'AddTrademarks'} callback = {()=>this.init(this.state.data.id)}/>
  </Modal>
  }
}


class AddTrademarks extends React.Component{
  state = {
    visible:false,
    data:null,
    id:'',
    "type": "company",//权利人类型：company:公司 person:个人
    "assignee": {
      "type": "company",//受让人类型：company:公司 person:个人
      "name": "",//受让人名称
      "id_number": "",//受让人身份证号
      "phone": "",//电话号码
      "company": "",//公司名称  type为公司时，有效
      "license_number": ""//社会统一信用代码  type为公司时，有效
    },
    "as_ocr_id_img":'',
    "as_ocr_id": "",//受让人营业执照，受让人为公司时有效
    "as_idcard_face_ocr_id_img":'',
    "as_idcard_face_ocr_id": "",//受让人身份证正面ocr_id，受让人为公司时表示法人身份证正面
    "as_idcard_back_ocr_id_img":'',
    "as_idcard_back_ocr_id": "",//受让人身份证背面ocr_id，受让人为公司时表示法人身份证背面
    "trademark": {
      "type": "",//商标类别
      "name": "",//商标名称
      "number": ""//商标注册号
    },
    "trademarks":[],
    sumbit_annexs:[],
    "tm_ocr_id_img":'',
    "tm_ocr_id": ""//商标ocr_id
  }
  init = (id)=>{
    this.setState({
      id:id,
      visible:true
    })
  }
  handleOk = ()=>{
    if(!this.state.trademark.type){
      message.error({
        title: '请先填写商标类别',
        icon:false
      })
      return 
    }
    if(!this.state.trademark.name){
      message.error({
        title: '请先填写商标名称',
        icon:false
      })
      return 
    }
    if(!this.state.trademark.number){
      message.error({
        title: '请先填写商标注册号',
        icon:false
      })
      return 
    }

    let params = {
      "bill_id": this.state.id,
      "type": this.state.trademark.type,
      "name": this.state.trademark.name,
      "number": this.state.trademark.number,
      "license_ocr_id": this.state.tm_ocr_id,
      "sumbit_annexs": this.state.sumbit_annexs
    };
    if(this.state.tm_ocr_id==''){
      message.error({
        title: '请上传附件',
      })
      return;
    }
    if(this.state.tm_ocr_id==''){
      // params['license_ocr_id'] = this.state.sumbit_annexs.concat([])[0]['file_id'];
      // params['sumbit_annexs'].splice(0,1);
    }
    Request('/psy/mini/mall/bill/trademark/add',params).then((res) => {
      this.handleCancel();
    })

  }
  handleCancel = ()=>{
    this.setState({
      visible:false,
      data:null,
      id:'',
      "type": "company",//权利人类型：company:公司 person:个人
      "assignee": {
        "type": "company",//受让人类型：company:公司 person:个人
        "name": "",//受让人名称
        "id_number": "",//受让人身份证号
        "phone": "",//电话号码
        "company": "",//公司名称  type为公司时，有效
        "license_number": ""//社会统一信用代码  type为公司时，有效
      },
      "as_ocr_id_img":'',
      "as_ocr_id": "",//受让人营业执照，受让人为公司时有效
      "as_idcard_face_ocr_id_img":'',
      "as_idcard_face_ocr_id": "",//受让人身份证正面ocr_id，受让人为公司时表示法人身份证正面
      "as_idcard_back_ocr_id_img":'',
      "as_idcard_back_ocr_id": "",//受让人身份证背面ocr_id，受让人为公司时表示法人身份证背面
      "trademark": {
        "type": "",//商标类别
        "name": "",//商标名称
        "number": ""//商标注册号
      },
      "trademarks":[],
      sumbit_annexs:[],
      "tm_ocr_id_img":'',
      "tm_ocr_id": ""//商标ocr_id
    },()=>{
      this.props.callback&&this.props.callback();
    })
  }
  businesslicenseChange(res,img){
    this.setState({
      tm_ocr_id:res.ocr_id,
      tm_ocr_id_img:img,
      assignee:{
        ...this.state.assignee,
        ...{
          "name": res['result']['legal_person'],//法人姓名或自然人姓名
          "company": res['result']['company_name'],//type为公司时，有效 公司名称
          "license_number": res['result']['lisence_number'],//type为公司时，有效 社会统一信用码
        }
      }
    })
  }
  render(){
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>商标证书</div>
      </div>
    );
    return  <Modal title="新增商标" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
    <div>

        <div className="desc__title">商标证书</div>
        <div>
          <UploadS callback={(data,img)=>{
            this.businesslicenseChange(data,img);
          }} action="/psy/mini/ocr/trademark" renderHtml={
            this.state.tm_ocr_id_img?<img className={styles.img1} src={this.state.tm_ocr_id_img}/>:uploadButton
          }/>
        </div>
        <div className="desc__title">核实商标信息</div>
        <div style={{paddingLeft:'10px'}}>
        <Form.Item label="商标类别">
            <Input value={this.state['trademark']['type']} onChange={(e)=>{
              this.setState({
                trademark:{
                  ...this.state.trademark,
                  ...{
                    type:e.target.value
                  }
                }
              })
            }}/>
          </Form.Item>
          <Form.Item label="商标名称">
          <Input value={this.state['trademark']['name']} onChange={(e)=>{
              this.setState({
                trademark:{
                  ...this.state.trademark,
                  ...{
                    name:e.target.value
                  }
                }
              })
            }}/>
          </Form.Item>
          <Form.Item label="商标注册号">
          <Input value={this.state['trademark']['number']} onChange={(e)=>{
              this.setState({
                trademark:{
                  ...this.state.trademark,
                  ...{
                    number:e.target.value
                  }
                }
              })
            }}/>
          </Form.Item>
        </div>
        
        </div>
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