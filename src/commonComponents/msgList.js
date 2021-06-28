import React from 'react'
import { Link } from 'react-router-dom'
import { FormatDateStr } from '../tools/tools';

const MsgList = (props) => (
  <div className='msg_news_list between_flex'>
    <Link to={`/newPartyBuild/newsDetail?document_id=${props.data && props.data.id}`} className='news_list_content'>
      <p className="affter ellipsis">
        {(props.data && props.data.title) || 'title'}
      </p>
    </Link>
    <span className='news_list_time'>{props.data && FormatDateStr(props.data.publish_time)}</span>
  </div>
)

export {
  MsgList
}