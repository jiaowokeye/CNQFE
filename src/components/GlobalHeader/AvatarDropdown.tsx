import { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu, Spin } from 'antd';
import { ClickParam } from 'antd/es/menu';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { ConnectProps, ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';
import IconFont from './../Iconfont/index'
import styles from './index.less';
import { Link } from 'umi';
let container = null;

export interface GlobalHeaderRightProps extends ConnectProps {
  currentUser?: CurrentUser;
  menu?: boolean;
  layout: 'sidemenu' | 'topmenu';
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  
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
          <Link to={'/client/index/5f87b81d9a3989548fe6a44d'}>
            个人 
          </Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={()=>container.louout()}>
            <span  style={{fontWeight:'normal'}}>退出</span>
        </Menu.Item>
      </Menu>
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
