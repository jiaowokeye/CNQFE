import { IConfig, IPlugin } from 'umi-types';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import themePluginConfig from './themePluginConfig';
const { pwa } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: false,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

if (isAntDesignProPreview) {
  // 针对 preview.pro.ant.design 的 GA 统计代码
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push(['umi-plugin-antd-theme', themePluginConfig]);
}

export default {
  plugins,
  hash: true,
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    
    {
      path: '/admin',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
         
          routes: [
            {
              name: '订单管理',
              path: '/admin/order',
              component: './admin/order',
              authority: ['user','admin'],
            },
            {
              name: '退款管理',
              path: '/admin/refund',
              authority: ['user','admin'],
              component: './admin/refund',
            },
            {
              name: '发票管理',
              path: '/admin/invoice',
              authority: ['user','admin'],
              component: './admin/invoice',
            },
            {
              name: '会员查询',
              path: '/admin/memberQuery',
              authority: ['user','admin'],
              component: './admin/memberQuery',
            },
            {
              name: '权利人查询',
              path: '/admin/obligee',
              authority: ['user','admin'],
              component: './admin/obligee',
            },
            {
              name: '会员卡管理',
              path: '/admin/memberCard',
              authority: ['user','admin'],
              component: './admin/memberCard',
            },
            {
              name: '价格管理',
              path: '/admin/priceMan',
              authority: ['user','admin'],
              component: './admin/priceMan',
            },
            {
              name: '用户管理',
              path: '/admin/usersMan',
              authority: ['admin'],
              component: './admin/usersMan',
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
   
    {
      path: '/',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/',
          component: './user/login',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': '#465FFD',
    //按钮主颜色
    // 全局主色
    'link-color': '#465FFD',
    // 链接色
    
    //鼠标滑过表格背景色
    'table-row-hover-bg': '#F8FCFA',
    'btn-primary-shadow': 0,
    'border-radius-base': '2px',
    'table-header-bg': '#fff',
    'pagination-item-size': '32px',
    'menu-dark-selected-item-icon-color': '#465FFD',
    'menu-icon-size': '14px',
    'font-size-base': '13px',
    'menu-dark-selected-item-text-color': '#465FFD',
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  // chainWebpack: webpackPlugin,
  proxy: {
    '/psy/': {
      target: 'https://www.chenyoung.cn/ntz_dev/api/v1',
      //http://123.56.92.14:8081/yunzhu/
      changeOrigin: true,
      pathRewrite: {
        '^/psy': '',
      },
    },
  },
  base: '/',
  publicPath: '/',
  history: 'hash',
} as IConfig;
