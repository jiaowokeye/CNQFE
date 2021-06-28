import echarts from 'echarts';
import React from 'react';
import { FuncThrottle } from '../tools/tools';

const option = (data) => ({
  /* title: {
    text: '某站点用户访问来源',
    subtext: '纯属虚构',
    left: 'center'
  }, */
  color:['#5587F0','#5AD8A6','#5D7092','#ccc'],
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)'
},
series: [
    {
        name: '访问来源',
        type: 'pie',
        radius: ['30%', '45%'],
        label: {
            formatter: '{b|{b}}\n\n{c} ',
            // shadowBlur:3,
            // shadowOffsetX: 2,
            // shadowOffsetY: 2,
            // shadowColor: '#999',
            // padding: [0, 7],
            rich: {
                a: {
                    color: '#999',
                    lineHeight: 12,
                    align: 'center'
                },
                // abg: {
                //     backgroundColor: '#333',
                //     width: '100%',
                //     align: 'right',
                //     height: 22,
                //     borderRadius: [4, 4, 0, 0]
                // },
                b: {
                    fontSize: 12,
                    lineHeight: 12
                },
            }
        },
        data: data
    }
]
});

class PieChart extends React.Component {
  componentDidMount () {
    this.initEcharts(this.props);
  } 
  initEcharts(props){
    const { id = 'canvas1',data=[]} = this.props;
    const myChart = echarts.init(document.getElementById(id));
    myChart.setOption(option(data));
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
  render () {
    const { id = 'canvas1' } = this.props;
    return (
      <div id={id} className='chart_container'>
        bar
      </div>
    )
  }
}
export default PieChart
