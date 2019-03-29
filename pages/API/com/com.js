const app = getApp()
var music_flag = false
var led_flag = false

Page({
  /**
   * 页面的初始数据
   */
  data: {
    receiverText: '',
    receiverLength: 0,
    sendText: '',
    sendLength: 0,
    time: 1000,
    timeSend: false,
    disabled:false,
    boolean: false
    
  },
  /**
   * 自定义数据
   */
  customData: {
    sendText: '',
    deviceId: '',
    serviceId: '',
    characteristicId: '',
    canWrite: false,
    canRead: false,
    canNotify: false,
    canIndicate: false,
    time: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this
    this.customData.deviceId = options.deviceId
    this.customData.serviceId = options.serviceId
    this.customData.characteristicId = options.characteristicId
    this.customData.canWrite = options.write === 'true' ? true : false
    this.customData.canRead = options.read === 'true' ? true : false
    this.customData.canNotify = options.notify === 'true' ? true : false
    this.customData.canIndicate = options.indicate === 'true' ? true : false
    /**
     * 如果支持notify
     */
    if (options.notify) {
      wx.notifyBLECharacteristicValueChange({
        deviceId: options.deviceId,
        serviceId: options.serviceId,
        characteristicId: options.characteristicId,
        state: true,
        success: function(res) {
          // do something...
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const self = this;

    function buf2string(buffer) {
      var arr = Array.prototype.map.call(new Uint8Array(buffer), x => x)
      return arr.map((char, i) => {
        return String.fromCharCode(char);
      }).join('');
    }

    /**
     * 监听蓝牙设备的特征值变化
     */
    wx.onBLECharacteristicValueChange(function (res) {
      const receiverText = buf2string(res.value);
      self.setData({
        receiverLength: self.data.receiverLength + receiverText.length
      })
      setTimeout(() => {
        self.setData({
          receiverText: (self.data.receiverText + receiverText).substr(-4000, 4000)
        })
      }, 200)
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      receiverText: '',
      receiverLength: 0,
      sendText: '',
      sendLength: 0,
      time: 1000,
      timeSend: false
    })
  },
  /**
   * 更新发送框内容
   */
  updateSendText: function(event) {
    const value = event.detail.value
    this.customData.sendText = value
    this.setData({
      sendText: value
    })
  },
  /**
   * 更新定时发送时间间隔
   */
  updateTime: function(event) {
    const self = this
    const value = event.detail.value
    this.setData({
      time: /^[1-9]+.?[0-9]*$/.test(value) ? +value : 1000
    })
    clearInterval(this.customData.time)
    const deviceId = this.customData.deviceId // 设备ID
    const serviceId = this.customData.serviceId // 服务ID
    const characteristicId = this.customData.characteristicId // 特征值ID
    this.customData.time = setInterval(() => {
      const sendText = self.customData.sendText
      const sendPackage = app.subPackage(sendText) // 数据分每20个字节一个数据包数组
      if (app.globalData.connectState) {
        if (self.customData.canWrite) { // 可写
          self.writeData({ deviceId, serviceId, characteristicId, sendPackage })
        }
      }
    }, self.data.time)
  },
  /**
   * 清除接收
   */
  clearReceiverText: function(event) {
    // this.customData.receiverText = ''
    this.setData({
      receiverText: '',
      receiverLength: 0,
      sendLength: 0
    })
  },
  /**
   * 清除发送
   */
  clearSendText: function(event) {
    this.customData.sendText = ''
    this.setData({
      sendText: '',
      sendLength: 0
    })
  },
  /**
   * 手动发送
   */
  manualSend: function(event) {
    const deviceId = this.customData.deviceId // 设备ID
    const serviceId = this.customData.serviceId // 服务ID
    const characteristicId = this.customData.characteristicId // 特征值ID
    const sendText = this.customData.sendText
    const sendPackage = app.subPackage(sendText) // 数据分每20个字节一个数据包数组
    if (app.globalData.connectState) {
      if (this.customData.canWrite) { // 可写
        this.writeData({ deviceId, serviceId, characteristicId, sendPackage })//--------
      }
    } else {
      wx.showToast({
        title: '已断开连接',
        icon: 'none'
      })
    }
  },




  
  /**
   * 自动发送
   */
  timeChange (event) {
    this.setData({
      timeSend: event.detail.value.length ? true : false
    })
    if (!this.data.timeSend) {
      clearInterval(this.customData.time)
    } else {
      const self = this
      const deviceId = this.customData.deviceId // 设备ID
      const serviceId = this.customData.serviceId // 服务ID
      const characteristicId = this.customData.characteristicId // 特征值ID
      this.customData.time = setInterval(() => {
        const sendText = self.customData.sendText
        const sendPackage = app.subPackage(sendText) // 数据分每20个字节一个数据包数组
        if (app.globalData.connectState) {
          if (self.customData.canWrite) { // 可写
            self.writeData({ deviceId, serviceId, characteristicId, sendPackage })
          }
        }
      }, self.data.time)
    }
  },
  /**
   * 向特征值写数据(write)
   */
  writeData: function ({deviceId, serviceId, characteristicId, sendPackage, index = 0}) {
    const self = this
    let i = index;
    let len = sendPackage.length;
    if (len && len > i) {
      wx.writeBLECharacteristicValue({
        deviceId,
        serviceId,
        characteristicId,
        value: app.string2buf(sendPackage[i]),
        success: function (res) {
          self.setData({
            sendLength: self.data.sendLength + sendPackage[i].length // 更新已发送字节数
          })
          i += 1;
          self.writeData({deviceId, serviceId, characteristicId, sendPackage, index: i}) // 发送成功，发送下一个数据包
        },
        fail: function (res) {
          self.writeData({deviceId, serviceId, characteristicId, sendPackage, index}) // 发送失败，重新发送
        }
      })
    }
  },

   musicswitchChange: function(e) {
      console.log('switch1 发生 change 事件，携带值为', e.detail.value)
      music_flag = e.detail.value
      const deviceId = this.customData.deviceId // 设备ID
      const serviceId = this.customData.serviceId // 服务ID
      const characteristicId = this.customData.characteristicId // 特征值ID

      if (app.globalData.connectState) {
        if (this.customData.canWrite && music_flag == true) { // 可写
          const sendPackage = app.subPackage('1') // 数据分每20个字节一个数据包数组
          console.log('sendPackage', sendPackage)

          console.log('music_flag:', music_flag)
          this.writeData({ deviceId, serviceId, characteristicId, sendPackage })//--------

          wx.showToast({
            title: 'Music 已开启',
            icon: 'succes',
            duration: 700,
            mask: true
          })
        }
        else if (this.customData.canWrite && music_flag == false) { // 可写
          const sendPackage = app.subPackage('0') // 数据分每20个字节一个数据包数组
          console.log('sendPackage', sendPackage)

          console.log('music_flag:', music_flag)
          this.writeData({ deviceId, serviceId, characteristicId, sendPackage })//--------

          wx.showToast({
            title: 'Music 已关闭',
            icon: 'loading',
            duration: 700,
            mask: true
          })
        }
      }
      else {
        wx.showToast({
          title: '已断开连接',
          icon: 'none'
        })

      }

   },


  ledbutton: function (e) {
    var bol = this.data.boolean;
    this.setData({

      boolean: !bol
    })
    const deviceId = this.customData.deviceId // 设备ID
    const serviceId = this.customData.serviceId // 服务ID
    const characteristicId = this.customData.characteristicId // 特征值ID

    if (app.globalData.connectState) {
      if (this.customData.canWrite && led_flag == false) { // 可写
        const sendPackage = app.subPackage('3') // 数据分每20个字节一个数据包数组
        console.log('sendPackage', sendPackage)
        led_flag = true
        console.log('led_flag:', led_flag)
        this.writeData({ deviceId, serviceId, characteristicId, sendPackage })//--------

        wx.showToast({
          title: 'LED 已开启',
          icon: 'succes',
          duration: 700,
          mask: true
        })
      }
      else if (this.customData.canWrite && led_flag == true) { // 可写
        const sendPackage = app.subPackage('2') // 数据分每20个字节一个数据包数组
        console.log('sendPackage', sendPackage)
        led_flag = false
        console.log('led_flag:', led_flag)
        this.writeData({ deviceId, serviceId, characteristicId, sendPackage })//--------

          wx.showToast({
            title: 'LED 已关闭',
            icon: 'loading',
            duration: 700,
            mask: true
          })
      }
    }
    else {
      wx.showToast({
        title: '已断开连接',
        icon: 'none'
      })

    }

  },



})