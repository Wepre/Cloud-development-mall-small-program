const db = wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectname: '新鲜上市',
    left_name: [{
        id: 1,
        name: '水果'
      },
      {
        id: 2,
        name: '蔬菜'
      },
      {
        id: 3,
        name: '肉禽蛋品'
      },
      {
        id: 4,
        name: '海鲜水产'
      },

    ],
    TabCur: 0,
    MainCur: 0,
    load: true,
    VerticalNavTop: 0,
    categoryList: app.globalData.fenlei,
    all: [],
    product: [],
    id: 0,
    num: 0,
    name: ''
  },

  // 跳转商品详情页
  GoToProduct(res) {
    var that = this;
    var id = res.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })

  },

  // 显示对应分类的商品
  selectId(res) {
    var that = this;
    var name = res.currentTarget.dataset.name;
    var name_1 = '';
    var array = [];
    console.log(name);
    that.setData({
      name: name
    })

    for (var j = 0; j < that.data.all.length; j++) {
      if (that.data.all[j].fenlei == name) {
        array.push(that.data.all[j]);
      }
    }
    that.setData({
      product: array
    })
    console.log(that.data.product)
  },

  onLoad: function (options) {

    var that = this;
    var array = [];
    var name = app.globalData.name;
    wx.showLoading({
      title: '加载中',
    })
    console.log(name);
    if (name == '') {
      console.log("执行if");
      wx.cloud.callFunction({
        name: 'findProduct',
        success(res) {
          that.setData({
            product: res.result.data.reverse(),
            all: res.result.data.reverse()
          })
          wx.hideLoading({
            success: (res) => {},
          })
          console.log("所有商品为", that.data.product)
        }
      })
    } else {
      console.log("执行else");
      that.setData({
        name: name
      })
      wx.cloud.callFunction({
        name: 'findProduct',
        success(res) {
          that.setData({
            product: res.result.data,
            all: res.result.data
          })
          wx.hideLoading({
            success: (res) => {},
          })
          console.log(that.data.product)
          for (var i = 0; i < that.data.product.length; i++) {
            if (that.data.product[i].fenlei == name) {
              console.log("-------")
              array.push(that.data.product[i]);
            }
          }
          console.log(array);
          that.setData({
            product: array
          })
        }
      })
    }

  },
  tabSelect(e) {
    console.log(e);
    var name = e.currentTarget.dataset.name

    this.setData({
      TabCur: e.currentTarget.dataset.id,
      selectname: name,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  onShow: function () {
    this.onLoad();
  },

})