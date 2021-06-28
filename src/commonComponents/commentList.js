import React from 'react'
import './commentList.less';
import { DeleteOutlined } from '@ant-design/icons';
const uri = 'https://www.audi.cn/dam/nemo/cn/model/q5/q5l/2019/1920x1080/1920x1080_q5l_02.jpg?output-format=webp&downsize=1920px:*'
const CommentList = (props) => (
  <div className='comment_container'>
    <div className="comment_box">
      {
        props.noIcon ? null : <div className="comment_container_icon">
          <img src={uri} alt="" className="header_icon" />
        </div>
      }


      <div className="comment_container_msg">
        <div className='comment_name_box'>
          <span className="comment_name">
            Most
            </span>
          <span className="time">
            2019-29-0
            </span>
        </div>
        <div className='comment_content'>
          开放是中国赶上并超越世界的根本
          开放是中国赶上并超越世界的根本
          开放是中国赶上并超越世界的根本
          </div>
      </div>

      <div className="comment_container_delete">
        <DeleteOutlined
          style={{
            fontSize: 18,
            color: '#AA0005',
            padding: 4
          }} />
      </div>
    </div>
    {
      props.children
    }
  </div>
)

const CommentCard = () => (
  <CommentList >
    <div className="sub_comment_box">
      <CommentList noIcon />
      <CommentList noIcon />
      <CommentList noIcon />
      <div className="lookmore">
        查看全部6条评论
      </div>
    </div>
  </CommentList>
)

export default CommentCard