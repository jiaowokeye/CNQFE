import React, { Component } from 'react'
import './commonNewTitle.less'
import { RightOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { Link } from 'react-router-dom';
import styles from './commonNewTitle.less';
class CommonNewsTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noMore: !!props.noMore
    }
  }
  jumpDocument () {
    if(this.props.url){
      window.location.history.push(this.props.url)
    }else{
      message.error('么有地址跳转')
    }
  }
  render () {
    const { noMore } = this.state;
    return (
      <div className={styles.commonTitleWrap}>
        {
          this.props.title?<div className={styles.commonTitle}>
          {this.props.title}
          </div>: this.props.renderHtml
        }
        {
          !noMore && <div  className={styles.more}>
            <Link style={{color:'#949494'}} to={this.props.url}>更多</Link>  
          <RightOutlined style={{ fontSize: 10 }} />
          </div>
        }

      </div>
    );
  }
}

export default CommonNewsTitle