const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    characteristic: []
  },
  /**
   * 自定义数据
   */
  customData: {
    deviceId: '',
    deviceName: '',
    serviceId: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this
    this.customData.deviceId = options.deviceId
    this.customData.serviceId = options.serviceId
    this.setData({
      name: options.deviceName
    })
    wx.getBLEDeviceCharacteristics({
      deviceId: options.deviceId,
      serviceId: options.serviceId,
      success: function(res) {
        self.setData({
          characteristic: res.characteristics
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 跳转到操作页面
   */
  operation: function(event) {
    if (app.globalData.connectState) {
      const properties = []
      const _properties = event.currentTarget.dataset.properties
      for (let key in _properties) {
        properties.push(`${key}=${_properties[key]}`)
      }
      const characteristicId = event.currentTarget.dataset.characteristicid
      const deviceId = this.customData.deviceId
      const serviceId = this.customData.serviceId
      wx.navigateTo({
        url: `/pages/API/com/com?deviceId=${deviceId}&serviceId=${serviceId}&characteristicId=${characteristicId}&${properties.join('&')}`,
      })
    } else {
      wx.showToast({
        title: '未连接蓝牙设备',
        icon: 'none'
      })
    }
  }
})