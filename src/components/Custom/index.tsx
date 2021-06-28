import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Tag } from 'antd';
import styles from './index.less';

//头部搜索

function TypeCircleObj( props:any ){
  var classNames = styles.borCircle;
  if(props.type == 1){
    classNames = styles.borCircle + " " + styles.warning;
  }else if(props.type == 2){
    classNames = styles.borCircle + " " + styles.success;
  }
  return <span style={{fontSize:"12px",fontWeight:"500"}}>
    <span className={classNames}></span>{props.children}
  </span>
}
const TypeCircle = forwardRef(TypeCircleObj);

function TypeTags( props:any ){
  var oColor = "";
  if(props.type == 0){
    oColor = "red";
  }else if(props.type == 1){
    oColor = "gold";
  }else if(props.type == 2){
    oColor = "default";
  }else if(props.type == 3){
    oColor = "processing";
  }else if(props.type == 4){
    oColor = "green";
  }
  return <span>
    <Tag color={oColor} style={{verticalAlign:"top"}}>{props.children}</Tag>
  </span>
}
const TypeTag = forwardRef(TypeTags);

export {
  TypeCircle,TypeTag
}