const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    devs: []
  },
  /**
   * 自定义数据
   */
  customData: {
    _devs: []
  },
  /**
   * 监听页面加载
   */
  onLoad: function () {
    /**
     * 检查版本
     */
    if (app.getPlatform() == 'android' && this.versionCompare('6.5.7', app.getVersion())) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，请更新至最新版本',
        showCancel: false
      })
    }
    else if (app.getPlatform() == 'ios' && this.versionCompare('6.5.6', app.getVersion())) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，请更新至最新版本',
        showCancel: false
      })
    }
    /**
     * 微信蓝牙模块初始化
     */
    const self = this
    wx.openBluetoothAdapter({
      success: function (res) {
        // console.log('search.js[onLoad]: openBluetoothAdapter success')
        app.globalData.BluetoothState = true
        self.startSearchDevs() // 搜索附近蓝牙
      },
      fail: function (err) {
        // console.log('search.js[onLoad]: openBluetoothAdapter fail')
        if (err.errCode === 10001) { // 手机蓝牙未开启
          app.globalData.BluetoothState = false
          wx.showLoading({
            title: '请开启手机蓝牙',
          })
        } else {
          console.log(err.errMsg)
        }
      }
    })
    /**
     * 监听蓝牙适配器状态变化
     */
    wx.onBluetoothAdapterStateChange(function(res) {
       console.log('search.js[onLoad]: onBluetoothAdapterStateChange')
      if (res.available) {
        // console.log('search.js[onLoad]: BluetoothState is true')
        app.globalData.BluetoothState = true
        wx.openBluetoothAdapter({
          success: function(res) {
            app.globalData.BluetoothState = true
            wx.hideLoading()
          },
        })
      } else {
         console.log('search.js[onLoad]: BluetoothState is false')
        app.globalData.BluetoothState = false
        app.globalData.connectState = false
        wx.showLoading({
          title: '请开启手机蓝牙',
        })
      }
    })
    /**
     * 监听BLE蓝牙连接状态变化
     */
    wx.onBLEConnectionStateChange(function(res) {
      if (res.connected) {
         console.log('connected')
        wx.hideLoading()
        wx.showToast({
          title: '连接成功',
          icon: 'success',
          success: function(res) {
            app.globalData.connectState = true
          }
        })
      } else {
         console.log('disconnect')
        wx.hideLoading()
        wx.showToast({
          title: '已断开连接',
          icon: 'none',
          success: function(res) {
            app.globalData.connectState = false
          }
        })
      }
    })
  },
  onShow: function () {
  },
  /**
   * 监听页面初次渲染完成
   */
  onReady: function () {
  },
  /**
   * 监听页面隐藏
   */
  onHide: function () {
    app.stopSearchDevs()
  },
  /**
   * 监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (app.globalData.BluetoothState) {
      const self = this
      this.customData._devs = []
      wx.closeBluetoothAdapter({
        success: function (res) {
          wx.openBluetoothAdapter({
            success: function (res) {
              self.startSearchDevs()
            }
          })
        }
      })
    }
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 2000)
  },
  /**
   * 开始搜索附近蓝牙
   */
  startSearchDevs: function () {
    const self = this
    wx.startBluetoothDevicesDiscovery({ // 开启搜索
      allowDuplicatesKey: false,
      success: function (res) {
        wx.onBluetoothDeviceFound(function (devices) {
          var isExist = false
          if (devices.deviceId) {
            for (let item of self.customData._devs) {
              if (item.deviceId === devices.deviceId) {
                isExist = true
                break;
              }
            }
            !isExist && self.customData._devs.push(devices)
            self.setData({
              devs: self.customData._devs
            })
          }
          else if (devices.devices) {
            for (let item of self.customData._devs) {
              if (item.deviceId === devices.devices[0].deviceId) {
                isExist = true
                break;
              }
            }
            !isExist && self.customData._devs.push(devices.devices[0])
            self.setData({
              devs: self.customData._devs
            })
          }
          else if (devices[0]) {
            for (let item of self.customData._devs) {
              if (item.deviceId === devices[0].deviceId) {
                isExist = true
                break;
              }
            }
            !isExist && self.customData._devs.push(devices[0])
            self.setData({
              devs: self.customData._devs
            })
          }
        })
      }
    })
  },
  /**
   * 版本比较
   */
  versionCompare: function (ver1, ver2) {
    var version1pre = parseFloat(ver1)
    var version2pre = parseFloat(ver2)
    var version1next = parseInt(ver1.replace(version1pre + ".", ""))
    var version2next = parseInt(ver2.replace(version2pre + ".", ""))
    if (version1pre > version2pre)
      return true
    else if (version1pre < version2pre)
      return false
    else {
      if (version1next > version2next)
        return true
      else
        return false
    }
  },
  /**
   * 选择设备连接
   */
  connect (event) {
    if (app.globalData.BluetoothState) {
      const deviceId = event.currentTarget.dataset.dev.deviceId
      const deviceName = event.currentTarget.dataset.dev.name
      wx.showLoading({
        title: '正在连接...',
      })
      app.startConnect(deviceId, deviceName)
    }
  },
})