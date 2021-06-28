import React, { Component ,Fragment} from 'react'
import {  Tree ,Dropdown ,Menu,Modal, Input} from 'antd';
import './index.less';
import { withRouter } from 'react-router-dom'
import { grouptree ,groupAdd ,updategroup,deleteGroup} from '@/services/sys';
import {CaretDownOutline} from '@ant-design/icons'
import morepng from '@/assets/images/more.png';
import {Treebeard} from 'react-treebeard';
import * as filters from './filter';
import {CaretRightOutlined,CaretDownOutlined} from '@ant-design/icons';
const { TreeNode } = Tree;
// const { Search } = Input;
let firstAuthGroup = null;
let list= [];
let container=null;
class GroupUserTree extends Component {

  constructor(props) {
    super(props);
    let defaultSelectedKeys= [];
    
    this.state = {
      expandedKeys: [],
      list: [],
      defaultSelectedKeys,
      searchValue: '',
      visible:false,
      groupId:'',
      pId:'',
      title:'',
      cursor:'',
      requestUrl: props.requestUrl || null,
      shouldControlUrl: props.hasOwnProperty('shouldControlUrl') ? props.shouldControlUrl : true
    }
    this.toggledObj = {};
    this.onToggle = this.onToggle.bind(this);
  }
  onToggle(node, toggled){
    const {cursor, list} = this.state;
    if (cursor) {
        this.setState(() => ({cursor, active: false}));
    }
    node.active = true;
    if (node.children) { 
        node.toggled = toggled; 
    }
    this.setState(() => ({cursor: node, list: Object.assign({}, list)}));
  }
  onSelect = (selectedKeys, e) => {
    if (selectedKeys.length === 0) {
      return
    }
    let name = null;
    try {
      name = e.node.name;
    } catch{

    }
    
    this.props.onSelect && this.props.onSelect(selectedKeys, name);
  }
  onCheck = (checkedKeys,e)=>{
    const checkedNodesPositions = e.checkedNodesPositions;
    const checkIdArr = [];
    const checkNameArr = [];
    checkedNodesPositions.map((e)=>{
      checkIdArr.push(e.node.key);
      checkNameArr.push(e.node.name)
      return '';
    })
    this.props.onSelect && this.props.onSelect(checkIdArr, checkNameArr);
  }
  onExpand = (selectedKeys, e) => {
    this.setState({
      expandedKeys: e.expanded ? [e.node.props.eventKey] : []
    })
  }

  componentDidMount () {
    container = this;
    this.getList();
  }
  
  handleData(data){
    let {toggledObj} = this.state;
    let treedata = data.concat([]);
    let toggledObjNew = {};
    let cursor = '';
    treedata.map((e,i)=>{
      if(!firstAuthGroup){
        firstAuthGroup = {
          id:e.id,
          name:e.name
        }
        this.toggledObj[e.id] = true;
        cursor = e.id;
        this.setState({
          cursor:cursor
        })
      }
      const children = e.routes?e.routes:[];
      treedata[i].iconSkin='fa-xxx';
      treedata[i].type=1;
      treedata[i].pname='**';
      treedata[i].pid='**';
      treedata[i].children = this.handleData(children);
      if(this.toggledObj[e.id]){
        treedata[i].toggled=true;
      }else{
        treedata[i].toggled=false;
        this.toggledObj[e.id] = false;
      }


      treedata[i].active=true;
      // if(type==2){
      //     const members = e.children?e.members:[];
      //     members.map((el,il)=>{
      //         members[il]['iconSkin']='fa-user-o';
      //         members[il].type=2;
      //         members[il].pname=e.name;
      //         members[il].pid=e.id;
      //         members[il].auth=e.auth;
      //     })
      //     if(e.auth){
      //       treedata[i].children = treedata[i].children.concat(members);
      //     }
          
      // }
      
    })


  return treedata
  }
  getList (id = '', k = '') {
    grouptree().then((res)=>{
      let list = res.data?res.data:[];
      list = this.handleData(list);
      this.setState({
        list: list
      })
      
      if(!this.props.dontSelectOne){
        const RootGroup = res.data[0];
        this.props.onSelect && this.props.onSelect([RootGroup['id']], RootGroup['name']);
      }
    })
  }
  renderTitle(item,props){
    let {canoperating=true } = this.props;
    const menu = (
      <Menu className="treeMenu" style={{width:'100px',textAlign:'center'}}>
        <Menu.Item>
          <a rel="noopener noreferrer" onClick={()=>this.addGroup(item)} >
            添加
          </a>
        </Menu.Item>
        <Menu.Item>
          <a rel="noopener noreferrer" onClick={()=>this.updateGroup(item)} >
            修改
          </a>
        </Menu.Item>
        <Menu.Item danger><a onClick={()=>this.deleteGroup(item)} rel="noopener noreferrer">删除</a></Menu.Item>
      </Menu>
    );
    return <div className={this.state.cursor==item.id?'treenodeitem active':'treenodeitem'}>
      {
        item.children&&item.children.length>0?<div onClick={()=>{
          this.toggledObj[item.id] = !this.toggledObj[item.id];

          let {list} = this.state;
          list = this.handleData(list);
          this.setState({
            list: list
          })
         
        }} style={{width:'20px'}}>
          {
            this.toggledObj[item.id]?<CaretDownOutlined style={{color:'#465FFD'}}/>:<CaretRightOutlined  style={{color:'#465FFD'}}/>
          }
        </div>:<div style={{width:'20px'}}></div>
      }
      {/* 
         */}
        <div className="treenodeitemcontent">
          <span style={{flex:'1',padding:'10px 5px'}} onClick={()=>{
            this.setState({
              cursor:item.id
            },()=>{
              this.props.onSelect && this.props.onSelect([item.id], item.name);
              console.log([item.id], item.name);
            })
          }}>{item.name}</span>
            {
              canoperating&& <Dropdown overlay={menu} trigger={['click']}>
              <img  src={morepng} alt=""/>
            </Dropdown>
            }
        </div>
        
    </div>
  } 
  



  onSearch = (value = '', id) => {
    this.getList(null, value)
  }
  addGroup = (item)=>{
    this.setState({
      visible: true,
      groupId:'',
      pId:item.id,
      title:''
    });
  }
  updateGroup = (item)=>{
    this.setState({
      visible: true,
      groupId:item.id,
      pId:item.pid,
      title:item.name
    });
  }
  deleteGroup = (item)=>{
    let deleteGroupRequest = (id)=>{
      // 请求在这里
      deleteGroup(id).then((res)=>{
        this.setState({
          visible:false
        })
        this.getList();
      })
    }
    Modal.confirm({
      title: '确认删除',
      content: '删除后本部门将会消失',
      okText: '确认',
      cancelText: '取消',
      onOk: () => deleteGroupRequest(item.id)
    })
  }

  handleOk = (e) => {
    const {groupId,pId,title} = this.state;
    if(groupId){// 修改 
      updategroup({
        id:groupId,
        pid:pId,
        name:title
      }).then((res)=>{
        this.setState({
          visible:false
        })
        this.getList();
      })
    }else{ // 新增
      groupAdd({
        name:title,
        pid:pId
      }).then((res)=>{
        this.setState({
          visible:false
        })
        this.getList();
      })
    }
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };
  render () {
    const { list, defaultSelectedKeys} = this.state;
    const {multiple=false} = this.props;
    const decorators = {
      Toggle: (props) => {
        return (
            <div style={props.style}>
                <svg height={props.height} width={props.width}>
                    // Vector Toggle Here
                </svg>
            </div>
        );
      },
      Container: (props) => {
          return <div>
            
            {this.renderTitle(props.node,props)}
          </div>
      }
    };
    return (
      <div className="left_tree">
        <Fragment>
          <Treebeard
                data={list}
                decorators={decorators}
                onToggle={this.onToggle}
            />
        </Fragment>
        {/* <Search
          className='left_tree_search'
          placeholder="请输入名称"
          onSearch={this.onSearch}
        /> */}
        {/* {
          list.length > 0 && <Tree
            onSelect={this.onSelect}
            onExpand={this.onExpand}
            blockNode={true}
            multiple={multiple}
            onCheck={this.onCheck}
            checkable={multiple?true:false}
            defaultExpandedKeys={[list[0].id]}
            autoExpandParent={true}
            defaultSelectedKeys={defaultSelectedKeys}
            switcherIcon={<CaretDownOutline style={{color:'white'}}/>}
          // expandedKeys={expandedKeys}
          >
            {
              this.loopTree(list)
            }
          </Tree>
        } */}
        
        <Modal
          title="部门"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          centered
        >
          <Input value={this.state.title}  style={{ width: '100%'}} onChange={(e)=>this.setState({
            title:e.target.value
          })}/>
        </Modal>
      </div>
    )
  }
}

export default GroupUserTree;
