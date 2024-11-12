const db = wx.cloud.database();
const _ = db.command;
Page({
  data: {

  },
  onLoad() {

  },
  onShow() {

  },
  getid(e) {
    var num = e.currentTarget.dataset.num
    var youhui = wx.getStorageSync('youhui') || []
    if (youhui.indexOf(num) != -1) {
      wx.showToast({
        title: '已经领取过啦',
        icon: 'none'
      })
      return
    }
    console.log(e);
    wx.showModal({
      title: '是否要领取',
      content: '',
      complete: (res) => {
        if (res.cancel) {

        }

        if (res.confirm) {
          youhui.push(num)
          youhui.sort((a, b) => (b - a));
          wx.setStorageSync('youhui', youhui)
          wx.showToast({
                  title: '领取成功',
                  icon:'none'
                })
        }
      }
    })
  },
})