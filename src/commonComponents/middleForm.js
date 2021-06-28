import React from 'react'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Select, DatePicker, Radio, InputNumber } from 'antd';
import moment from 'moment';
import { FormatDateStr } from '../tools/tools';

const { Option } = Select;


/* 
  require : 是否必填
  label ： title
  key: 返回的结果字段名
  message:必穿提示
  type: 是Input还是 Select还是 TimeChange
  placeholder: Input提示
  renderHtml:  渲染自己想要替换的组件
  otherBtn : 在组件右边多一个按钮
{
  require:false (选填 默认为false),
  label:'',
  key:'',
  message:'',
  type:'input | select | time | radio | rangeTime | number',
  mode: year | month
  placeholder:'',
  hideTime : 隐藏时分秒选择
  options:[
    {
      label:'',
      value:''
    }
  ]

}


时间处理 因为不知道时间字段  所以时间统一在使用时处理
.format('YYYY-MM-DD HH:mm:ss')

*/

class MiddleForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      label: props.label || '无label',
      key_: props.key_ || '无key',
      require: props.require || false,
      mode: props.mode || '',
      message: props.message || `${props.label}不能为空`,
      type: props.type || 'input',
      placeholder: props.placeholder || '',
      options: props.options || [],
      className: props.className || '',
      renderHtml: props.renderHtml || null,
      otherBtn: props.otherBtn || null,
      formate: props.formate || null,
      nowDay: moment(FormatDateStr(Date.now()), 'YYYY-MM-DD'),
      hideTime: props.hideTime || false
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.renderHtml !== nextProps.renderHtml) {
      this.setState({
        renderHtml: nextProps.renderHtml
      })
    }
    if (this.props.options !== nextProps.options) {
      this.setState({
        options: nextProps.options
      })
    }
  }

  render () {
    const { getFieldDecorator ,labelCol,wrapperCol,disabled=false} = this.props;
    const {
      label, key_, require,
      message, type, placeholder,
      options,
      className,
      renderHtml,
      nowDay,
      otherBtn,
      mode,
      hideTime,
      formate
    } = this.state;
    return (
      <Form.Item
        className={className}
        {
          ...this.props
        }
        label={label}>
        {
          renderHtml ? renderHtml() :
            getFieldDecorator(key_, {
              rules: [{ required: require, message }],
              initialValue: type === 'time' ? nowDay : ''
            })(
              type === 'select' ?
                <Select disabled={disabled}>
                  {
                    options.map(ele => (
                      <Option key={ele.value}>{ele.label}</Option>
                    ))
                  }
                </Select>
                : type === 'radio' ?
                  <Radio.Group options={options} disabled={disabled}/>
                  : type === 'time' ?
                    <DatePicker
                      format={mode === 'year' ? 'YYYY' : hideTime ? 'YYYY-MM-DD' : formate ? formate : 'YYYY-MM-DD  HH:mm:ss'}
                      showTime={!hideTime}
                      // mode={'date'}
                      disabled={disabled}
                    />
                    : type === 'rangeTime' ?
                      <DatePicker.RangePicker disabled={disabled}/>
                      : type === 'area' ?
                        <Input.TextArea
                          placeholder={placeholder}
                          disabled={disabled}
                        />
                        : type === 'number' ?
                          <InputNumber
                            disabled={disabled}
                            placeholder={placeholder}
                          />
                          : <Input
                            disabled={disabled}
                            placeholder={placeholder}
                          />
            )}
        {
          otherBtn && <div className='other_btn center_flex'>
            {otherBtn()}
          </div>
        }
      </Form.Item>
    )
  }

}


export default MiddleForm