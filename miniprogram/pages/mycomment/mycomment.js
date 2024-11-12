const db = wx.cloud.database();
const _ = db.command;
Page({
  data: {

  },
  onLoad() {

  },
  cancle(e) {
    var id = e.currentTarget.dataset.id

    wx.showModal({
      title: '提示',
      content: '是否要删除这条评论',
      complete: (res) => {
        if (res.cancel) {

        }

        if (res.confirm) {
          const db = wx.cloud.database();
          const _ = db.command;
          db.collection('commentList').doc(id).remove().then(res => {
            wx.showToast({
              title: '删除成功',
            })
            wx.navigateBack({
              delta: "1"
            })

          })

        }
      }
    })
  },
  onShow() {
    var loginId = wx.getStorageSync('loginId')
    wx.cloud.callFunction({
      name: "lookup",
      data: {
        name: 'commentList',
        from: 'product_shopping',
        localField: 'goodid',
        foreignField: '_id',
        as: 'goodinfo',
        wherename: '_id',
        where: loginId
      }
    }).then(res => {
      console.log('用户信息加评论', res)
      var list = []
      res.result.list.forEach(element => {
        if (element.loginId == loginId) {
          console.log(element);
          list.push(element)
          this.setData({
            pinglun: list
          })
        }
      });

      wx.hideLoading({
        success: (res) => {},
      })
    })
  }
})