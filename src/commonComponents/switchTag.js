import React from 'react'
import './switchTag.less'

class SwitchTag extends React.Component {
  state = {
    selectTab: this.props.list[0].key,
    list: this.props.list || []
  }
  componentDidMount(){
    if(this.props.selectTab){
      this.setState({
        selectTab:this.props.selectTab
      })
    }
  }
  switchChange (item) {
    if (this.state.selectTab !== item.key) {
      this.setState({
        selectTab: item.key
      });
      this.props.onChange && this.props.onChange(item.key);
    }
  }
  render () {
    const { selectTab, list } = this.state;
    return (
      <div className="switch_tab {{list.length>4?'flex_between':''}}">
        {
          list.map(ele => (
            <div
              key={ele.key}
              onClick={() => {
                this.switchChange(ele);
              }}
              className={selectTab === ele.key ? 'selected' : ''}>
              {ele.label}
            </div>
          ))
        }
      </div>
    )
  }
}

export default SwitchTag