import { Button, Drawer, Modal } from 'antd';
import React from 'react';
import Sortable from 'sortablejs';
import PreImage from '@com/preImage';
import Switch from '@com/switch';
import Title from '@com/title';
import UploadS from '@com/upload';
import VerticalForm from '@com/verticalForm';
import { MostRequest } from '@/tools/request';
import BannerCard from './bannerCard';
import './index.less';
import { SaveBanner, UpdateBanner } from './request';
import { OfflineSource, DeleteSource } from '@/tools/tools';

const { confirm } = Modal;

class HomeBanner extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      visible: false,
      title: '',
      url: null,
      is_online: false,
      link: null,
    }
  }

  componentDidMount () {
    this.sortable = Sortable.create(this.el, {
      animation: 150,
      onEnd: evt => {
        this.sortData(evt.oldIndex, evt.newIndex)
      },
    });
    this.getBannerList();
  }
  sortData = (oldIndex, newIndex) => {
    let { data } = this.state;
    const moveItem = data.splice(oldIndex, 1);
    data.splice(newIndex, 0, moveItem[0]);
    this.setState({ data });
  }

  onSearch = () => {
    this.getBannerList();
  }

  getBannerList () {
    MostRequest.Get('/v1/banner/list').then(res => {
      if (res && res.data) {
        this.setState({
          data: res.data
        })
      }
    })
  }

  addBanner = () => {
    this.setState({
      visible: true
    })
  }

  onTitleChange = (title) => {
    this.setState({
      title
    })
  }
  onUrlChange = (link) => {
    this.setState({
      link
    })
  }

  onSwitchChange = (is_online) => {
    this.setState({
      is_online
    })
  }
  RenderDrawer = () => (
    <Modal 
      width={650}
      title="banner"
      placement="right"
      closable={true}
      onCancel={this.onClose}
      visible={this.state.visible}
      footer={null}
      centered
      bodyStyle={{
        height: 450,
        overflowY: 'auto'
      }}
    >
      <div>
        <VerticalForm
          label='标题'
          area
          value={this.state.title}
          controlValue
          onChange={this.onTitleChange}
        />
        <VerticalForm
          label='链接'
          area
          value={this.state.link}
          controlValue
          onChange={this.onUrlChange}
        />
        <VerticalForm
          label='上传'
          renderHtml={() => (
            <UploadS
              onUploadSuccess={url => {
                this.setState({
                  url: url
                })
              }}
              renderHtml={
                this.state.url ? <PreImage url={this.state.url} /> : null
              }
            />
          )}
        />
        <VerticalForm
          label='是否上架'
          renderHtml={() => (
            <Switch
              selected={this.state.is_online}
              onSwitchChange={this.onSwitchChange}
            />
          )}
        />
      </div>

      <div className="btn_box_bottom between_flex">
        <Button
          onClick={this.saveBanner}
          className='success_btn'>保存</Button>
      </div>
    </Modal>
  )

  saveBanner = () => {
    if (this._bannerId) {
      this._updateBanner()
    } else {
      this._saveBanner()
    }
  }

  _saveBanner () {
    const { title, url, is_online, link } = this.state;
    SaveBanner({
      title, url, is_online, link
    }).then(res => {
      if (res.code === 0) {
        this.onClose(true)
      }
    }).catch(e => {
      console.log(e);
    })
  }

  _updateBanner () {
    const { title, url, is_online, link } = this.state;
    UpdateBanner({
      title, url, is_online, id: this._bannerId, link
    }).then(res => {
      if (res.code === 0) {
        this.onClose(true)
      }
    }).catch(e => {
      console.log(e);
    })
  }

  onDeleteClick = (data) => {
    confirm({
      title: '是否确定删除此banner位?',
      content: '',
      onOk: () => {
        DeleteSource('banner', [data.id]).then(res => {
          this.getBannerList();
        }).catch(e => {

        })
      }
    });
  }

  onEditClick = (data) => {
    this._bannerId = data.id;
    this.setState({
      title: data.title,
      url: data.url,
      link: data.link,
      is_online: data.is_online,
      visible: true
    })
  }

  onlineClick = (id, is_online) => {
    confirm({
      title: `是否确定${is_online ? '上线' : '下线'}此banner位?`,
      content: '',
      onOk: () => {
        OfflineSource('banner', [id], is_online).then(res => {
          this.getBannerList()
        }).catch(e => {

        })
      }
    });
  }

  onClose = (flag) => {
    this.setState({
      visible: false,
      title: '',
      url: null,
      is_online: false
    }, () => {
      if (flag) {
        this.getBannerList();
      }
    })
  }

  render () {
    const { data } = this.state;
    return (
      <div className='home_banner'>
        <Title
          title='首页banner'
          renderRight={() => (
            <>
              <Button
                onClick={this.addBanner}
                className='success_btn'>添加</Button>
            </>
          )} />

        <div ref={el => this.el = el} className="banner_list">
          {
            data.map(ele => (
              <BannerCard
                onDeleteClick={this.onDeleteClick}
                onEditClick={this.onEditClick}
                onlineClick={this.onlineClick}
                data={ele}
                key={ele.id} />
            ))
          }
        </div>
        <this.RenderDrawer />
      </div>
    )
  }
}

export default HomeBanner