import { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu, Spin } from 'antd';
import { ClickParam } from 'antd/es/menu';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { ConnectProps, ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';
import Request, { Delete, Get } from '@/utils/request'
import IconFont from './../Iconfont/index'
import styles from './index.less';
import { Link } from 'umi';
import { Table,Form, Modal, Input, Select, Row, Col, List, Tag, Radio,Descriptions,message,Upload,Switch } from 'antd';
let container = null;

export interface GlobalHeaderRightProps extends ConnectProps {
  currentUser?: CurrentUser;
  menu?: boolean;
  layout: 'sidemenu' | 'topmenu';
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  state = {
    visible:false,
    pwd:'',
    npwd:''
  }
  louout = ()=>{
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'login/logout',
      });
    }
  }
  componentDidMount(){
    container = this;
  }
  handleOk = ()=>{
    Request('/psy/sys/user/changepwd', {
      pwd:this.state.pwd,
      npwd:this.state.npwd
    }).then((res) => {
      this.setState({
        visible:true,
        pwd:'',
        npwd:''
      },()=>{
        this.louout();
      })
    })
  }
  render(): React.ReactNode {
    const {
      currentUser = {
        avatar: '',
        name: '',
      },
      menu,
      layout
    } = this.props;
    console.log(layout);
    const userInfo = window.localStorage.getItem("userInfo")?JSON.parse(window.localStorage.getItem("userInfo")):{};
    if(!userInfo){
      this.louout();
    }
    const Rightmenu = ()=>{
      return <Menu className="headRightMenu">
        <Menu.Item>
          <Link to={''}>
            {userInfo.name} 
          </Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <span onClick={()=>{
            this.setState({
              visible:true,
              pwd:'',
              npwd:''
            })
          }}  style={{fontWeight:'normal'}}>修改密码</span>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={()=>container.louout()}>
            <span  style={{fontWeight:'normal'}}>退出</span>
        </Menu.Item>
      </Menu>
    };
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
    return userInfo ? ( 
      <div style={{float:'right'}} className={styles.headerRight}> 
        <span className={styles.topmenu}>
          <Avatar size="small" className={styles.avatar} src={userInfo.avatar} alt="avatar" icon={<UserOutlined />}/>
          <span className={styles.name} >{userInfo.name}</span>
          
          <Dropdown overlay={Rightmenu} placement="bottomRight">
            <span className={styles.layout}><IconFont type='iconhebingxingzhuangbeifen'/></span>
          </Dropdown>
        </span>
        <Modal title='修改密码'
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
                <Form.Item label="原密码">
                  <Input value={this.state.pwd} onChange={(e)=>{
                    this.setState({
                      pwd:e.target.value
                    })
                  }}/>
                </Form.Item>
                <Form.Item label="新密码">
                  <Input value={this.state.npwd} onChange={(e)=>{
                    this.setState({
                      npwd:e.target.value
                    })
                  }}/>
                </Form.Item>
            </Form>
          </Modal>
      </div>
    ) : (
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    );
  }
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
