const db = wx.cloud.database();
const _ = db.command;
Page({
  data: {

  },
  onLoad() {
    
  },
  
  onShow() {
    var youhui=wx.getStorageSync('youhui')
    this.setData({
      youhui
    })
  }
})