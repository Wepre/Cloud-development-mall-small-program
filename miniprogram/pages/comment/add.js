const db = wx.cloud.database();
const _ = db.command;
Page({
  data: {
    count: 5,
    active: 4,
  },
  getNowDate: function () {
    var date = new Date();
    var year = date.getFullYear() //年
    var month = date.getMonth() + 1 //月
    var day = date.getDate() //日
    var hour = date.getHours() //时
    var minute = date.getMinutes() //分
    var second = date.getSeconds() //秒
    var xiaoshi = "";
    if (hour < 10) {
      xiaoshi = "0" + hour;
    } else {
      xiaoshi = hour + "";
    }
    var fenzhong = "";
    if (minute < 10) {
      fenzhong = "0" + minute;
    } else {
      fenzhong = minute + "";
    }
    var miao = "";
    if (second < 10) {
      miao = "0" + second;
    } else {
      miao = second + "";
    }
    var time = year + '-' + month + '-' + day + ' ' + xiaoshi + ':' + fenzhong + ':' + miao
    return time
  },

  submit(e) {
    console.log(e);
    var comment = e.detail.value.comment
    wx.showModal({
      title: '提示',
      content: '是否要提交评论？',
      complete: (res) => {
        if (res.cancel) {

        }

        if (res.confirm) {
          // 提交评论
          var goodsname = this.data.res._id
          var loginId = wx.getStorageSync('loginId')
          console.log(goodsname);
          db.collection('commentList').add({
            data: {
              loginId,
              goodid: goodsname,
              time: this.getNowDate(),
              start: this.data.active + 1,
              comment,
            }
          }).then(res => {
            console.log(res)
            wx.showToast({
              title: '提交成功',
            })
            setTimeout(() => {
              wx.switchTab({
                url: '../me/me',
              })
            }, 1000);
          })

        }
      }
    })
  },
  click(e) {
    const {
      score,
      count
    } = this.data;
    const active = e.currentTarget.dataset.index;
    this.setData({
      active
    })
    this.triggerEvent("click", {
      result: score / count * active
    }, {})
  },
  onLoad(e) {
    console.log(e);
    var id = e.id
    var id2 = e.id2
    // if (id == 'undefined') {
    //   id = id2
    // }
    db.collection('product_shopping').doc(id).get().then(res => {
      console.log(res)
      this.setData({
        res: res.data
      })
      var orderid = wx.getStorageSync('orderid')
      var loginId = wx.getStorageSync('loginId')
      db.collection('commentList').where({

        goodid: this.data.res._id,
        loginId,
      }).get().then(res => {
        console.log(res)
        if (res.data.length>0) {
            // 说明评论过了
            this.setData({
              iscomment:true,
              commentinfo:res.data[0]

            })
        }
      })
    })
  },

})