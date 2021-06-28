import React, { Component } from 'react'
import { Input, Select, DatePicker } from 'antd'
import './rightForm.less';
const { Option } = Select


/* 

  area  textArea
  label === 显示名称
  time 
  require  === 是否必填
  placerholder  === placerholder
  options === 多选框
  renderHtml === 自定义
*/
class VerticalForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: this.props.label,
      require: this.props.require,
      placerholder: this.props.placerholder || '请输入',
      options: this.props.options || null,
      area: this.props.area,
      time: this.props.time,
      renderHtml: props.renderHtml || null,
      value: props.value || '',
      controlValue: props.controlValue || false,
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.value !== prevState.value && prevState.controlValue) {
      return {
        value: nextProps.value
      }
    }
    if (nextProps.options !== prevState.options) {
      return {
        options: nextProps.options
      }
    }
     if (nextProps.renderHtml !== prevState.renderHtml) {
      return {
        renderHtml: nextProps.renderHtml
      }
    }
    return null
  }

  onChange = (e, dateString) => {
    this.setState({
      value: this.state.time ? dateString : e.target.value
    })
    this.props.onChange && this.props.onChange(this.state.time ? dateString : e.target.value)
  }

  onSelectChange = value => {
    this.setState({
      value: value
    })
    this.props.onChange && this.props.onChange(value)
  }
  render () {
    const {
      label,
      placerholder,
      options,
      require,
      area,
      renderHtml,
      value,
      time
    } = this.state;
    return (
      <div className="vertical_form">
        <div className='vertical_form_label'>
          {label}
          {
            require && <span className='require_ theme_color'>*</span>
          }
        </div>
        {
          renderHtml ?
            renderHtml() :
            options ?
              <Select
                {...this.props._props}
                value={value}
                placeholder={placerholder}
                onChange={this.onSelectChange}>
                {
                  options.map(ele => (
                    <Option key={ele.value}>{ele.label}</Option>
                  ))
                }
              </Select> :
              area ? <Input.TextArea
                {...this.props._props}
                onChange={this.onChange}
                placeholder={placerholder}
                value={value} />
                : time ? <DatePicker
                  {...this.props._props}
                  placeholder={placerholder}
                  onChange={this.onChange}
                />
                  : <Input
                    {...this.props._props}
                    value={value} onChange={this.onChange} placeholder={placerholder} />
        }

      </div >
    )
  }
}

export default VerticalForm