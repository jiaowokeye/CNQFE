import React, { Component } from 'react'
import { Carousel } from 'antd'
import './bitMap.less'

class BitMap extends Component {
  render () {
    if (!this.props.data) return null
    return (
      <div className='bitmap'>

        <Carousel
          autoplay={this.props.data.length > 0}
          dotPosition='bottom'
        >
          {
            this.props.data.map((item, index) => (
              <div key={index}>
                <a href={item.link} style={{ backgroundImage: `url(${item.url})` }}
                  className='news_img'>
                  <div className="news_desc">
                    {item.title}
                  </div>
                </a>
              </div>
            ))
          }
        </Carousel>
      </div>
    )
  }
}

export default BitMap