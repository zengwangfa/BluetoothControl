//about_ETA.js
const app = getApp()

Page({
  data: {
    pictrue:'../../image/ETA.png',
    author:"集大电协",
    spirit: '传承创新 自强不息',
    version:"版本号:V1.20"
  },


  author: function () {
    //关闭当前页面，跳转到应用内的某个页面。
    wx.redirectTo({
      url: '../detail/detail',
      success: function (res) {
        console.log('To_detail_success!');
      },
      fail: function () {
        console.log('To_detail_fail!');
      },
      complete: function () {
        // complete
      }
    })
  }











})
