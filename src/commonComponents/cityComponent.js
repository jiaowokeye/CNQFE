import React from 'react';
import { Cascader } from 'antd';
import { MostRequest } from '@/tools/request';
class CityPicker extends React.Component {
    state = {
        options:[],
    };
    componentDidMount(){
        this.getData().then((res)=>{
            console.log(res);
            const data = res;
            data.map((e,i)=>{
                data[i].isLeaf=false;
            })
            this.setState({
                options:res
            })
        });
    }
    getData(p_code){
        return new Promise(resolve => {
            MostRequest.Get('/v1/city/by_pcode', {
                p_code
              }).then(res => {
                resolve(res.data)
              }).catch(() => {
                resolve(null)
              })
          })
    }
    onChange = (value, selectedOptions) => {
        this.props.onChange&&this.props.onChange(value, selectedOptions)
    };

    loadData = selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        this.getData(targetOption.code).then((res)=>{
            targetOption.loading = false;
            const data = res;
            if(targetOption.level!==1){
                data.map((e,i)=>{
                    data[i].isLeaf=false;
                })
            }
            
            targetOption.children = data;
            this.setState({
                options: [...this.state.options],
            });
        })
    };
    render() {
        return <Cascader
            options={this.state.options}
            loadData={this.loadData}
            onChange={this.onChange}
            value = {this.props.value}
            fieldNames={{
                label: 'name', value: 'code', children: 'children'
            }}
        />
    }
}

export default CityPicker;