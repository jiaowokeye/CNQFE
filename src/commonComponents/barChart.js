import echarts from 'echarts';
import React from 'react';
import { FuncThrottle } from '../tools/tools';

var labelOption = {
  show: true,
  position:'top',
  color:'#000',
  fontWeight :'bold'
};

const option = (type,data) => {
  let renderData = {
    x: [],
    y: [],
  }
  if (data && data.length > 0) {
    data.map((e, i) => {
      renderData['x'].push(e.x);
      renderData['y'].push(e.y);
      return '';
    })
  } else {
    renderData = {
      x:[],
      y:[]

    }
  }
  return {
    color: ['#5587F0', '#33FFFC', '#FF3B54'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
    },
    // legend: {
    //   data: ['Forest', 'Steppe', 'Desert']
    // },
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      // feature: {
      //   mark: { show: true },
      //   dataView: { show: true, readOnly: false },
      //   magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
      //   restore: { show: true },
      //   saveAsImage: { show: true }
      // }
    },
    xAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: renderData['x'],
        nameTextStyle:{
          color:'#A0A4AA'
        },
        axisLine:{
          lineStyle:{
            color:'#A0A4AA',
            width:1
          }
        },
        
      }
    ], 
    yAxis: [
      {
        type: 'value',
        nameTextStyle:{
          color:'#A0A4AA'
        },
        axisLine:{
          lineStyle:{
            color:'#A0A4AA',
            width:0
          }
        },
        axisTick:false,
        splitLine:{
          show: true,
          interval: 'auto',
          lineStyle: {
            color: ['#f3f5f7']
          }
        }
      }
    ],
    grid: { 
      left: '30px',
      right: '0',
      bottom: '40px',
      top:'30px'
    },
    series: [
      {
        name: '总人数',
        type: type,
        barGap: 0,
        smooth: true,
        label: labelOption,
        data: renderData['y'],
        barWidth:30,
        itemStyle: {
          normal: {
            //柱形图圆角，初始化效果
            barBorderRadius: 4
          },
          emphasis: {
            barBorderRadius: 4
          },
        },
        areaStyle: {}
      }
    ]
  }};
  class BarChart extends React.Component {
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
        <div id={id} className='chart_container'>
          bar
        </div>
      )
    }
  }
  export default BarChart
