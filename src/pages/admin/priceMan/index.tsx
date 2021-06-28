import React from 'react';
import 'braft-editor/dist/index.css';
import '@ant-design/compatible/assets/index.css';
import { Table, Modal, Input, Select, Row, Col, List, Tag, Radio,Descriptions,message,Upload,Switch,Form } from 'antd';
import Request, { Delete, Get } from '@/utils/request'
import styles from './index.less';

let container: any | null = null;

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
    this.getData();
  }
  state = {
    original_price:'',//原价，以分为单位
    selling_price:'',//售价，以分为单位
  }

 
  getData() {
   
    Get('/psy/mini/mall/price/curr_price', {
    
    }).then((res:any) => {
      this.setState({
        original_price:res.data.original_price,//原价，以分为单位
        selling_price:res.data.selling_price,//售价，以分为单位
      })
    })
  }
  save(){
    if(this.state.original_price==''){
      message.error('请输入原价')
      return
    }
    if(this.state.selling_price==''){
      message.error('请输入售价')
      return
    }
    Request('/psy/mini/mall/price/update', {
      original_price:Number(this.state.original_price) ,
      selling_price:Number(this.state.selling_price) 
    }).then((res:any) => {
      this.getData();
    })
  }
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return <div>
      <div className="module-title">
        {this.props.route.name}
      </div>
      <div className={styles.desc}>
        趁年轻公证价格
      </div>
      <div className={styles.inputWrap}>
        <Form {...formItemLayout}>
          <Form.Item label="原价（单位分）" required>
            <Input value={this.state.original_price} onChange={(e)=>{
              this.setState({
                original_price:e.target.value
              })
            }}/>
          </Form.Item>
          <Form.Item label="售价（单位分）" required>
            <Input value={this.state.selling_price} onChange={(e)=>{
              this.setState({
                selling_price:e.target.value
              })
            }}/>
          </Form.Item>
        </Form>
      </div>
      <div className={styles.saveWrap}>
        <div className="ant-btn success_btn" onClick={()=>this.save()}>保存</div>
      </div>
    </div>
  }
}



export default DataPage;