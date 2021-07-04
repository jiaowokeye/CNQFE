import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';
import RendererWrapper0 from 'C:/Users/Administrator/Desktop/cnq-FE/src/pages/.umi/LocaleWrapper.jsx';
import { routerRedux, dynamic as _dvaDynamic } from 'dva';

const Router = routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/user',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__UserLayout" */ '../../layouts/UserLayout'),
          LoadingComponent: require('C:/Users/Administrator/Desktop/cnq-FE/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/UserLayout').default,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__user__login" */ '../user/login'),
              LoadingComponent: require('C:/Users/Administrator/Desktop/cnq-FE/src/components/PageLoading/index')
                .default,
            })
          : require('../user/login').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('C:/Users/Administrator/Desktop/cnq-FE/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/admin',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__SecurityLayout" */ '../../layouts/SecurityLayout'),
          LoadingComponent: require('C:/Users/Administrator/Desktop/cnq-FE/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/SecurityLayout').default,
    routes: [
      {
        path: '/',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "layouts__BasicLayout" */ '../../layouts/BasicLayout'),
              LoadingComponent: require('C:/Users/Administrator/Desktop/cnq-FE/src/components/PageLoading/index')
                .default,
            })
          : require('../../layouts/BasicLayout').default,
        routes: [
          {
            name: '订单管理',
            path: '/admin/order',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__admin__order" */ '../admin/order'),
                  LoadingComponent: require('C:/Users/Administrator/Desktop/cnq-FE/src/components/PageLoading/index')
                    .default,
                })
              : require('../admin/order').default,
            authority: ['user', 'admin'],
            exact: true,
          },
          {
            name: '会员卡销售记录',
            path: '/admin/obligee',
            authority: ['user', 'admin'],
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__admin__obligee" */ '../admin/obligee'),
                  LoadingComponent: require('C:/Users/Administrator/Desktop/cnq-FE/src/components/PageLoading/index')
                    .default,
                })
              : require('../admin/obligee').default,
            exact: true,
          },
          {
            name: '退款管理',
            path: '/admin/refund',
            authority: ['user', 'admin'],
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__admin__refund" */ '../admin/refund'),
                  LoadingComponent: require('C:/Users/Administrator/Desktop/cnq-FE/src/components/PageLoading/index')
                    .default,
                })
              : require('../admin/refund').default,
            exact: true,
          },
          {
            name: '发票管理',
            path: '/admin/invoice',
            authority: ['user', 'admin'],
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__admin__invoice" */ '../admin/invoice'),
                  LoadingComponent: require('C:/Users/Administrator/Desktop/cnq-FE/src/components/PageLoading/index')
                    .default,
                })
              : require('../admin/invoice').default,
            exact: true,
          },
          {
            name: '会员卡管理',
            path: '/admin/memberCard',
            authority: ['user', 'admin'],
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__admin__memberCard" */ '../admin/memberCard'),
                  LoadingComponent: require('C:/Users/Administrator/Desktop/cnq-FE/src/components/PageLoading/index')
                    .default,
                })
              : require('../admin/memberCard').default,
            exact: true,
          },
          {
            name: '价格管理',
            path: '/admin/priceMan',
            authority: ['user', 'admin'],
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__admin__priceMan" */ '../admin/priceMan'),
                  LoadingComponent: require('C:/Users/Administrator/Desktop/cnq-FE/src/components/PageLoading/index')
                    .default,
                })
              : require('../admin/priceMan').default,
            exact: true,
          },
          {
            name: '用户管理',
            path: '/admin/usersMan',
            authority: ['admin'],
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__admin__usersMan" */ '../admin/usersMan'),
                  LoadingComponent: require('C:/Users/Administrator/Desktop/cnq-FE/src/components/PageLoading/index')
                    .default,
                })
              : require('../admin/usersMan').default,
            exact: true,
          },
          {
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__404" */ '../404'),
                  LoadingComponent: require('C:/Users/Administrator/Desktop/cnq-FE/src/components/PageLoading/index')
                    .default,
                })
              : require('../404').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('C:/Users/Administrator/Desktop/cnq-FE/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__404" */ '../404'),
              LoadingComponent: require('C:/Users/Administrator/Desktop/cnq-FE/src/components/PageLoading/index')
                .default,
            })
          : require('../404').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('C:/Users/Administrator/Desktop/cnq-FE/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__UserLayout" */ '../../layouts/UserLayout'),
          LoadingComponent: require('C:/Users/Administrator/Desktop/cnq-FE/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/UserLayout').default,
    routes: [
      {
        name: 'login',
        path: '/',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__user__login" */ '../user/login'),
              LoadingComponent: require('C:/Users/Administrator/Desktop/cnq-FE/src/components/PageLoading/index')
                .default,
            })
          : require('../user/login').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('C:/Users/Administrator/Desktop/cnq-FE/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () => import(/* webpackChunkName: "p__404" */ '../404'),
          LoadingComponent: require('C:/Users/Administrator/Desktop/cnq-FE/src/components/PageLoading/index')
            .default,
        })
      : require('../404').default,
    exact: true,
  },
  {
    component: () =>
      React.createElement(
        require('C:/Users/Administrator/Desktop/cnq-FE/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
