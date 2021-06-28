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
import React, { useEffect } from 'react';
import styles from './BasicLayoutUser.less';
import Link from 'umi/link';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import { isAntDesignPro, getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/logo.svg';
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
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });


const footerRender: BasicLayoutProps['footerRender'] = () => {
  return (
    <> 
      <div
       className={styles.footer}
      >
        <div>
        京ICP备19054936号-2
        ©2020-2030 北京二麦科技有限公司版权所有
        </div>
        
      </div>
    </>
  );
};

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  let {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  settings.layout = "topmenu";
  /**
   * constructor
   */

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

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  return (
    <ProLayout
      className="BasicLayoutUserLayout"
      menuHeaderRender={(logoDom, titleDom) => (
        <div style={{ height: '54px' }}></div>
      )}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
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
        return <div style={{ height: '54px' }} className={styles.header}>
          <span style={{
            display: 'inline-block',
            height: '54px',
            padding: '0 12px',
            cursor: 'pointer',
            lineHeight: '54px',
            width: '210px',
            color: '#5A5A5A',
            fontSize: '20px',
            float: 'left',
            textAlign: 'left',
            paddingLeft: '25px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
            title={'趁年轻后台管理'}
          >
            趁年轻后台管理
          </span> 
          <div className={styles.menu}>
            {
              props.route.routes.map((e,i)=>{
                const indexPath = e.path?e.path.replace('/:id',''):'';
                const className = props.location.pathname.indexOf(indexPath)!==-1?styles.link +' '+styles.now:styles.link;
                let path = e.path;
                switch(path){
                  case '/client/index/:id'://客户端首页
                    path = '/client/index/5f87b81d9a3989548fe6a44d';
                    break;
                  default:
                    break;
                }
                return e.name&&<Link className={className} key={i} to={path}>{e.name}</Link>
              })
            }
          </div>
          <RightContent />
        </div>

      }}
      footerRender={footerRender}
      menuDataRender={menuDataRender}
      // rightContentRender={() => <RightContent />}
      {...props}
      {...settings}
    >  
      <Authorized authority={authorized!.authority} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
