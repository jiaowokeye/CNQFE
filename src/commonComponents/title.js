import React from 'react'

export default (props) => (
  <div className={`title_common between_flex ${props.className}`}>
    <div className="titles">
      {props.title}
    </div>

    <div>
      {props.renderRight && props.renderRight()}
    </div>
  </div>
)