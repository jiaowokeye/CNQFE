// 人脸名单 Face list
import React, { useState, useEffect,useImperativeHandle, forwardRef } from 'react';
import GroupUserTree from '@/components/GroupUserTree/index'
import {memberRequest } from '@/services/sys';
import BodCard from '@/components/BotCard/botCard';
import {Modal,Table} from 'antd';

function ChooseUserCom(props,ref) {
    //// memberRequest,memberAddRequest,memberUpdateRequest,memberDeleteRequest;
    const [groupId, setGroupId] = useState('');
    const [groupName, setGroupName] = useState('全部');
    const [visible, setVisible] = useState(false);
    const [userList, setUserList] = useState([]);
    useImperativeHandle(ref, () => ({
        init: () => {
            setVisible(true);
        }
    }))
    useEffect(() => {
        getUserList();
    }, [groupId])
    function handleOk(){}
    function onSelect(key, name) {
        console.log(key, name);
        setGroupId(key[0]);
        setGroupName(name);
    }
    function getUserList() {
        memberRequest({
            groups: groupId ? [groupId] : [],
            include_child: true
        }).then((res) => {
            setUserList(res.data ? res.data : []);
        })
    }
    const columns = [{
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        width: '15%',
        render: (text, record, index) => {
            return <span> {index + 1} </span>
        }
    },
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '操作',
        dataIndex: 'name',
        key: 'name',
        width:'15%',
        render:(text,record)=>{
            return <div><a onClick={()=>{
                props.Select(record)
                setVisible(false);
            }}>选择</a></div>
        }
    }]

    return <Modal
        title={'选择人员'}
        visible={visible}
        onOk={handleOk}
        width={850}
        onCancel={() => setVisible(false)}
        closable={false}
        centered={true}
        className="chooseUserWrap"
        bodyStyle={{
            height:'600px',
            overflow:'auto'
        }}
    >
        <div className="facelist_wrap">
            <div className="face_list_group">
                <BodCard title="部门" className="">
                    <div className="bot_card_content face_list_content">
                        <GroupUserTree canoperating={false} onSelect={onSelect} />
                    </div>
                </BodCard>
            </div>
            <div className="face_list_bodcard">
                <BodCard
                    title={<div className="face_list_title"><span className="active">{groupName}</span></div>}
                    className=""
                >
                    <div className="bot_card_content face_list_content">
                        <div className="data_search_cond_wrap">
                            <Table dataSource={userList}
                                columns={columns}
                                pagination={false}
                                className="border_table"
                            />
                        </div>
                        <div className='early_warning_button early_warning_button_left'>
                            {/* <div className="sendMessageBtn">
                            <Pagination
                                total={85}
                                showSizeChanger
                                showQuickJumper
                                showTotal={total => `共 ${total} 条数据`}
                                itemRender={itemRender}
                                style={{ marginTop: '.1rem' }}
                            />
                        </div> */}
                        </div>
                    </div>
                </BodCard>
            </div>

        </div>
    </Modal>


}
export default forwardRef(ChooseUserCom);