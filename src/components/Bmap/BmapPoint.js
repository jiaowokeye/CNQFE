/**
 * Created by XM on 2018/9/3.
 * @email xm@tqzgc.com
 */
import React, { Component } from 'react';
import { Input, Button } from 'antd';
import pointIcon from './point.png'
/*
const locationIcon = {
  url: 'http://api0.map.bdimg.com/images/copyright_logo.png',
  size: { width: 100, height: 100 },
};
*/

export default class extends Component {
  constructor(props) {
    super(props);
    this.state={
      point:{
        lng:'',
        lat:''
      }
    }
    this.setMapRef = ref => {
      this.mapContainer = ref;
    };
  }
  componentDidMount() {
    this.createMapScript().then(this.initMap);
  }
  addPoint(point){
    if(!this.mapLoaded){
      setTimeout(()=>{
        this.addPoint(point);
      },500)
      return;
    }else{
      
    }
    this.map.panTo(new global.BMap.Point(point.lng, point.lat));
    if (this.marker) {
      this.marker.setPosition(point);
      this.map.removeOverlay(this.marker);
    } else {
      
    }
    let myIcon = new BMap.Icon(pointIcon, new BMap.Size(54,54),{
        
    });
    this.marker = new global.BMap.Marker(point,{icon:myIcon});
    this.map.addOverlay(this.marker);
    const myGeo = new global.BMap.Geocoder();
    try {
      this.props.setPoint({
        lng:point.lng,
        lat:point.lat
      })
    } catch (error) {
      
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.inited) return;
    if (!this.mapLoaded) return;
    // console.log(nextProps.value, this.props.value)
    const {address,position} = nextProps;
    if(position){
      const point  = position;
      this.addPoint(point);
    }
    
    this.setState({
      point:position,
      address:address
    },()=>{
     
    })
  }

  shouldComponentUpdate() {
    return !this.inited;
  }

  componentWillUnmount() {
    if (this.map) {
      this.map.removeEventListener('click', this.onMapClick);
      this.map = null;
    }
  }
  

  initMap = BMap => {
    // this.defaultCenter = getPoint(116.404, 39.915);
    // this.mapContainer = this.mapContainer || this.mapContainerRef.current;
    const { position } = this.props;

    // console.log(this.props)

    const map = new BMap.Map(this.mapContainer, { enableMapClick: false });
    if (Object.keys(map).length === 0) return;
    // map.enableScrollWheelZoom();
    const point = new BMap.Point(
      (position && position.lng) || 116.404,
      (position && position.lat) || 39.915
    );
    // console.log(point)
    map.centerAndZoom(point, 15);
    map.setDefaultCursor('pointer');

    // map.addControl(new BMap.NavigationControl({type: global.BMAP_NAVIGATION_CONTROL_ZOOM}));

    // console.log(value);

    // map.addEventListener('tilesloaded', ()=>{
    // });
    if (position && position.lng && position.lat) {
      
      let myIcon = new BMap.Icon(pointIcon, new BMap.Size(54,54),{
        
      });
      this.marker = new BMap.Marker(point,{icon:myIcon});
      map.addOverlay(this.marker);
    } else {
      const myCity = new BMap.LocalCity();
      myCity.get(result => {
        // console.log(result)
        map.setCenter(result.name);
      });
    }
    map.addEventListener('click', this.onMapClick);
    this.map = map;
    this.mapLoaded = true;
  };

  createMapScript = () => {
    const ak = 'lm0KtwxxpIeKiFoftA4iVZhljciMmhUO';

    window.BMap = window.BMap || {};
    if (Object.keys(window.BMap).length === 0) {
      window.BMap.b_preload = new Promise(resolve => {
        const $script = document.createElement('script');
        document.body.appendChild($script);
        window.b_initBMap = () => {
          resolve(window.BMap);
          document.body.removeChild($script);
          window.BMap.b_preload = null;
          window.b_initBMap = null;
        };

        $script.src = `https://api.map.baidu.com/api?v=3.0&ak=${ak}&callback=b_initBMap`;
      });
      return window.BMap.b_preload;
    }

    if (!window.BMap.b_preload) {
      return Promise.resolve(window.BMap);
    }
    return window.BMap.b_preload;
  };

  render() {
    const { width = '100%', height = 400, style } = this.props;

    return (
      <div style={{ border: 'solid 1px #e1e1e1', marginBottom: 16, borderRadius: 5 }}>
        <div ref={this.setMapRef} style={{ width, height, ...style }} />
      </div>
    );
  }
}


