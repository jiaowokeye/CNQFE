/**@flow*/
import * as React from 'react'

type Props = {
	children?: any,
	location?: Object,
	title?: String
}
class MyLifeCircle extends React.Component <Props, any> {

	constructor (props: Object) {
		super(props);
		this.state = {
			children: props.children,
			path: props.path,
			title: props.title,
		};
	}

	render () {
		const {children} = this.state;
		return children
	}
}

export {MyLifeCircle}