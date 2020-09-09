import API from './../request/api.js';
import Request from './../request/request.js';

const userService = {
  getUserInfo() {
    // 缓存里面获取
    const userInfoKey = `${API.MODE}_userInfo`;
    const storageUserInfo = wx.getStorageSync(userInfoKey);
    if(storageUserInfo) {
      return Promise.resolve(storageUserInfo.userInfo)
    }

    return new Promise((resolve, reject) => {
      // 曾经是否授权过，自动登录
      wx.getSetting({
         success: res => {
           if (res.authSetting['scope.userInfo']) {
             wx.login({
               success:(loginRes) =>{
                 wx.getUserInfo({
                   success: (userInfoRes) => {
                     userService.oAuth({
                       code: loginRes.code,
                       iv: userInfoRes.iv, 
                       encryptedData: userInfoRes.encryptedData
                     })
                     .then(res => {
                       resolve(res.userInfo)
                     })
                   },
                   fail: (err) => {
                     reject(err)
                   }
                 })
               },
               fail: (err) => {
                 reject(err)
               }
             })
           }else{
             reject(res)
           }
         },
         fail: (err) => {
           reject(err)
         }
      })
    })
  },
  getPhoneNumber({ iv, encryptedData }) {
    return new Promise((resolve, reject) => {
      wx.checkSession({
        success: () => {
          userService.getPhone({ iv, encryptedData })
            .then(res => {
              resolve(res)
            })
            .catch( err => {
              reject(err)
            })
        },
        fail: () =>{
          wx.login({
            success: (loginRes) => {
              userService.updateSessionKey(loginRes.code)
                .then(()=>{
                   userService.getPhone({ iv, encryptedData })
                      .then(res => {
                         resolve(res)
                      })
                      .catch( err => {
                         reject(err)
                       })
                })
                .catch((err) => {
                  reject(err)
                })
            },
            fail: (err) => {
              reject(err)
            }
          })
        }
      })

    })
  },
  updateSessionKey(code) {
    return Request.post(API.sessionKey, { code })
  },
  getPhone({iv, encryptedData}) {
    return Request.post(API.getPhone, { 
      iv, encrypted_data: encryptedData
    })
  },
  oAuth({code, iv, encryptedData }) {
    return Request.post(API.oauth, { 
      code, iv, encrypted_data: encryptedData
    }).then( res => {
      const userInfoKey = `${API.MODE}_userInfo`;
      wx.setStorageSync(userInfoKey, res)
      return res
    })
  },
}

export default userService;

