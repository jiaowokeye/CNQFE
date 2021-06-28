import React, { useEffect } from 'react';
import {Modal} from 'antd';
Modal.propTypes.afterClose = ()=>{
    console.log(111);
}
export default Modal;