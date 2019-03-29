var width_value = wx.getSystemInfoSync().windowWidth   //获取屏幕宽度 与  高度
var height_value = wx.getSystemInfoSync().windowHeight 
var x_offest = 0
var y_offest = 20

Page({

  data: {
    return_key: 'Bluetooth',
  },


  return_key: function () {
    //关闭当前页面，跳转到应用内的某个页面。
    wx.navigateTo ({
      url: '../search/search',
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

  onReady: function () {
    this.drawBigBall()
    var that = this

    console.log("windowWidth", width_value, "windowHeight", height_value);//打印屏幕分辨率

    this.position =  {
      x: width_value,                /*wx.getSystemInfo.windowWidth,*/
      y: height_value,              /*wx.getSystemInfo.windowHeight,*/
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0
    }
    wx.onAccelerometerChange(function (res) {
      // console.log('获取加速度数据', res);
      that.setData({
        x: res.x.toFixed(2),
        y: res.y.toFixed(2),
        z: res.z.toFixed(2)
      })
      that.position.ax = Math.sin(res.x * Math.PI / 2)
      that.position.ay = -Math.sin(res.y * Math.PI / 2)
      that.position.az = Math.sin(res.z * Math.PI / 2)

      //that.drawSmallBall()
    })

    this.interval = setInterval(function () {
      that.drawSmallBall()
    }, 17)

  },


  drawBigBall: function () {
    var context = wx.createContext()
    context.beginPath(0)
    context.arc(width_value / 2, width_value / 3 + y_offest , width_value / 3, 0, 2*Math.PI)
    context.setFillStyle('#ffffff')
    context.setStrokeStyle('#aaaaaa')
    context.fill()

    context.stroke()  //画外框
    wx.drawCanvas({
      canvasId: 'big-ball',
      actions: context.getActions()
    })
  },
  drawSmallBall: function () {
    var p = this.position
    var strokeStyle = 'rgba(1,1,1,0)'
    var pitch,roll
    p.x = p.x + p.vx
    p.y = p.y + p.vy
    p.vx = p.vx + p.ax
    p.vy = p.vy + p.ay


    console.log('获取x、y加速度数据', p.ax,p.ay);


    var context = wx.createContext()
    context.beginPath(0)
    context.arc(p.ax * 100 + width_value / 2, p.ay * 100 + width_value / 3 + y_offest, 15, 0, Math.PI * 2)
    context.setFillStyle('#1aad19')
    context.setStrokeStyle(strokeStyle)
    context.fill()
     //context.stroke()
    wx.drawCanvas({
      canvasId: 'small-ball',
      actions: context.getActions()
    })
  },
  data: {
    x: 0,
    y: 0,
    z: 0
  },
  onUnload: function () {
    clearInterval(this.interval)
  },

})
