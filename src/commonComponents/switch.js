import React from 'react'
import './switch.less';

class Switch extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: props.selected || false
    }
  }

  switchChange = () => {
    this.setState({
      selected: !this.state.selected
    }, () => {
      this.props.onSwitchChange && this.props.onSwitchChange(this.state.selected);
    })
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.selected !== nextProps.selected) {
      this.setState({
        selected: nextProps.selected
      })
    }
  }

  render () {
    const { selected } = this.state;
    return (
      <div
        onClick={this.switchChange}
        className={`switch_container ${selected ? 'selected' : ''}`}>
        <div className="switch_box" />
      </div>
    )
  }
}
export default Switch