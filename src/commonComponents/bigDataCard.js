import React from 'react'
import './bigDataCard.less'

const BigDataCard = (props) => {

  const style = {};
  if (props.width) {
    style.width = props.width;
  } else {
    style.flex = 1;
  }
  return (
    <div style={style} className={'big_data_card '+props.className}>
      <div className="big_data_card_title">
        <span className="title">{props.title}</span>
        <span className="desc">{props.desc}</span>
      </div>
      {props.children}
    </div>
  )
};

export default BigDataCard