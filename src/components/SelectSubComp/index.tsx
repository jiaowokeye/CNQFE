import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import styles from './index.less';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, Spin, Alert, message, Button, Row, Col, Table } from 'antd';
const { Search } = Input;
import { queryCompList } from '@/services/comp';
import {getAuthority} from '@/utils/authority';
import IconFont from '../Iconfont';
function Detail(props: any, ref: any) {
    const [visible, setVisible] = useState<boolean>(false);
    const [compName, setCompName] = useState('');
    const [current, setCurrent] = useState(1);
    // 总数
    const [total, setTotal] = useState(1);
    //分包列表数据
    const [listData, setListData] = useState([]);
    const [isturnkey] = useState<boolean>(getAuthority().indexOf('turnkey')===-1?false:true);
    useImperativeHandle(ref, () => ({
        init: () => {
            setVisible(true);
            getSubList();
        }
    }))
    function getSubList(page:any) {
        queryCompList({
            pageNum: page?page:current,
            rows: 10,
            compName: compName,
            projectId: props.projectId,
            isAll:  props.projectId ? '' : (isturnkey?1:''),
        }).then((res: any) => {
            const data = res.data;
            setTotal(data.total);
            setListData(data.list);
        })
    }
    function changePage(page: number, pageSize: number | undefined) {
        setCurrent(page);
        setTimeout(() => {
            getSubList(page);
        }, 200)
    }
    function select(record:any){
        props.select(record);
        setVisible(false);
    }
    const columns = [
        {
            title: isturnkey?'分包公司':'总包公司',
            dataIndex: 'compName',
            key: 'compName',
            render: (text: string, record: any, index: number) => {
              return <a onClick={()=>select(record)}>{text}</a>
            }
        },
        {
            title: '所属省市',
            dataIndex: 'compName',
            key: 'compName',
            render: (text: string, record: any, index: number) => {
              return <span>
              {record.provinceName}
              {
                record.cityName && <span>-{record.cityName}</span>
              }
              {
                record.countryName && <span>-{record.countryName}</span>
              }
            </span>
            }
        },
        {
            title: '法人代表',
            dataIndex: 'adminName',
            key: 'adminName',
        },
        {
            title: '联系电话',
            dataIndex: 'phone',
            key: 'phone',
        },
    ]
    return <Modal 
    closeIcon={<IconFont type='icon-yunzhuguanbi'/>}
        title={isturnkey?'选择分包公司':'选择总包公司'}
        visible={visible}
        width={800}
        maskClosable={false}
        onCancel={() => setVisible(false)}
        footer={
            null
        }
        bodyStyle={{padding:'0 24px'}}
    >
        <Row>
            <Col span={24}>
                {
                    !props.hideExt&&
                    <span className={styles.extWrap}>提示：如果找不到分包，请到 [分包劳务管理 - 分包名单] 中创建</span>
                
                }
            </Col>
            <Col span={16} offset={4} style={{marginTop:'20px',marginBottom:'30px'}}>
                 <Search
                    value={compName} onChange={(e) => setCompName(e.target.value)}
                    enterButton="查询"
                    onSearch={()=>{setCurrent(1);setTimeout(()=>{getSubList()},200)}}
                    size="large"
                    className='searchComponent'
                    placeholder={isturnkey?'分包公司':'总包公司'}
                />
            </Col>
            <Col span={24}>
                <Table dataSource={listData} columns={columns} pagination={{ current: current, total: total, showTotal: () => { total => `总共 ${total} 条` }, pageSize: 10, onChange: (page, pageSize) => { changePage(page, pageSize) } }} />
            </Col>
        </Row>

    </Modal>


}




// 用户详情
const SelectSubComp = forwardRef(Detail);
export { SelectSubComp };