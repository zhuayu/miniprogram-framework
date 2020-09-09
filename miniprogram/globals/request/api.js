const HOST = 'http://localhost:3000';
const MODE = 'developer';

export default {
  MODE,
  sessionKey: `${HOST}/mini-program/wechat/sessionkey`,
  getPhone: `${HOST}/mini-program/wechat/phone`,
  oauth: `${HOST}/mini-program/wechat/oauth`,
  userInfo: `${HOST}/mini-program/wechat/userinfo`,
}