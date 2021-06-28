import { Button, Drawer, Table } from 'antd'
import React from 'react'
import { withRouter } from 'react-router-dom'
import CommentList from '@com/commentList'
import { Forms } from '@com/forms'
import PreImage from '@com/preImage'
import Title from '@com/title'
import { DeleteSource, GetUrlParams, OfflineSource } from '@/tools/tools'
import './index.less'
import { GetNewsList } from './request'

const list = [
  {
    input: true,
    key: 'k',
    placeholder: ''
  },
]

const columns = [
  /* {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  }, */
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '来源',
    dataIndex: 'from',
    key: 'from',
  },
  {
    title: '封面',
    dataIndex: 'cover_image',
    key: 'cover_image',
    render: (text) => (
      <PreImage
        url={text}
      />
    )
  },
  {
    title: '作者',
    dataIndex: 'author_name',
    key: 'author_name',
  },
  {
    title: '顺序',
    dataIndex: 'sort',
    key: 'sort',
  },
  /* {
    title: '评论',
    dataIndex: 'comment',
    key: 'comment',
    render: () => (
      <span onClick={container.showRight} className='link'> </span>
    )
  }, */
  {
    title: '收藏',
    dataIndex: 'fav',
    key: 'fav',
  },
  {
    title: '阅读',
    dataIndex: 'read',
    key: 'read',
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span className='table_control'>
        <span onClick={() => container.jumpToAddNews(record.id)} className='link'>编辑</span>
        {/* <span className='link'>排序</span> */}
        <span className='link'>置顶</span>
        <span onClick={() => container.offlineData(record.id, record.is_online)} className='link'>{record.is_online ? '下架' : '上架'}</span>
        <span onClick={() => container.deleteData(record.id)} className='delete'>删除</span>
      </span>
    ),
  },
];
let container;
class FocusNews extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      current: 1,
      pageSize: 20,
      loading: true,
      title: '',
      total: 0,
      rightVisible: false
    }
  }

  getParams () {
    const params = GetUrlParams();
    this.setState({
      tag_id: params.tag_id,
      sub_tag_id: params.sub_tag_id,
      title: decodeURIComponent(params.title) || '',
    }, () => {
      this.getList(true);
    })
  }

  deleteData = (id) => {
    DeleteSource('document', [id]).then(res => {
      this.getList()
    })
  }

  offlineData = (id, is_hote) => {
    OfflineSource('document', [id], !is_hote).then(res => {
      this.getList()
    })
  }

  componentDidMount () {
    container = this;
    this.getParams();
  }

  UNSAFE_componentWillReceiveProps (n: Object) {
    if (n.location.search !== this.props.location.search) {
      this.getParams(true);
    }
  }

  async getList (refresh = false, value = {}) {
    this.setState({
      loading: true
    })
    const res = await GetNewsList({
      tag_id: this.state.tag_id,
      sub_tag_id: this.state.sub_tag_id,
      offset: refresh ? 1 : this.state.current,
      count: this.state.pageSize,
      ...value
    });
    this.setState({
      data: res.list || this.state.data,
      loading: false,
      total: res.total_count
    })
  }
  /* onShowSizeChange = (current: number, pageSize: number) => {
    this.getList({ current, pageSize })
  }; */

  onCurrentChange = (current: number) => {
    this.setState({
      current
    }, () => {
      this.getList()
    })
  };

  onSearch = (values) => {
    this.getList(true, values)
  }

  jumpToAddNews = (_id) => {
    const pathname = this.props.location.pathname;
    const { tag_id, sub_tag_id } = this.state;
    _id ? this.props.history.push(`${pathname}/addDocuments?tag_id=${tag_id}&sub_tag_id=${sub_tag_id || ''}&_id=${_id}`) :
      this.props.history.push(`${pathname}/addDocuments?tag_id=${tag_id}&sub_tag_id=${sub_tag_id || ''}`)
  }

  showRight = () => {
    console.log(1);
    this.setState({
      rightVisible: true
    })
  }

  onClose = () => {
    this.setState({
      rightVisible: false
    })
  }

  RightCommentBox = () => (
    <Drawer
      width={660}
      title=""
      placement="right"
      closable={true}
      onClose={this.onClose}
      visible={this.state.rightVisible}
    >
      <div className='right_comment'>
        <div className="right_group_title_">
          评论详情
        </div>
        <div className="comment_title">
          标题：“硬核”又好玩——第二届进博会装备展区
        </div>
        <div className="comment_desc">
          <div>发布时间：2019-11-30  18:00:00</div>
          <div>评论数量：96</div>
          <div>点赞数量：847</div>
        </div>
        <div className="comment_list_box_">
          <CommentList />
          <CommentList />
          <CommentList />
        </div>
      </div>
    </Drawer>
  )

  render () {
    const btns = [
      {
          label: '批量删除',
          props: {
              className: 'error_btn',
              
          }
      },
      {
        label: '添加',
        props: {
            className: 'success_btn',
            onClick:() => this.jumpToAddNews()
        }
      }
    ]
    const { data, current, pageSize, loading, title, total } = this.state;
    return (
      <div className='focus_news_container'>
        <Title
          className='focus_news_title'
          title={title}
          // renderRight={() => (
          //   <div className='title_right'>
          //     <Button className='error_btn'>批量删2除</Button>
          //     <Button className='success_btn'>添加</Button>
          //   </div> 
          // )} 
        />
        <div className="forms_box">
          <Forms
            onSearch={this.onSearch}
            list={list} 
            btns={btns}  
          />
            
        </div>

        <div className="table_box">
          <Table
            rowKey='id'
            dataSource={data}
            loading={loading}
            columns={columns}
            pagination={{
              // showSizeChanger: true,
              showQuickJumper: true,
              // onShowSizeChange: this.onShowSizeChange,
              current: current,
              total: total,
              onChange: this.onCurrentChange,
              pageSize: pageSize
            }}
          />
        </div>
        <this.RightCommentBox />
      </div>
    )
  }
}
export default withRouter(FocusNews)
