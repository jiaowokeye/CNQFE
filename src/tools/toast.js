import { CloseOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './toast.less';
let div;
const body = document.body;
class ModalRight extends Component {
  render () {
    return (
      <div className="modal_container">
        <div onClick={Toast.hide} className="modal_mask" />
        <div className="modal_content_right">
          <div className='modal_content_right_close'>
            <CloseOutlined onClick={Toast.hide} className='close_icon' style={{ fontSize: 14 }} />
          </div>
          {
            this.props.renderHtml && this.props.renderHtml()
          }
        </div>
      </div>
    );
  }
}

class ModalCenter extends Component {
  render () {
    return (
      <div className="modal_container">
        <div onClick={Toast.hide} className="modal_mask" />
        <div className="modal_content_center position_center">
          {
            this.props.renderHtml && this.props.renderHtml()
          }
        </div>
      </div>
    )
  }
}


const RenderModalRight = (props) => {
  div = div || document.createElement('div');
  body.appendChild(div);
  ReactDOM.render(<ModalRight {...props} />, div);
}
const RenderModalCenter = (props) => {
  div = div || document.createElement('div');
  body.appendChild(div);
  ReactDOM.render(<ModalCenter {...props} />, div);
}

export const Toast = {
  showModalRight (props) {
    document.body.style.overflowY = 'hidden';
    if (document.documentElement.offsetHeight < document.querySelector('#root').offsetHeight) {
      document.body.style.width = 'calc(100% - 15px)';
    }
    return RenderModalRight(props)
  },
  showModalCenter (props) {
    document.body.style.overflow = 'hidden';
    return RenderModalCenter(props)
  },
  hide () {
    if (!div) {
      return false
    }
    document.body.style.overflowY = 'auto'
    document.body.style.width = '100%';
    ReactDOM.unmountComponentAtNode(div);
    body.removeChild(div);
    div = null
  },
  notice (type, title, desc) {
    notification[type]({
      title,
      content: desc
    })
  }
}