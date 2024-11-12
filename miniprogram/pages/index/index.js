const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    List: [],
    height: 0,
    lunbo: ['https://img2.baidu.com/it/u=1455069487,220604234&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=390', 'https://pic.90sheji.com/design/00/86/08/93/dc55cc86f6d4279fd8e69be5fdc8696e.jpg%21/fwfh/1920x0/clip/0x1275a0a0/quality/90/unsharp/true/compress/true/watermark/url/LzkwX3dhdGVyX3Y2LnBuZw==/repeat/true', 'https://picnew11.photophoto.cn/20170714/shangchengchanpintutechanhaibao-25762117_1.jpg'],
    array: app.globalData.fenlei,
    array_tuijian: [

    ],
    openid: '',
    search: '',
    search_product: [],
    searching: false
    // navH:null
  },

  onChange(event) {
    
  },
  // 跳转商品详情页
  goToProduct(res) {
    var that = this;
    var id = res.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  },
  // 获取输入框的值
  value(res) {
    var that = this;
    that.setData({
      search_product: null
    })
    var value = res.detail.value;
    console.log(value);
    if (value == '') {
      console.log("空了");
      that.setData({
        searching: false
      })
    } else {
      that.setData({
        search: value,
        searching: true
      })
    }
  },
  //搜索
  search(res) {
    var that = this;
    var value = that.data.search;
    console.log(value);
    wx.navigateTo({
      url: '../search/search?id='+value,
    })
    
  },
  // 跳转分类页
  selectName(res) {
    var name = res.currentTarget.dataset.name;
    app.globalData.name = name;
    wx.switchTab({
      url: '../classify/classify',
    })
  },
  // 跳转掌柜推荐
  BossRecommend(res) {
    wx.navigateTo({
      url: '../recommend/recommend',
    })
  },
  // 加入购物车
  addToShop(res) {
    var that = this;
    var item = res.currentTarget.dataset.item;
    var id=item._id
    delete item._id
    delete item._openid
    var array=item
    var x=0
    console.log(array)
    var loginId=wx.getStorageSync('loginId')
    db.collection('shopping_car').get({
      success(res) {
        console.log(res);
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i]._openid == that.data.openid && res.data[i].id == id) {
            wx.showToast({
              title: '您已重复添加',
            })
            x = 1;
          }
        }
        if (x == 0) {
          db.collection('shopping_car').add({
            data: {
              loginId,
              name: array.name,
              price: array.price,
              detail: array.detail,
              img_src: array.img_src,
              checked: true,
              num: 1,
              id: array._id
            },
            success(res) {
              console.log("上传成功");
              wx.hideLoading({
                success: (res) => {
                  wx.showToast({
                    title: '成功加入购物车',
                  })
                },
              })
            },
            fail(res) {
              console.log("上传失败", res);
            }
          })
        }
      }
    })

  },
  setContainerHeight: function (e) {
    //图片的原始宽度
    var imgWidth = e.detail.width;
    //图片的原始高度
    var imgHeight = e.detail.height;
    //同步获取设备宽度
    var sysInfo = wx.getSystemInfoSync();
    //获取屏幕的高度
    var screenWidth = sysInfo.screenWidth;
    //获取屏幕和原图的比例
    var scale = screenWidth / imgWidth;
    //设置容器的高度
    this.setData({
      height: imgHeight * scale
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    var that = this;
    var array = [];
    // console.log(x,i);
    wx.cloud.callFunction({
      name: 'findProduct',
      success(res) {
        
        that.setData({
          array_tuijian: array,
          List:res.result.data.reverse()
        })
      }
    })
    wx.cloud.callFunction({
      name: 'OpenId',
      success(res) {
        that.setData({
          openid: res.result.openid
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad();
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