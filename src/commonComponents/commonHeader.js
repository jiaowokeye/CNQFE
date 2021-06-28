import { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu, Modal } from 'antd'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { setMenuList } from '../layout/action'
import './commonHeader.less'
// import Calender from './images/calendar.png'
import NoticeImg from './images/notice.png'
import { MostRequest } from '../tools/request';
let container;
const menu = ()=>{
	const userInfo = JSON.parse(localStorage.getItem('userInfo'));
	return <Menu className="headMenu">
		<Menu.Item>
			<Link>
				{userInfo.name} 
			</Link>
		</Menu.Item>
		<Menu.Divider />
		<Menu.Item>
			<Link replace to={'/login'}>
				<span style={{fontWeight:'normal'}}>退出</span>
			</Link>
		</Menu.Item>
	</Menu>
};

class CommonHeader extends Component {

  constructor(props) {
    super(props);
    const pathname = props.location.pathname;
    this.state = {
      pathname,
      navList: props.navList,
      menuLists: props.menuLists,
    }
  }

  logout = () => {
    Modal.confirm({
      title: '退出登录',
      content: '是否确认退出登录',
      onOk: () => {
        MostRequest.Post('/v1/login_out', {});
        this.props.history.replace('/')
      },
    });
  }

  componentDidMount () {
    container = this;
    this.getMenuList();
  }

  getMenuList (data) {
    const list = this.state.navList;
    let nowMenu;
    if (data) {
      nowMenu = [data];
    } else {
      nowMenu = list.filter((ele) => {
        return this.state.pathname.indexOf(ele.type) !== -1
      });
    }
    let leftMenuList;
    let type = '';// 给每个列表绑定父级type
    if (nowMenu.length === 0) {
      leftMenuList = list[0].children;
    } else if (nowMenu.length > 1) {
      nowMenu.forEach(item => {
        if (item.path.indexOf(this.state.pathname.split('/')[1]) !== -1) {
          leftMenuList = item.children;
          type = item.type;
        }
      });
    } else {
      leftMenuList = nowMenu[0].children;
      type = nowMenu[0].type;
    }
    leftMenuList = leftMenuList.map(ele => ({
      ...ele,
      typeName: type
    }));
    this.props.setMenuList(leftMenuList);
    if (data) {
      leftMenuList[0].children && leftMenuList[0].children.length > 0 ?
        this.props.history.push(leftMenuList[0].children[0].path) : this.props.history.push(leftMenuList[0].path);
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.setState({
        pathname: nextProps.location.pathname
      })
    }
  }

  render () {
    const { navList } = this.state;
    const { pathname } = this.props.location;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return (
      <div className="commmon_header_box">
        <div className="commmon_header">
          <Link to={'/'} replace className="commmon_header_left">
            <img src={require('./images/logo_.png')} alt="" />
            <div className="logo_right">
              <p className='logo_right_title'>智慧党建</p>
              <p className='logo_right_desc'>ZHI HUI DANG JIAN</p>
            </div>
          </Link>
          <div className="commmon_header_right">
            <div className="common_header_right_list">
              {
                navList.map((ele, index) => (
                  <span
                    onClick={() => this.getMenuList(ele)}
                    className={`link ${retPath(pathname).indexOf(ele.type || 'qqq') !== -1 && 'theme_color'}`}
                    key={index}>{ele.title}</span>
                ))
              }
            </div>

            <div className="common_header_right_icon_box">
              <img className='icon_list' src={NoticeImg} alt="" />
              {/* <div>
                <img className='icon_list' src={Calender} alt="" />
              </div> */}

              <div className="header_icon_list">
                <Dropdown overlay={menu} placement="bottomRight">
                  <Avatar size={30} icon={<UserOutlined />} src={userInfo.icon}/>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function retPath (pathname) {
  try {
    return pathname.split('/')[1]
  } catch (e) {
    return pathname
  }
}

function mapState (state) {
  return {
    navList: state.navList,
    menuLists: state.menuLists,
  }
}

export default connect(mapState, { setMenuList })(withRouter(CommonHeader))