import echarts from 'echarts';
import React from 'react';
import { FuncThrottle } from '../tools/tools';

var labelOption = {
  show: true,
  position:'right',
  color:'#000',
  fontWeight :'bold'
};

const option = (type, data) => {
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
      x: [],
      y: []

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
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}'
      },
      nameTextStyle: {
        color: '#A0A4AA'
      },
      axisLine: {
        lineStyle: {
          color: '#A0A4AA',
          width: 1
        }
      },
      splitLine: {
        show: true,
        interval: 'auto',
        lineStyle: {
          color: ['#f3f5f7']
        }
      },
    },
    yAxis: {
      type: 'category',
      inverse: true,
      data: renderData['y'],
      nameTextStyle: {
        color: '#A0A4AA'
      },
      axisLine: {
        lineStyle: {
          color: '#A0A4AA',
          width: 1
        }
      },
      axisTick: false,
      splitLine: {
        show: false,
        interval: 'auto',
        lineStyle: {
          color: ['#f3f5f7']
        }
      },
      axisLabel: {
        formatter: function (value) {
          return value;
        },
        margin: 20,
        rich: {
          value: {
            lineHeight: 30,
            align: 'center'
          },
          Sunny: {
            height: 40,
            align: 'center',

          },
          Cloudy: {
            height: 40,
            align: 'center',

          },
          Showers: {
            height: 40,
            align: 'center',

          }
        }
      }
    },
    series: [
      {
        name: '人数',
        type: 'bar',
        data: renderData['x'],
        label: labelOption

      }
    ],
    grid: {
      left: '80px',
      right: '10px',
      bottom: '40px',
      top:'30px'
    },
  }
};
class BarChartHorizontal extends React.Component {
  componentDidMount() {
    this.initEcharts(this.props);
  }
  initEcharts(props) {
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
  UNSAFE_componentWillReceiveProps(nextProps) {
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
export default BarChartHorizontal
