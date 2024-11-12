const db = wx.cloud.database();
const _ = db.command;
Page({
  data: {

  },
    // 跳转商品详情页
    goToProduct(res) {
      var that = this;
      var id = res.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../product/product?id=' + id,
      })
    },
  onLoad(e) {
    var value=e.id
    wx.showLoading({
      title: '搜索中',
    })
    db.collection('product_shopping').where({
      name: db.RegExp({
        regexp: value,
        options: 'i' // 不区分大小写
      })
    }).get().then(res=>{
      console.log(res);
      this.setData({
        List:res.data.reverse()
      })
      wx.hideLoading({
        noConflict: true,
        success: (res) => {},
        fail: (res) => {},
        complete: (res) => {},
      })
    })
  },
  onShow() {

  }
})