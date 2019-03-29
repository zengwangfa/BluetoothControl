//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    accelerometer: '加速度计',
    bluetooth: '蓝牙',
    bluetoothpicture: '../../image/bluetoothpicture.png',
    accpicture: '../../image/MPU6050.png',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  accelerometer: function () {
    //关闭当前页面，跳转到应用内的某个页面。
    wx.navigateTo({
      url: '../API/accelerometer/on-accelerometer-change',
      success: function (res) {
        console.log('To_accelerometer_success');
      },
      fail: function () { 
        console.log('To_accelerometer_fail');
      },
      complete: function () {
        // complete
      }
    })
  },
  bluetooth: function () {
    //关闭当前页面，跳转到应用内的某个页面。
    wx.navigateTo({
      url: '../API/search/search',
      success: function (res) {
        console.log('To_search_success');
      },
      fail: function () {
        console.log('To_search_fail');
      },
      complete: function () {
        // complete
      }
    })
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
