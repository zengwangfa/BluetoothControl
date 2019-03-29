//app.js
App({
  onLaunch: function () { // 小程序启动
    this.globalData.sysinfo = wx.getSystemInfoSync()
  },
  globalData: {
    sysinfo: {},
    BluetoothState: false, // 蓝牙适配器状态
    connectState: false // 蓝牙连接状态
  },
  getModel: function () { //获取手机型号
    return this.globalData.sysinfo["model"]
  },
  getVersion: function () { //获取微信版本号
    return this.globalData.sysinfo["version"]
  },
  getSystem: function () { //获取操作系统版本
    return this.globalData.sysinfo["system"]
  },
  getPlatform: function () { //获取客户端平台
    return this.globalData.sysinfo["platform"]
  },
  getSDKVersion: function () { //获取客户端基础库版本
    return this.globalData.sysinfo["SDKVersion"]
  },
  buf2string: function (buffer) {
    var arr = Array.prototype.map.call(new Uint8Array(buffer), x => x)
    var str = ''
    for (var i = 0; i < arr.length; i++) {
      str += String.fromCharCode(arr[i])
    }
    return str
  },
  buf2hex: function (buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  },
  string2buf: function (str) {
    // 首先将字符串转为16进制
    let val = ""
    for (let i = 0; i < str.length; i++) {
      if (val === '') {
        val = str.charCodeAt(i).toString(16)
      } else {
        val += ',' + str.charCodeAt(i).toString(16)
      }
    }
    // 将16进制转化为ArrayBuffer
    return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    })).buffer
  },
  /**
   * 字符串每20个字节分包返回数组
   */
  subPackage: function (str) {
    const packageArray = []
    for (let i = 0; str.length > i; i += 20) {
      packageArray.push(str.substr(i, 20))
    }
    return packageArray
  },
  /**
   * 停止搜索附近蓝牙
   */
  stopSearchDevs: function () {
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) { },
    })
  },
  /**
   * 开始连接
   */
  startConnect(deviceId, deviceName = '未知设备') {
    if (this.globalData.BluetoothState) {
      wx.createBLEConnection({
        deviceId: deviceId,
        timeout: 10000, // 10s连接超时
        success: function (res) {
          wx.navigateTo({
            url: `/pages/API/service/service?deviceId=${deviceId}&deviceName=${deviceName}`,
          })
        },
      })
    }
  },
  /**
   * 断开连接
   */
  endConnect(deviceId) {
    if (this.globalData.BluetoothState) {
      wx.closeBLEConnection({
        deviceId: deviceId,
        success: function (res) { },
      })
    }
  }
})