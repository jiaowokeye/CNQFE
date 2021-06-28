import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import styles from './index.less';

export default (props:any) => {
  return <div>
    {props.children}
  </div>
};
