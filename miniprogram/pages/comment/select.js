const db = wx.cloud.database();
const _ = db.command;
Page({
  data: {
    count: 5,
    active: 4,
  },

  tocomment(e) {

    var id = e.currentTarget.dataset.id
    var id2 = e.currentTarget.dataset.id2
    console.log(id);
    wx.navigateTo({
      url: './add?id='+id+'&id2='+id2,
     
      success: (result) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
  },
  onLoad(e) {
    var id = e.id

    db.collection('order').doc(id).get().then(res => {
      console.log(res)
      this.setData({
        goods: res.data.product
      })
    })
  },
  onShow() {

  }
})