//detail.js
//获取应用实例
const util = require('../../utils/util.js')
const app = getApp()


Page({
  data: {
    return_key: '返回',

    info: {

      
    }
  },

  onLoad: function () {
    // 调用函数时，传入new Date()参数，返回值是日期和时间  
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      time: time
    });
  } ,

  return_key: function () {
    //关闭当前页面，跳转到应用内的某个页面。
    wx.switchTab({
      url: '../about_ETA/about_ETA',
      success: function (res) {
        console.log('success');
      },
      fail: function () {
        console.log('fail');
      },
      complete: function () {
        // complete
      }
    })
  }
})


