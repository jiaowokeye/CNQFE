import { Button, Input, Table, Modal } from 'antd';
import React, { Component } from 'react';
import LeftTree from './leftTree';
import './selectManFromTree.less'
import { GetPartyMemberList } from '../components/partyManagement/organizationMangement/request';

const columns_ = [
  {
    title: '姓名',
    key: 'name',
    dataIndex: 'name'
  },
  {
    title: '联系方式',
    key: 'mobile',
    dataIndex: 'mobile'
  },
  {
    title: '邮箱',
    key: 'email',
    dataIndex: 'email'
  }
]
class SelectManFromTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      total: 0,
      visible: props.visible,
      selectedRowKeys: [],
      OldselectedRowKeys: [],
      showList: props.hasOwnProperty('showList') ? props.showList : true,
      selectedRows: [],
      OldselectedRows: [],
      show: true,
    }
    this.k = '';
  }

  getMember = (refresh) => {
    const { list } = this.state;
    GetPartyMemberList({
      party: this.selectGroupId,
      offset: this.state.current,
      k: this.k,
    }).then(res => {
      let arr = res.data.list || [];
      arr = refresh ? arr : list.concat(arr);
      this.setState({
        list: arr,
        current: refresh ? 1 : this.state.current,
        total: res.total_count,
        OldselectedRowKeys:this.state.selectedRowKeys.concat(this.state.OldselectedRowKeys),
        OldselectedRows:this.state.selectedRows.concat(this.state.OldselectedRows),
      })
    }).catch(e => {
      console.log(e);
    })
  }

  onSelect = (id, name) => {
    this.selectGroupId = id[0];
    this.selectName = name;
    this.state.showList && this.getMember(true)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.visible !== nextProps.visible) {
      this.selectGroupId = null;
      this.setState({
        visible: nextProps.visible,
        list: [],
        selectedRows: [],
        selectedRowKeys: [],
        OldselectedRowKeys: [],
        OldselectedRows: [],
        show: nextProps.visible,
      });
    }
    if (this.props.showList !== nextProps.showList) {
      this.setState({
        showList: nextProps.showList,
      });
    }
  }
  onSave = ({ flag = false }) => {
    const selected = this.state.selectedRows.concat(this.state.OldselectedRows);
    console.log(selected);
    const mens = [];
    const ids = [];
    selected.map((ele) => {
      const obj =  { id: ele.id, name: ele.name };
      if(ids.indexOf(ele.id)==-1){
        ids.push(ele.id);
        mens.push(obj);
      }
    })
    this.props.onSave && this.props.onSave({ id: this.selectGroupId, name: this.selectName }, mens, flag)
  }

  onSearch = () => {
    if (this.k) {
      this.selectGroupId = null;
    }
    this.state.showList && this.getMember(true)
  }

  onCurrentChange = (current: number) => {
    this.setState({
      current
    }, () => {
      this.getList()
    })
  };

  render () {
    const { list, visible, selectedRowKeys, current, total, showList, show } = this.state;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
          selectedRows
        })
      },
      selectedRowKeys: selectedRowKeys
    };
    return (
      <Modal
        onCancel={this.props.onClose}
        width={showList ? 800 : 550}
        visible={visible}
        title={`组织&党员选择`}
        footer={null}
        centered
        bodyStyle={{
          height: window.innerHeight - 150,
          overflowY:'auto'
        }}
      >
        <div className="select_from_tree_container center_flex">
          <div className={showList?"select_from_tree_container_left":"select_from_tree_container_left none"}>
            { 
              show ? <LeftTree
                shouldControlUrl={false}
                onSelect={this.onSelect}
                requestUrl={'/v1/party_manager/party_list'}
              /> : null
            }

          </div>

          <div
            style={{ display: showList ? 'block' : 'none' }}
            className="select_from_tree_container_right">
            <div className='select_search_box between_flex'>
              <Input.Search
                onSearch={this.onSearch}
                onChange={e => this.k = e.target.value}
                className='level_right_search_input'
              />
              <Button
                onClick={this.onSearch}
                className='level_right_search_btn error_btn'>搜索</Button>
            </div>

            <Table
              rowSelection={rowSelection}
              rowKey='id'
              columns={columns_}
              dataSource={list}
              pagination={{ 
                current: current,
                total: total,
                onChange: this.onCurrentChange
              }}
            />
          </div>
          <div className="btn_box_bottom add_btn_box_bottom between_flex">
            <Button
              onClick={this.props.onClose}
            >取消</Button>

            {/* {
              showList && <Button
                onClick={() => this.onSave({ flag: true })}
              >保存继续</Button>
            } */}


            <Button
              onClick={this.onSave}
              className='success_btn'>保存</Button>
          </div>
        </div>
      </Modal>
    )
  }


}

export default SelectManFromTree