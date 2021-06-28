import React, { Component } from 'react'
import { Input, Tree } from 'antd';
import './leftTree.less';
import { withRouter } from 'react-router-dom'
import { GetGroupList } from '../components/sysSetting/group/request';
import { GetUrlParams } from '../tools/tools';
import { GetJobsList } from '../components/sysSetting/postSetting/request';
const { TreeNode } = Tree;
const { Search } = Input;

let list = [];

class LeftTree extends Component {

  constructor(props) {
    super(props);
    const params = GetUrlParams();
    let defaultSelectedKeys = [];
    if (params.id) {
      defaultSelectedKeys = [params.id];
    }
    this.state = {
      expandedKeys: [],
      list: list,
      defaultSelectedKeys,
      searchValue: '',
      requestUrl: props.requestUrl || null,
      shouldControlUrl: props.hasOwnProperty('shouldControlUrl') ? props.shouldControlUrl : true
    }
  }

  onSelect = (selectedKeys, e) => {
    if (selectedKeys.length === 0) {
      return
    }
    let name = null;
    try {
      name = e.node.props.title;
    } catch{

    }
    if (this.state.shouldControlUrl) {
      this.props.history.replace(this.props.location.pathname + `?id=${selectedKeys}&name=${name}`)
    }
    this.props.onSelect && this.props.onSelect(selectedKeys, name);
  }

  onExpand = (selectedKeys, e) => {
    this.setState({
      expandedKeys: e.expanded ? [e.node.props.eventKey] : []
    })
  }

  componentDidMount () {
    this.getList();
  }

  getList (id = '', k = '') {
    /* 
    jobs 用来判断是  具体自己看代码
    
    */
    this.props.jobs ?
      GetJobsList(id, k).then(res => {
        this.setState({
          list: res.data || []
        })
      }).catch(e => {

      }) :
      GetGroupList(id, k, this.state.requestUrl).then(res => {
        this.setState({
          list: res.data || []
        })
      }).catch(e => {

      })
  }

  loopTree = (list) => (
    list.map(ele => {
      if (ele.childs && ele.childs.length > 0) {
        return (
          <TreeNode key={ele.id} title={ele.name} >
            {this.loopTree(ele.childs)}
          </TreeNode>
        )
      }
      return (
        <TreeNode key={ele.id} title={ele.name} />
      )
    })
  )

  onSearch = (value = '', id: null) => {
    this.getList(null, value)
  }

  render () {
    const { list, defaultSelectedKeys } = this.state;
    return (
      <div className="left_tree">
        <Search
          className='left_tree_search'
          placeholder="请输入名称"
          onSearch={this.onSearch}
          style={{ width: 180 }}
        />
        {
          list.length > 0 && <Tree
            onSelect={this.onSelect}
            onExpand={this.onExpand}
            blockNode={true}
            defaultExpandedKeys={[list[0].id]}
            autoExpandParent={true}
            defaultSelectedKeys={defaultSelectedKeys}
          // expandedKeys={expandedKeys}
          >
            {
              this.loopTree(list)
            }
          </Tree>
        }

      </div>
    )
  }
}

export default withRouter(LeftTree)