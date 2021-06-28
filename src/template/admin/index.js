import React, { Component } from 'react';
import { Button,Pagination } from 'antd';
import { connect } from 'dva';
import { Forms } from '@/components/Forms/forms'
import styles from './style.less';
import Request, { Delete, Get } from '@/utils/request'
let container = null;
const btns = [
  {
    label: '新增资料',
    props: {
      className: 'success_btn',
      onClick: () => { 
        container.setState({
          edit:true,
          id:''
        })
      }
    }
  }
]
const form_list = [
  {
    input: true,
    key: 'k',
    placeholder: '关键字'
  }
]

@connect(({ banner }) => banner)

class Page extends Component {
  state={
    loading:false,
    offset:0,
    count:10,
    total:0,
    list: [],
  }
  componentDidMount() {
    container = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'banner/fetch',
    });
    this.getList();
  }
  getList(){
    this.setState({
      loading: true
    })
    Request('/psy/portlet/banner/query', {
      k: '',
      page_id:this.props.match.params.id,
      offset: this.state.offset*this.state.count,
      count: this.state.count
    }).then((res) => {
      this.setState({
        loading: false,
        list: res.data.data,
        total:res.data.total_count
      })
    })
  }
  onCurrentChange = (offset) => {
    this.setState({
      offset:offset-1
    }, () => {
      this.getList()
    })
  };
  render() {
    const { text } = this.props;
    const {offset,count,total,list} = this.state;
    return (
      <div className={styles.container}>
        <div className="module-title">
          {this.props.route.name}
        </div>
        <Forms
            btns={btns}
            onSearch={this.onSearch}
            list={form_list}
            reset={this.reset}
        />
        <div>
          <Pagination showQuickJumper={true} onChange={this.onCurrentChange} current={this.state.offset+1} total={this.state.total} pageSize={this.state.count}  />
        </div>
      </div>
    );
  }
}

export default Page;
