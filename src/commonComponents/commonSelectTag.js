import React from 'react'
import './commonSelectTag.less';
export const CommonSelectTag = (props) => (
  <div className='common_select_tag'>
    {
      props.list && props.list.map(ele => (
        <span
          onClick={() => props.onChange && props.onChange(ele.key)}
          className={`${props.selelctKey === ele.key ? 'selelcted' : ''}`}
          key={ele.key}>
          {ele.label}
        </span>
      ))
    }
  </div>
)