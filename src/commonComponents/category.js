import VerticalForm from '@com/verticalForm';
import { Button, Drawer, Table, Tooltip,Modal } from 'antd';
import React from 'react';
import { MostRequest } from '@/tools/request';
let container;
const typeColumns = [
  {
    title: '分类名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '',
    dataIndex: 'k',
    key: 'k',
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span className='table_control'>
        <span onClick={() => { container.editAddType(record) }} className='link'>编辑</span>
        <span onClick={() => { container.deleteCategory(record.id) }} className='delete'>删除</span>
      </span>
    ),
  },
]
class Category extends React.Component {
  state = {
    categoryId: null,
    categoryData: [],
    addCategoryValue: '',
    type: this.props.type || 9,
    visible: this.props.visible
  }
  componentDidMount () {
    container = this;
    this.getCategory()
  }

  onAddCategoryChange = (value) => {
    this.setState({
      addCategoryValue: value
    })
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.visible !== prevState.visible) {
      return {
        categoryId: null,
        visible: nextProps.visible,
        addCategoryValue: ''
      }
    }
    return null
  }

  getCategory () {
    MostRequest.Get(`/v1/category?type=${this.state.type}`).then(res => {
      this.setState({
        categoryId: null,
        categoryData: res.data || []
      });
      this.props.setCategory && this.props.setCategory(res.data)
    }).catch(e => {

    })
  }

  editAddType = (record) => {
    this.setState({
      categoryId: record.id,
      addCategoryValue: record.name
    });
    this.editValue = record.name;
  }

  addCategory = () => {
    const { addCategoryValue, categoryId, type } = this.state;
    const params = {
      name: addCategoryValue,
      type: Number(type)
    }
    if (params.name) {
      if (categoryId) {
        params.id = categoryId;
      }
      MostRequest.Post(`/v1/category`, params).then(res => {
        this.getCategory()
      }).catch(e => {
      })
    }
  }

  deleteCategory = (id) => {
    MostRequest.Delete('/v1/category', {
      ids: [id]
    }).then(res => {
      this.getCategory()
    }).catch(e => {
    })
  }

  render () {
    return (
      <Modal
        width={650}
        title={this.state.categoryId ? '编辑分类' : '新增分类'}
        placement="right"
        closable={true}
        onCancel={this.props.onClose}
        visible={this.state.visible}
        footer={
          <Button onClick={this.props.onClose}>关闭</Button>
        }
        centered
        bodyStyle={{
            maxHeight: window.innerHeight - 250,
            overflowY: 'auto',
          }}
      >
        <div>
          <Tooltip visible={!!this.state.categoryId} placement="bottomLeft" title={'您正在编辑分类:' + this.editValue}>
            <VerticalForm
              label={'分类名称'}
              onChange={this.onAddCategoryChange}
              value={this.state.addCategoryValue}
              controlValue
            />
          </Tooltip>

          <Button
            style={this.state.categoryId ? { marginTop: 30 } : {}}
            onClick={this.addCategory} className='error_btn'>添加</Button>
          <div className="line" />
          <Table
            rowKey='id'
            dataSource={this.state.categoryData} columns={typeColumns} />
        </div>
      </Modal>
    )
  }
}

export default Category