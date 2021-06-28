import React from 'react';
import { Modal, message } from 'antd';
class TakePhotoModal extends React.Component {
    state = {
        visible: false,
        imgUrl: ''
    };
    handleOk = () => {
        const { imgUrl } = this.state;
        if (imgUrl) {
            this.props.callBack(imgUrl);
            this.Cancel()
        } else {
            message.error('请先拍照');
        }
    }
    takePhoto = () => {
        let canvas = this.refs.canvas;
        let context = canvas.getContext('2d');
        context.drawImage(this.refs.video, 0, 0, 960, 960);
        var baseStr = canvas.toDataURL("image/jpeg");
        console.log(baseStr);
        this.setState({
            imgUrl: baseStr
        })
    }
    //访问用户媒体设备的兼容方法
    getUserMedia = (constraints, success, error) => {
        if (navigator.mediaDevices.getUserMedia) {
            //最新的标准API
            navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
        } else if (navigator.webkitGetUserMedia) {
            //webkit核心浏览器
            navigator.webkitGetUserMedia(constraints, success, error)
        } else if (navigator.mozGetUserMedia) {
            //firfox浏览器
            navigator.mozGetUserMedia(constraints, success, error);
        } else if (navigator.getUserMedia) {
            //旧版API
            navigator.getUserMedia(constraints, success, error);
        }
    }

    success = (stream) => {
        //兼容webkit核心浏览器
        // let CompatibleURL = window.URL || window.webkitURL;
        //将视频流设置为video元素的源
        // console.log(stream);
        //video.src = CompatibleURL.createObjectURL(stream);
        this.refs.video.srcObject = stream;
        this.refs.video.play();
    }

    error = (error) => {
        console.log(`访问用户媒体设备失败${error.name}, ${error.message}`);
    }
    componentDidMount() {

    }
    componentWillMount(){
        // this.Cancel();
    }
    Cancel = ()=>{
        this.setState({
            visible:false
        })
        let tracks = this.refs.video.srcObject.getTracks();
        tracks.map((e)=>{
            e.stop();
            return '';
        })
    }
    init = () => {
        this.setState({
            visible: true,
            imgUrl:''
        })
        if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
            //调用用户媒体设备, 访问摄像头
            this.getUserMedia({ video: { width: 480, height: 480 } }, this.success, this.error);
        } else {
            alert('不支持访问用户媒体');
        }
    }
    render() {
        const { visible, imgUrl } = this.state;
        return <Modal
            title={'拍照'}
            visible={visible}
            onOk={this.handleOk.bind(this)}
            width={550}
            onCancel={()=>this.Cancel()}
            centered={true}
            destroyOnClose={true}
            // footer={<div className='title_right'>
            //     <div className="sendMessageBtn">
            //         <div className="col_line" />
            //         <a className="ermaiButton" onClick={()=>this.Cancel()}> 取消 </a>
            //         <div className="col_line" />
            //         <a className="ermaiButton" onClick={() => this.handleOk()}> 确定 </a>
            //         <div className="col_line" />
            //     </div>
            // </div>
            // }
        >
            <video id="video" ref="video" width="480" height="480" style={imgUrl ? { display: 'none' } : {}}>
            </video>
            <img src={imgUrl} width="480" height="480" alt="头像" style={imgUrl ? { display: 'block',marginBottom:'6px' } : { display: 'none' }} />
            <div>
                <a className="ermaiButton" style={imgUrl ? { display: 'inline-block' } : { display: 'none' }} onClick={() => this.setState({
                    imgUrl: ''
                })}> 放弃 </a>
                <a className="ermaiButton" style={imgUrl ? { display: 'none' } : { display: 'inline-block' }} onClick={() => this.takePhoto()}> 拍照 </a>
            </div>
            <canvas id="canvas" ref="canvas" width="960" height="960" style={{ display: 'none' }}></canvas>
        </Modal>
    }
}




export default TakePhotoModal;