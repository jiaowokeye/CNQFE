import React, { Component } from 'react';
import {Modal,Table,Tabs} from 'antd';
import Request, { Delete, Get } from '@/utils/request'
const { TabPane } = Tabs;
let ChooseExtContainer = null;
class ChooseExt extends Component{
    state={
        visible:false,
        loading:false,
        type:1,
        offset:0,
        count:10,
        total:0,
        list: [],
    }
    componentDidMount(){
        ChooseExtContainer = this;
    }
    init(type){
        this.setState({
            visible:true,
            type:type,
            offset:0,
            count:6,
            total:0,
            list: [],
        },()=>{
            this.getList();
        })
    }
    handleCancel = e => {
        this.setState({
          visible: false,
        });
    };
    handleOk(){

    }
    getList(){
        this.setState({
            loading: true
        })
        let url = '';
        switch(this.state.type){
            case '1':
                url = '/psy/pa/project/mng/query';
                break;
            case '2':
                url = '/psy/portlet/article/query';
                break;
            case '3':
                url = '/psy/cst/clinic/query';
                break;
            default:
                break;
        }
        let params = {
            k: '',
            offset: this.state.offset*this.state.count,
            count: this.state.count
        };
        if(this.state.type=='1'){
            params = {
                ...params,
                ...{
                    free: -1,
                    online: -1
                }
            } 
        }
        Request(url, params).then((res) => {
            this.setState({
                loading: false,
                list: res.data.data,
                total:res.data.total_count
            })
        })
    }
    // 翻页
    onCurrentChange = (offset) => {
        this.setState({
          offset:offset-1
        }, () => {
          this.getList()
        })
      };
    sure(value){
        this.props.callback&&this.props.callback(value,this.state.type);
        this.handleCancel();
    }
    render(){
        const columns1 = [
            {
              title: '标题',
              dataIndex: 'title',
              key: 'title',
              render:(text,record)=>{
                  let renderHtml = '';
                  switch(ChooseExtContainer.state.type){
                      case '3':
                            renderHtml = record.name;
                          break;
                    default:
                        renderHtml = record.title;
                        break;
                  }
                  return <span>
                      {
                        renderHtml
                      }
                  </span>
              }
            },
            {
              title: '操作',
              dataIndex: 'scan',
              key: 'scan',
              width: '80px',
              render: (text, record) => {
                return <div>
                  <span className="link" onClick={()=>this.sure(record)}>选择</span>
                </div>
              }
            },
          ];
        console.log(this.props.typeList);
        return <div>
            <Modal
            title={''}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={600}
            destroyOnClose={true}
            bodyStyle={{
                maxHeight: window.innerHeight - 250,
                overflowY: 'auto',
            }}
            footer={null}
            >  
                <Tabs activeKey={this.state.type} onChange={(key)=>{
                    this.setState({
                        type:key
                    },()=>{
                        this.getList();
                    })
                }} type="card">
                    {
                        this.props.typeList.map(e=>{
                            return <TabPane tab={e.lebal} key={e.value}>
                            </TabPane>
                        })
                    }
                    
                </Tabs>
                <Table pagination={{
                    // showSizeChanger: true,
                    showQuickJumper: true,
                    // onShowSizeChange: this.onShowSizeChange,
                    current: this.state.offset+1,
                    total: this.state.total,
                    onChange: this.onCurrentChange,
                    pageSize: this.state.count
                    }} loading={this.state.loading} dataSource={this.state.list} columns={columns1} />
            </Modal>
        </div> 
    }
}

export default ChooseExt;