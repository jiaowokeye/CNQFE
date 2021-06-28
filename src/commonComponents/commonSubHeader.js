import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'; 
import { setNavigation } from '../components/newPartyBuilding/partyBuilding/focusNews/action';
import './commonSubHeader.less'; 
import { GetUrlParams } from '../tools/tools';
class CommonSubHeader extends Component {
  constructor(props) {
    super(props);
    const params = GetUrlParams();
    this.state = {
      pathname: props.location.pathname,
      menuLists: props.menuLists,
      tag_id: params.tag_id,
      sub_tag_id: params.sub_tag_id,
    }
  }

  initParams = () => {
    const params = GetUrlParams();
    this.setState({
      tag_id: params.tag_id,
      sub_tag_id: params.sub_tag_id,
    })
  }

  componentDidMount () {
    this.initParams();
    this.initNavigation();
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.setState({
        pathname: nextProps.location.pathname
      });
      this.initParams()
    }
    if (this.props.menuLists !== nextProps.menuLists) {
      this.setState({
        menuLists: nextProps.menuLists
      });
      this.initNavigation(nextProps.menuLists)
    }
  }

  initNavigation (list = this.state.menuLists) {
    const navigation = list.filter(ele => ele.tag_id === this.state.tag_id);
    if (navigation.length > 0 && navigation[0].children) {
      this.props.setNavigation(navigation[0].children);
    }
  }

  jumpDocument (url, navigation) {
    this.props.history.push(url);

    if (navigation) {
      this.props.setNavigation(navigation);
    }
  }

  render () {
    const { pathname, menuLists, tag_id } = this.state;
    return (
      <div className="common_sub_header">
        <div className="W1220">
          <div className="common_sub_header_title">
            新时代党建
          </div>
          <div className="common_sub_header_list">
            {
              menuLists.map((ele, index) => (
                <span
                  onClick={() => {
                    this.jumpDocument(
                      ele.type ? `/newPartyBuild/*/partyBuildChildPage?tag_id=${ele.tag_id}&sub_tag_id=${ele.children[0].tag_id}`.replace('/*', ele.path)
                        :
                        ele.path,
                      ele.children)
                  }}
                  className={(ele.tag_id === tag_id || pathname === ele.path) ? 'selected link_a' : 'link_a'}
                  key={index}>
                  {ele.title}
                </span>
              ))
            }
          </div>
        </div>
      </div>
    )
  }
}
function mapState (state) {
  return {
    menuLists: state.menuLists,
  }
}
export default withRouter(connect(mapState, { setNavigation })(CommonSubHeader))