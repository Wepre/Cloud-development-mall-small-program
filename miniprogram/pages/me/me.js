const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false
  },
  toalter(e){
    wx.navigateTo({
      url: '../altmsg/altmsg',
    })
  },
  adminPwd(e) {
    var that = this;
    wx.navigateTo({
      url: '../admin/admin',
    })
    that.setData({
      show:!that.data.show
    })
    // if(e.detail.value == '') {
    //   wx.showToast({
    //     title: '密码正确',
    //     success(res) {
    //       wx.navigateTo({
    //         url: '../admin/admin',
    //       })
    //       that.setData({
    //         show:!that.data.show
    //       })
    //     }
    //   })
    // }
  },
  // 跳转到后台管理
  admin(){
    wx.navigateTo({
      url: '../admin/admin',
    })
    that.setData({
      show:!that.data.show
    })
  },
  // 跳转订单管理页
  toOrder(res){
    var name = res.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../myOrder/myOrder?name='+name,
    })
  },

  // 跳转我的收藏
  goToCollection(res){
    wx.redirectTo({
      url: '../myCollection/myCollection',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var loginId=wx.getStorageSync('loginId')
    console.log(loginId);
    db.collection('userList').doc(loginId).get().then(res=>{
      console.log(res);
      this.setData({
        msg:res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})