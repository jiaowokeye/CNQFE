/**@flow*/
import { Form } from '@ant-design/compatible';

import '@ant-design/compatible/assets/index.css';
import { Button, Input, Select } from 'antd';
import * as React from 'react';
const { Option } = Select;

class WrappedApp extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			list: props.list || [],
			btns: props.btns || null,
			renderHtml: props.renderHtml
		};
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.list !== this.props.list) {
			this.setState({
				list: nextProps.list
			})
		}
		if (nextProps.btns !== this.props.btns) {
			this.setState({
				btns: nextProps.btns
			})
		}
		if (nextProps.renderHtml !== this.props.renderHtml) {
			this.setState({
				renderHtml: nextProps.renderHtml
			})
		}
	}

	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
				this.props.onSearch && this.props.onSearch(values)
			}
		});
	};

	handleReset = () => {
		this.props.form.resetFields();
		this.props.reset&&this.props.reset();
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const { list = [], btns } = this.state;
		return (
			<Form className='forms_' layout="inline" onSubmit={this.handleSubmit}>
				<div className="left">
					{
						list.map((ele, index) => {
							return ele.input ?
								<Form.Item key={ele.key}>
									{getFieldDecorator(ele.key)(<Input placeholder={ele.placeholder} />)}
								</Form.Item> :
								ele.select ? <Form.Item style={{paddingTop:'1px'}} key={ele.key}>
									{getFieldDecorator(ele.key)(
										<Select placeholder={ele.placeholder} initialValue={ele.defaultValue}>
											{ele.options.map(item => (
												<Option key={item.value}>{item.label}</Option>
											))}
										</Select>
									)}
								</Form.Item> : ele.own ? <Form.Item key={ele.key || 'keys'}>
									{
										ele.render
									}
								</Form.Item> : null
						})
					}
					<Form.Item style={{paddingTop:'3px'}}>
						<Button onClick={this.handleReset} >
							清空条件
						</Button>
					</Form.Item>
					<Form.Item  style={{paddingTop:'3px'}}>
						<Button className='search_btn' htmlType="submit">
							搜索
					</Button>
					</Form.Item>
				</div>
				<div className="right">
					{
						btns && btns.map((ele, index) => (
							<Form.Item><Button {...ele.props} key={index}>{ele.label}</Button></Form.Item>
						))
					}
				</div>


			</Form>
		)
	}
}

const Forms = Form.create({ name: 'coordinated' })(WrappedApp);
export { Forms };
