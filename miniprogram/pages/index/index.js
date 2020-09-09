import userService from './../../globals/services/user.js'
const app = getApp()

Page({
  data: {
    userInfo: {},
  },
  onLoad: function () {
    this.getUserInfo();
  },
  getPhoneNumber (e) {
    if(e.detail.errMsg === 'getPhoneNumber:ok') {
      userService.getPhoneNumber({
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData
      }).then( res => {
        console.log(res)
      })
    }
  },
  handleGetUserInfo: function(e) {
    e.detail.userInfo && this.getUserInfo()
  },
  getUserInfo: function() {
    userService.getUserInfo()
      .then(userInfo => {
        this.setData({ userInfo })
      }).catch( err => console.log(err))
  }
})
