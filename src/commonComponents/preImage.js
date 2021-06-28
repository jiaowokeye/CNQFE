import React from 'react'
import { Modal } from 'antd'

const PreImage = (props) => (
  <img
    onClick={() => {
      Modal.info({
        title: '封面图',
        content: (
          <img src={props.url} alt='' className='pre_upload_cover_image' />
        ),
      })
    }}
    src={props.url} className='table_cover_img' alt='' />
)

export default PreImage