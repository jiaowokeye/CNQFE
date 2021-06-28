import React, { Component } from 'react';
import { MostRequest } from '../tools/request';
import './friendLink.less';
let list = [];
class FriendLink extends Component {

  constructor(props) {
    super(props);
    this.state = {
      theme: props.theme,
      list
    }
  }

  componentDidMount () {
    this.getLinks()
  }

  getLinks () {
    if (list.length > 0) return;
    MostRequest.Get('/v1/home/friend_link/list').then(res => {
      this.setState({
        list: res.data || []
      });
      list = res.data;
    }).catch(e => {
      console.log(e);
    })
  }

  render () {
    const className = this.state.theme === 'light' ? 'light' : ''
    const { list } = this.state;
    const _className = list.length > 8 ? 'between_flex' : '';
    return (
      [
        <div key='friend_link' className={`friend_link ${className} ${_className}`}>
          <span>友情链接：</span>
          {
            list.map(ele => (
              <a href={ele.url} target='_blank' rel="noopener noreferrer" key={ele.id}>{ele.title}</a>
            ))
          }
        </div>,
        <div key='CopyRight' className={`CopyRight between_flex ${className}`}>
          <a href='http://beian.miit.gov.cn/state/outPortal/loginPortal.action;jsessionid=e-hrAzhVBwMj9AiATNu_GbL5A5vKk9O3uKERx74WThdCnLWMXXEo!1958385134'>京ICP备19054936号-2</a>
          {/* <span>中共委组织部版权所有</span> */}
          <span>北京二麦科技有限公司技术支持</span>
        </div>
      ]
    )
  }
}

export { FriendLink };
