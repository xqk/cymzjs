export const dev = 0;
export const host = 'https://zymzapi.zc0901.com';
// export const host = 'http://127.0.0.1:8887';
export const qiniuUptokenURL = host + "/api/qiniu/token?bucket=1"
export const fileHost = 'https://static.imolacn.com'
// export const fileHost = 'http://192.168.0.103:1314'
export const appName = "崇阳网络祭祀平台"

export const getAppid = () => {
    return wx.getAccountInfoSync().miniProgram.appId;
}

export const getVersion = () => {
    return dev ? '1.0.1' : wx.getAccountInfoSync().miniProgram.version;
}