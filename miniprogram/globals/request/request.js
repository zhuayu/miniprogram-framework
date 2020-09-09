import API from './api.js';

const globalError = (code, message)=>{
  wx.showModal({
    title: String(code),
    content: message,
    confirmText: "确定",
    showCancel:false,
    confirmColor: '#35b558',
  })
}

const interceptorsRequest = (method, url, data, header={})=> {
  const params = { method, url, data, header };
  const userInfoKey = `${API.MODE}_userInfo`;
  const storageUserInfo = wx.getStorageSync(userInfoKey)
  if(storageUserInfo){
    header['Authorization'] = `Bearer ${storageUserInfo.token}`
  }
  return params
}

const request = (method, url, data, header) => {
  const params = interceptorsRequest(method, url, data, header)
  return new Promise((resolve, reject)=>{
    wx.request({
      method,
      url: params.url,
      header: params.header,
      data: params.data,
      success: (res) => {
        if(res.statusCode === 200){
          if(res.data.error_code === 0) {
            resolve(res.data.data);
          } else if(res.data.error_code) {
            globalError("提示", res.data.message);
            reject(res.data);
          }else {
            resolve(res.data);
          }
        }else if(res.statusCode === 401){
          // 重新登录
          // console.log('401, 重新登录获取 token')
          wx.clearStorageSync();
          reject(res.data);
        }else{
          reject(res.data)
        }
      },
      fail: (err) => {
        globalError('WECHAT HTTP', err.errMsg)
        reject(err)
      }
    })
  })
}

/* [请求库]
** @params url         { string }   @default => '' [接口地址，统一在 api 文件中]
** @params data/params { object }   @default => {} [发送数据]
** @params header      { object }   @default => {} [请求 Header 配置]
*/

export default {
  post (url='', data={}, header={}) {
    return request('POST', url, data, header)
  },
  put (url='', data={}, header={}) {
    return request('PUT', url, data, header)
  },
  get (url, data={}, header={}) {
    return request('GET', url, data, header)
  },
  delete (url='', data={}, header={}) {
    return request('DELETE', url, header)
  }
}