import React from 'react'
import './botCard.less';

class BodCard extends React.Component {
  render () {
    const { title, children, renderRight = null } = this.props;
    return (
      <div className='bot_card_container'>
        <div className="row_line" />
        <div className="col_line" />
        <div className="bot_card_title_c">
          {title}
          {renderRight && renderRight()}
        </div>
        {
          children
        }
      </div>
    )
  }
}

export default BodCard