import React from 'react';
import { Cascader } from 'antd';
import { MostRequest } from '@/tools/request';
class GroupPicker extends React.Component {
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
            MostRequest.Get('/v1/party_manager/party_list', {
                pid:'',
                k:''
              }).then(res => {
                resolve(res.data)
              }).catch(() => {
                resolve(null)
              })
          })
    }
    onChange = (value, selectedOptions) => {
        console.log(value, selectedOptions);
        this.props.callback&&this.props.callback(value, selectedOptions);
    };

    loadData = selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        const data = targetOption.child;
        data.map((e,i)=>{
            data[i].isLeaf=false;
        })
        
        targetOption.children = data;
        this.setState({
            options: [...this.state.options],
        });
    };
    render() {
        return <Cascader
            options={this.state.options}
            onChange={this.onChange}
            value={this.props.value?this.props.value:[]}
            placeholder="请选择组织"
            filedNames={{
                label: 'name', value: 'id', children: 'childs'
            }}
        />
    }
}

export default GroupPicker;