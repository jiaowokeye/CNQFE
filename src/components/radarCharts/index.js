import echarts from 'echarts';
import React from 'react';

var labelOption = {
  show: true,
  position:'top',
  color:'#000',
  fontWeight :'bold'
};

const option = (type,data) => {
const {indicator,renderApp,avgApp} = data;
  return  {
    color: ['#465FFD','#F05757'],
    title: {
      text: '测试结果'
    },
    grid:{
      y:'10%'
    },
    tooltip: {
      show:false
    },
    legend: {
      data: ['得分', '平均分'],
      right:15,
      top:5,
      itemWidth:12,
      itemHeight:12
    },
    radar: {
      // shape: 'circle',
      center: ['50%', '55%'],
      radius: 80,
      name: {
        textStyle: {
          color: '#465FFD',
          backgroundColor: '#fff',
          borderRadius: 3,
          fontWeight:'bold',
          padding: [3, 5],
          textAlign:'center',
        },
        formatter: function (value, indicator) {
          // 每隔4个字符加空格间隔
          function replaceStr(str) {
            return str.replace(/(.{4})/g,'$1\n');
          }
          return replaceStr(value)
        },
      },
      
      indicator: indicator
    },
    series: [{
      type: 'radar',
      // areaStyle: {normal: {}},
      
      data: [
        {
          value: renderApp,
          name:'得分',
          label: {
            show: true,
            formatter: function(params) {
                return params.value;
            }
          },
          areaStyle: {
            opacity: 0.1,
            color: "#465FFD"
          }
        },
        {
          value:avgApp,
          name:'平均分',
          areaStyle: {
            opacity: 0.1,
            color: "#F05757"
          }
        }
      ]
    }]
  };
  };
  class RadarChart extends React.Component {
    componentDidMount() {
      this.initEcharts(this.props);
    }
    initEcharts(props){
      const { id = 'canvas1', type = 'bar', data = [] } = props;
      const myChart = echarts.init(document.getElementById(id));


      myChart.setOption(option(type, data));
      const oldFunc = window.onresize;
      const fn = FuncThrottle(() => {
        myChart.resize();
        oldFunc && oldFunc();
      }, 300);
      window.onresize = fn;
    }
    UNSAFE_componentWillReceiveProps(nextProps){
      this.initEcharts(nextProps)
    }
    render() {
      const { id = 'canvas1' } = this.props;
      return (
        <div id={id} style={{height:'300px'}} className='chart_container'>
          bar
        </div>
      )
    }
  }
  export default RadarChart















const FuncThrottle = function (fn, time) {
    let timer;
    return function () {
      if (!timer) {
        timer = setTimeout(() => {
          fn();
          clearTimeout(timer);
          timer = null;
        }, time)
      }
    }
  }