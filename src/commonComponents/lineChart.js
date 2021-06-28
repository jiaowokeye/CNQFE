import echarts from 'echarts';
import React from 'react';
import { FuncThrottle } from '../tools/tools';

var labelOption = {
  show: false,
  position:'top',
  color:'#000',
  fontWeight :'bold'
};
var areaStyle = {
  color: {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [{
        offset: 0, color: '#9fcaf3' // 0% 处的颜色
    }, {
        offset: 1, color: 'white' // 100% 处的颜色
    }],
    global: false // 缺省为 false
  }
}
const option = (type,data,smooth,series) => {
  let renderData = {
    x: [],
  }
  series.map((el,il)=>{
    renderData['y'+il] = [];
    return '';
  })
  if (data && data.length > 0) {
    data.map((e, i) => {
      renderData['x'].push(e.x);
      for(let il=0;il<series.length;il++){
        renderData['y'+il].push(e['y'+il]);
      }
      return '';
    })
  } else {
    renderData = {
      x:[],
      y:[]
    }
  }
  let seriesArr = [];
  series.map((e,i)=>{
    seriesArr.push({
      name: e.name,
      type: type,
      barGap: 0,
      smooth: smooth,
      label: labelOption,
      data: renderData['y'+i],
      itemStyle: {
        normal: {
          //柱形图圆角，初始化效果
          barBorderRadius: 4
        },
        emphasis: {
          barBorderRadius: 4
        },
      },
      areaStyle: smooth?areaStyle:{
        opacity:0
      },
      symbol: 'none',
    });
    return '';
  })
  console.log(seriesArr);
  console.log(renderData);
  return {
    color: ['#5B8FF9', '#5AD8A6', '#5D7092'],
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
            color:'#979797',
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
    // grid: {
    //   y2: 24,
    //   height: "70%"// 高度
    // },
    grid: {
      left: '50px',
      right: '0',
      bottom: '40px',
      top:'10px'
    },
    series: seriesArr
  }};
  class LineChart extends React.Component {
    componentDidMount() {
      this.initEcharts(this.props);
    }
    initEcharts(props){
      const { id = 'canvas1', type = 'line', data = [],smooth=true,series=[] } = props;
      const myChart = echarts.init(document.getElementById(id));


      myChart.setOption(option(type, data,smooth,series));
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
          line
        </div>
      )
    }
  }
  export default LineChart
