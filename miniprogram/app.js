//app.js
App({
  onLaunch: function () {
    // 获取手机系统信息
    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.globalData.navHeight = res.statusBarHeight + 46;
      },
      fail(err) {
        console.log(err);
      }
    })
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'c-2gc58cs365fab875',
        traceUser: true,
      })
    }
    const db = wx.cloud.database()
    wx.cloud.callFunction({
      name: 'OpenId'
    }).then(res => {
      console.log(res);
      var openid = res.result.openid
      wx.cloud.database().collection('userList').where({
        _openid: openid
      }).get().then(res => {
        console.log('查userList表', res);
        if (res.data.length == 0) {
          // 说明无用户
          db.collection("userList").add({
            data: {
              name: '用户',
              image: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg9.doubanio.com%2Fview%2Fgroup_topic%2Fl%2Fpublic%2Fp515054775.jpg&refer=http%3A%2F%2Fimg9.doubanio.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1707115234&t=e8967652df942e93bd89c1821974217f",
              phone: '131**1109'
            }
          }).then(res => {
            console.log('新建用户成功', res);
            wx.setStorageSync('loginId', res._id)
          })
        } else {
          // 说明已经有账户
          var data = res.data[0]._id
          wx.setStorageSync('loginId', data)
        }
      })
    })
  },
  globalData: {
    name: '',
    // 可以直接在这里修改分类名和图标
    fenlei:[{
        img: 'https://img2.baidu.com/it/u=1692797101,2200390920&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=541',
        name: '新鲜上市',
        id:0
      },
      {
        img: 'https://img0.baidu.com/it/u=4088565179,3533587629&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
        name: '果农优选',
        id:1
      },
      {
        img: 'https://img2.baidu.com/it/u=1212559602,494420097&fm=253&fmt=auto&app=138&f=JPEG?w=749&h=500',
        name: '甄选果礼',
        id:2
      },
      {
        img: 'https://img2.baidu.com/it/u=1533498504,997303029&fm=253&fmt=auto&app=138&f=JPEG?w=312&h=414',
        name: '优惠专项',
        id:3
      },

    ],
  }
})