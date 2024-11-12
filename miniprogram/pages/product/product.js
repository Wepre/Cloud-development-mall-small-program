const db = wx.cloud.database();
const app = getApp();
const util = require('../util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    left: true,
    right: true,
    // left_bold:'',
    // right_bold:'',
    array: [],
    shoucang: ['../me/img/shoucang.png', './img/xin2.png'],
    openid: '',
    pinglun_value: ''
  },

  order(e){
    var id=e.id
    var data=this.data.array
    var product=[]
    product.push(data)
    console.log("已选商品有", product);
    
    var productAll = JSON.stringify(product);
    wx.navigateTo({
      url: '../address/address?productAll=' + productAll,
    })
  },
  // 获取评论的内容
  pinglun_value(res) {
    console.log(res.detail.value);
    this.setData({
      pinglun_value: res.detail.value
    })
  },

  // 评论
  getuserinfo(res) {
    var that = this;
    var id = that.data.array._id;
    var userName = '';
    var userImg = '';
    var time = util.formatTime(new Date());
    var neirong = that.data.pinglun_value;
    var pinglun = that.data.array.pinglun;
    console.log(pinglun);
    wx.getUserProfile({
      desc: '获取用户信息',
      success(res) {
        userName = res.userInfo.nickName;
        userImg = res.userInfo.avatarUrl;
        var array = {
          neirong: neirong,
          time: time,
          userName: userName,
          userImg: userImg
        }
        pinglun.push(array);
        console.log(pinglun)
        wx.cloud.callFunction({
          name: 'upDatePingLun',
          data: {
            id: id,
            pinglun: pinglun
          },
          success(res) {
            console.log("评论上传成功");
            wx.cloud.callFunction({
              name: 'selectProduct',
              data: {
                id: id
              },
              success(res) {
                console.log("最新内容为:", res.result.data);
                that.setData({
                  array: res.result.data[0],
                  pinglun_value: null
                })
              }
            })
          },
          fail(res) {
            console.log("评论上传失败", res);
          }
        })
      }
    })
  },

  // 收藏
  shoucang(res) {
    var that = this;
    var data = that.data.shoucang[1];
    var shoucang = that.data.shoucang;
    shoucang.pop();
    shoucang.unshift(data);
    that.setData({
      shoucang: shoucang
    })
    console.log(that.data.shoucang);
    if (that.data.shoucang[0] == './img/xin2.png') {
      db.collection('Collection').add({
        data: {
          name: that.data.array.name,
          detail: that.data.array.detail,
          fenlei: that.data.array.fenlei,
          img_src: that.data.array.img_src,
          price: that.data.array.price,
          id: that.data.array._id
        },
        success(res) {
          console.log("收藏成功", res);
        },
        fail(res) {
          console.log("收藏失败", res);
        }
      })
    } else if (that.data.shoucang[0] == '../me/img/shoucang.png') {
      db.collection('Collection').get({
        success(res) {
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i]._openid == that.data.openid && res.data[i].id == that.data.array._id) {
              wx.cloud.callFunction({
                name: 'deleteCollection',
                data: {
                  id: res.data[i]._id
                },
                success(res) {
                  console.log("删除成功");
                },
                fail(res) {
                  console.log("删除收藏失败", res);
                }
              })
            }
          }
        }
      })
    }
  },

  // 加入购物车
  addToShopping(res) {
    var that = this;
    var id = that.data.array._id;
    var array = that.data.array;
    var x = 0;
    var loginId = wx.getStorageSync('loginId')
    var goodsid = this.data.array._id

    db.collection('shopping_car').get({
      success(res) {
        console.log(res);
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i]._openid == that.data.openid && res.data[i].id == that.data.array._id) {
            wx.showToast({
              title: '您已重复添加',
            })
            x = 1;
          }
        }

        if (x == 0) {
          var loginId=wx.getStorageSync('loginId')
          delete array._id
          delete array._openid
          db.collection('shopping_car').add({
            data: {
              loginId,
              ...array,
              checked: true,
              num: 1,
              id: goodsid
            },
            success(res) {
              console.log("上传成功");
              wx.showToast({
                title: '成功加入购物车',
              })
            },
            fail(res) {
              console.log("上传失败", res);
            }
          })
        }
      }
    })

    // app.globalData.id = id;
    // console.log(app.globalData.id);
    // wx.switchTab({
    //   url: '../shopping/shopping',
    // })
    // console.log(that.data.array)
  },


  // select(res){
  //   var that = this;
  //   var id = res.currentTarget.dataset.id;
  //   console.log(id)
  //   if(id == 'left'){
  //     that.setData({
  //       left:false,
  //       right:true,
  //       left_bold:'bold',
  //       right_bold:''
  //     })
  //   }else if(id == 'right'){
  //     that.setData({
  //       left:true,
  //       right:false,
  //       left_bold:'',
  //       right_bold:'bold'
  //     })
  //   }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    wx.showLoading({
      title: '加载中',
    })
    console.log(id);
    wx.cloud.callFunction({
      name: 'selectProduct',
      data: {
        id: id
      },
      success(res) {
        console.log(res.result.data)
        that.setData({
          array: res.result.data[0]
        })
        wx.cloud.callFunction({
          name: 'OpenId',
          success(res) {
            that.setData({
              openid: res.result.openid
            })
            db.collection('Collection').get({
              success(res) {
                wx.hideLoading({
                  success: (res) => {},
                })
                for (var i = 0; i < res.data.length; i++) {
                  if (res.data[i]._openid == that.data.openid && res.data[i].id == that.data.array._id) {
                    var data = that.data.shoucang[1];
                    var shoucang = that.data.shoucang;
                    shoucang.pop();
                    shoucang.unshift(data);
                    that.setData({
                      shoucang: shoucang
                    })
                  }
                }
              }
            })
          }
        })
      }
    })
    // wx.cloud.callFunction({
    //   name: "lookup",
    //   data: {
    //     name: 'product_shopping',
    //     from: 'commentList',
    //     localField: '_id',
    //     foreignField: 'goodid',
    //     as: 'pinglun',
    //     match_name: '_id',
    //     match_value: id
    //   }
    // }).then(res => {
    //   console.log('评论数据',res)
    //   this.setData({
    //     pinglun: res.result.list[0].pinglun.reverse()
    //   })
    //   wx.hideLoading({
    //     success: (res) => {},
    //   })
    // })



    wx.cloud.callFunction({
      name: "lookup",
      data: {
        name: 'commentList',
        from: 'userList',
        localField: 'loginId',
        foreignField: '_id',
        as: 'userinfo',
        match_name: 'goodid',
        match_value: id
      }
    }).then(res => {
      console.log('用户信息加评论',res)
      this.setData({
        pinglun: res.result.list.reverse()
      })
      wx.hideLoading({
        success: (res) => {},
      })
    })
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