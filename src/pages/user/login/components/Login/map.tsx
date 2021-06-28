import { MailOutlined, MobileOutlined } from '@ant-design/icons';
import React from 'react';
import styles from './index.less';
import Iconfont from '@/components/Iconfont/index'
export default {
  UserName: { 
    props: {
      size: 'large',
      id: 'userName',
      prefix: <Iconfont type="icon-yunzhuyonghu" className={styles.prefixIcon} />,
      placeholder: 'admin',
    }, 
    rules: [
      { 
        required: true,
        message: 'Please enter username!',
      },
    ],
  },
  Password: {
    props: {
      size: 'large',
      prefix: <Iconfont type="icon-yunzhumima" className={styles.prefixIcon} />,
      type: 'password',
      id: 'password',
      placeholder: '888888',
    },
    rules: [
      {
        required: true,
        message: 'Please enter password!',
      },
    ],
  },
  Mobile: {
    props: {
      size: 'large',
      prefix: <MobileOutlined className={styles.prefixIcon} />,
      placeholder: 'mobile number',
    },
    rules: [
      {
        required: true,
        message: 'Please enter mobile number!',
      },
      {
        pattern: /^1\d{10}$/,
        message: 'Wrong mobile number format!',
      },
    ],
  },
  Captcha: {
    props: {
      size: 'large',
      prefix: <MailOutlined className={styles.prefixIcon} />,
      placeholder: 'captcha',
    },
    rules: [
      {
        required: true,
        message: 'Please enter Captcha!',
      },
    ],
  },
};
