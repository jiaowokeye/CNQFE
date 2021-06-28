/*@flow*/
import React, { Component } from 'react'
import { MyLifeCircle } from "./myRoute";

export function asyncComponent (importComponent: any, params: Object = {}) {
	class AsyncComponent extends Component<any, any> {
		constructor(props: Object) {
			super(props);
			this.state = {
				component: null,
				visible: true
			}
		}

		async componentDidMount () {
			const { default: component } = await importComponent();
			this.setState({
				component: component
			});
		}

		render () {
			const C = this.state.component;
			return C ? <MyLifeCircle><C {...this.props} /></MyLifeCircle> : null
		}
	}

	return AsyncComponent
}