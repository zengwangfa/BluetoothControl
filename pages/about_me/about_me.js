//about_ETA.js
const app = getApp()

Page({
  data: {
    github_icon:'../../image/github_icon.png',
    csdn_icon: '../../image/csdn_icon.png',
    author:"淹死的鱼",
    github_url:"www.github.com/zengwangfa",
    csdn_url: "zengwangfa.top"
  },


  author: function () {
    //关闭当前页面，跳转到应用内的某个页面。
    wx.redirectTo({
      url: '../init_interface/init_interface',
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
