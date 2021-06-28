import Request, { Delete, Get,Put } from '@/utils/request'
// 获取角色列表
export const rolesRequest = (params) => {
    return new Promise((resolve, reject) => {
        Request('/psy/sys/role/query',params).then(res => {
            resolve(res.data);
        }) 
    })
} 


// 添加角色
export const roleAddRequest = (params) => {
    return new Promise((resolve, reject) => {
       Request('/psy/sys/role/add',params).then(res => {
            resolve(res.data);
        })
    })
} 

// 更新角色
export const roleYUpdateRequest = (params) => {
    return new Promise((resolve, reject) => {
        Request('/psy/sys/role/update',params).then(res => {
            resolve(res.data);
        })
    })
} 

// 删除角色
export const roleDeleteRequest = (id) => {
    return new Promise((resolve, reject) => {
        Delete('/psy/sys/role/'+id,).then(res => {
            resolve(res.data);
        })
    })
} 



// 获取用户列表
export const userRequest = (params) => {
    return new Promise((resolve, reject) => {
        Get('/psy/sys/user',params).then(res => {
            resolve(res.data);
        })
    })
} 


// 添加用户
export const userAddRequest = (params) => {
    return new Promise((resolve, reject) => {
       Request('/psy/sys/user',params).then(res => {
            resolve(res.data);
        })
    })
} 

// 更新用户
export const userUpdateRequest = (params) => {
    return new Promise((resolve, reject) => {
        Put('/psy/sys/user',params).then(res => {
            resolve(res.data);
        })
    })
} 

// 删除用户
export const userDeleteRequest = (id) => {
    return new Promise((resolve, reject) => {
        Delete('/psy/sys/user/'+id,).then(res => {
            resolve(res.data);
        })
    })
} 



// 设备列表
export const deviceList = () => {
    return new Promise((resolve, reject) => {
        Get('/psy/mnt/device').then(res => {
            resolve(res.data);
        })
    })
} 


// 设备修改
export const updatedevice = (params) => {
    return new Promise((resolve, reject) => {
       Request('/psy/sys/updatedevice',params).then(res => {
            resolve(res.data);
        })
    })
} 

// 删除设备
export const deviceDeleteRequest = (id) => {
    return new Promise((resolve, reject) => {
        Delete('/psy/sys/device/'+id,).then(res => {
            resolve(res.data);
        })
    })
} 


// 部门
export const grouptree = () => {
    return new Promise((resolve, reject) => {
        Get('/psy/sys/org/tree').then(res => {
            resolve(res.data);
        })
    })
} 


// 部门新增
export const groupAdd = (params) => {
    return new Promise((resolve, reject) => {
       Request('/psy/sys/org/add',params).then(res => {
            resolve(res.data);
        })
    })
} 
// 部门修改
export const updategroup = (params) => {
    return new Promise((resolve, reject) => {
       Request('/psy/sys/org/update',params).then(res => {
            resolve(res.data);
        })
    })
} 

// 删除部门
export const deleteGroup = (id) => {
    return new Promise((resolve, reject) => {
        Delete('/psy/sys/org/'+id,).then(res => {
            resolve(res.data);
        })
    })
} 









// 获取人员列表
export const memberRequest = (params) => {
    return new Promise((resolve, reject) => {
       Request('/psy/sys/user/query',params).then(res => {
            resolve(res.data);
        })
    })
} 


// 添加人员
export const memberAddRequest = (params) => {
    return new Promise((resolve, reject) => {
       Request('/psy/sys/user/add',params).then(res => {
            resolve(res.data);
        }).catch(()=>{
            reject("错误了");
        })
    })
} 

// 更新人员
export const memberUpdateRequest = (params) => {
    return new Promise((resolve, reject) => {
       Request('/psy/sys/user/update',params).then(res => {
            resolve(res.data);
        }).catch(()=>{
            reject("错误了");
        })
    })
} 

// 删除人员
export const memberDeleteRequest = (id) => {
    return new Promise((resolve, reject) => {
        Delete('/psy/sys/user/'+id,).then(res => {
            resolve(res.data);
        })
    })
} 

// 部门
export const getUserInfo = (id) => {
    return new Promise((resolve, reject) => {
        Get('/psy/sys/member/'+id).then(res => {
            resolve(res.data);
        })
    })
} 


// 获取人员列表
export const menuRequest = () => {
    return new Promise((resolve, reject) => {
        Request('/psy/sys/menu/query').then(res => {
            resolve(res.data);
        })
    })
} 