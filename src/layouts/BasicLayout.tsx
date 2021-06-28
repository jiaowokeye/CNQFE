/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  DefaultFooter,
} from '@ant-design/pro-layout';
import { LeftOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import Link from 'umi/link';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { GithubOutlined } from '@ant-design/icons';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import { isAntDesignPro, getAuthorityFromRouter } from '@/utils/utils';
import { PageHeader } from 'antd';
import logo from '../assets/logo.svg';
import styles from './BasicLayout.less';
import Iconfont from '@/components/Iconfont/index'
window.backCallBack = ()=>{};
let backCallBack = ()=>{};
let showBack = null;
let setCallBack = (fun:any)=>{
  backCallBack = fun;
}
export {
  setCallBack,showBack
}
const noMatch = (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};
/**
 * use Authorized check all menu item
 */

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map(item => {
    // const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    const localItem = { ...item, children: [] };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

const defaultFooterDom = (
  <DefaultFooter
    copyright="2020 云筑科技"
    links={[
      {
        key: '众筑实名制云管理平台',
        title: '众筑实名制云管理平台',
        href: 'https://pro.ant.design',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/ant-design/ant-design-pro',
        blankTarget: true,
      },
      {
        key: '众筑网',
        title: '众筑网',
        href: 'http://www.zhongzw.com/',
        blankTarget: true,
      },
    ]}
  />
);

const footerRender: BasicLayoutProps['footerRender'] = () => {
  if (!isAntDesignPro()) {
    return defaultFooterDom;
  }

  return (
    <>
      {defaultFooterDom}
      <div
        style={{
          padding: '0px 24px 24px',
          textAlign: 'center',
        }}
      >
        <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
            width="82px"
            alt="netlify logo"
          />
        </a>
      </div>
    </>
  );
};

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  const [isShowBack,setShowBack ] = useState(false);

  /**
   * constructor
   */
  useEffect(()=>{
    document.getElementById('layoutContent').style.height = window.innerHeight - 90+'px';
    showBack = setShowBack;
  },[])
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority
  const getPath = (menuItemProps:any)=>{
    let path = '';
    switch(menuItemProps.path){
      case '/admin/data/:id'://心理教育资料管理
      case '/admin/data'://心理辅导管理
        path = '/admin/data/5f869ffb9a39891c3ee73419';
        break;
      case '/admin/data/training/:id'://心理训练管理
        path = '/admin/data/training/5f9fb0979a3989116bc31ea5';
        break;
      case '/admin/data/post/:id'://发文管理
        path = '/admin/data/post/5f9fb0f29a3989116bc31ea7';
        break;
      case '/admin/banner/:id'://Pc首页Banner管理
      case '/admin/banner'://banner管理
        path = '/admin/banner/5f87b81d9a3989548fe6a44d';
        break;
      case '/admin/banner/wx/:id'://小程序首页Banner管理
        path = '/admin/banner/wx/5f87be639a3989548fe6a470';
        break;
      case '/admin/Tj/:id'://今日推荐
        path = '/admin/Tj/6049e682276dde4ffc2643a1';
        break;
      case '/admin/qaadmin/qalist/:id'://心理问答
      case '/admin/qaadmin'://心理问答管理
        path = '/admin/qaadmin/qalist/5f9b752d9a3989438eeec9c0';
        break;
      case '/admin/advisory'://心理咨询管理
        path = '/admin/advisory/consultantlist'; //咨询师管理
        break;
      case '/admin/organizeUsers'://账号管理
        path = '/admin/organizeUsers/usergroup'; //账号设置
        break;
      default:
        path = menuItemProps.path;
        break;
    }
    return path;
  }
  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  let headerRenderMenu: any[] = [];
  const routes = props.route.routes?props.route.routes:[];
    routes.map((e)=>{
      if(location.pathname.indexOf(e.path)!==-1){
        let headerMenu = e.routes?e.routes.concat([]):[]
        headerRenderMenu = headerMenu;
      }
  })
  return (
    <ProLayout
      // logo={logo}
      menuHeaderRender={(logoDom, titleDom) => (
        <div style={{ height: '54px' }}></div>
      )}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
          return defaultDom;
        }
        let path =  getPath(menuItemProps);
        return <Link to={path}>{defaultDom}</Link>
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: '首页',
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
            <span>{route.breadcrumbName}</span>
          );
      }} 
      headerRender={() => {
        return <div className={styles.header}>
          <span className={styles.logoWrap} title={'趁年轻后台管理'}>
            <Iconfont type="iconlogo" style={{fontSize:'29px'}}/>
            <span style={{marginLeft:'10px'}}>趁年轻后台管理</span>
          </span> 
          <div>
            {
              isShowBack? <div className="has-breadcrumb">
              <div style={{cursor:"pointer",marginBottom:'5px'}} onClick={() => {
                  setShowBack(false);
                  backCallBack();
                }} className='cancel_btn'>
                  <LeftOutlined />返回
              </div>
            </div>:
            <div className="headMenu">
              {
                headerRenderMenu.map((e,i)=>{
                let path = getPath(e);
                return <div className={'headMenuItem '+(location.pathname==path?'headMenuItemChecked':'')} onClick={()=>{
                  window.location.href = '/#'+path;
                }}>
                  {e.name}
                </div>
                })
              }
            </div>
            // <PageHeaderWrapper/>
            }
          </div>
          <RightContent />
        </div>
      }} 
      // footerRender={footerRender}
      menuDataRender={menuDataRender}
      // rightContentRender={() => <RightContent />}
      {...props}
      {...settings}
      isChildrenLayout={false}
    > 
      <Authorized authority={authorized!.authority} noMatch={noMatch}>
        
        <div id="layoutContent"  className={styles.contentWrap} >
          {children} 
        </div>
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
