import React from 'react'
import { Button } from 'antd';

class BannerCard extends React.Component {

  state = {
    data: this.props.data
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.data !== nextProps.data) {
      this.setState({
        data: nextProps.data
      })
    }
  }

  render () {
    const { data } = this.state;
    return (
      <div className='banner_card'>
        <div className="banner_img" style={{ backgroundImage: `url(${data.url})` }}>
          <div className="banner_img_mask">
            <Button
              onClick={() => {
                this.props.onEditClick && this.props.onEditClick(data)
              }}
              className="edit_banner_img">
              编辑
            </Button>
            <div className="offline_delete center_flex">
              <Button
                onClick={() => {
                  this.props.onlineClick && this.props.onlineClick(data.id, !data.is_online)
                }}
                className="offline_">
                {data.is_online ? '下架' : '上架'}
              </Button>
              <Button
                onClick={() => {
                  this.props.onDeleteClick && this.props.onDeleteClick(data)
                }}
                className="delete_btn">
                删除
              </Button>
            </div>
          </div>
        </div>

        <div className="banner_content">
          <p>
            {data.title}
          </p>
        </div>
        <div className="banner_status between_flex">
          <span className='ellipsis' style={{ width: 100 }}>ID：{data.id}</span>
          <span
            style={{ color: data.is_online ? 'rgba(68, 161, 252, 1)' : 'rgba(149,148,148,1)' }}
            className='banner_online'>状态：{data.is_online ? '上架' : '下架'}</span>
        </div>
      </div>
    )
  }
}
export default BannerCard