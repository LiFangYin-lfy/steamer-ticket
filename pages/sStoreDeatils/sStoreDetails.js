import {
  request
} from "../../request/index.js"
const a = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    baseUrl: a.globalData.baseUrl,
    statusTop: a.globalData.statusHeight,
    imagesUrl: a.globalData.imagesUrl,
    four: 4,
    nine: 9,
    msg: '',
    details: {},
    detailsImg: [],
    content: '',
    comment: {}, // 评价
    duration: 2000,
    circular: true,
    goods_id: '',
    star: 3,
    showDialog: true,
    countNumber: 1,
    spec_list: [],
    spec_attr: [],
    spec_type: '',
    guiID: [],
    goods_sku_id: '',
    newPrice: '',
    pay_rule: {},
    use_rule: {},
    shopList: [],
    settled_id: '', // 店铺id
    goods_attr: '',
    count: 0,
    goods_num: 1,
    buy_time: '',
    startDate: '',
    endDate: '',
    openType: '',
    openvar: false,
    session_key: '',
    openid: '',
    code: '',
    notice: '',



  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    let buy_time = a.getToday()
    that.setData({
      goods_id: options.goods_id,
      buy_time
    })
    that.getDetails()

  },
  onShow: function () {
    let that = this
    let token = wx.getStorageSync('token')
    if (token) {
      that.getshopCount()
    }
  },
  goback() {
    wx.navigateBack()
  },
  consume() {},
  async getDetails() {
    let that = this
    let guiID = that.data.guiID
    let newPrice = that.data.newPrice
    let goods_attr = that.data.goods_attr
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/litestore.litestore_goods/detail',
        data: {
          goods_id: that.data.goods_id
        }
      })
      console.log(data, "商品详情");
      if (data.specData != null) {
        let spec_attr = data.specData.spec_attr
        let guiID = []
        if (spec_attr.length != 0) {
          spec_attr.forEach(item => {
            item.is_cloose = 1
            if (item.spec_items.length != 0) {
              item.spec_items.forEach(item1 => {
                item1.is_cloose = 0
              })
              item.spec_items[0].is_cloose = 1
              guiID.push(item.spec_items[0].item_id)
            }
          });
          let Str = guiID.join('_')
          data.specData.spec_list.forEach(item => {
            if (item.spec_sku_id == Str) {
              newPrice = item.form.goods_price
              goods_attr = item.goods_attr
            }
          });
          that.setData({
            spec_attr: spec_attr, // 多规格
            spec_list: data.specData.spec_list, // 多规格价格表
            guiID,
            newPrice,
            goods_sku_id: Str,
            goods_attr,
          })
          console.log(Str, "规格");
        }
      }
      that.setData({
        details: data.detail,
        notice: data.detail.notice.replace(/&nbsp;/g, '\xa0'),
        spec_type: data.detail.spec_type, // 判断单 10 /多 20 规格
        detailsImg: data.detail.imgs_url,
        content: data.detail.content.replace(/&nbsp;/g, '\xa0'),
        newPrice: data.detail.goods_price,
        comment: data.detail.comment
      })

      WxParse.wxParse('content', 'html', that.data.content, that, 5);
      WxParse.wxParse('notice', 'html', that.data.notice, that, 5);
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  onclickSelected(e) { //选规格e
    console.log(e);
    let that = this
    let newPrice = that.data.newPrice
    let send0 = e.currentTarget.dataset.index0;
    let send1 = e.currentTarget.dataset.index1
    let spec_attr = that.data.spec_attr
    let guiID = that.data.guiID
    let spec_list = that.data.spec_list
    spec_attr.forEach((value, index) => {
      if (send0 == index) {
        if (value.is_cloose == 1) {
          value.spec_items.forEach((value1, index1) => {
            if (send1 == index1) {
              value1.is_cloose = 1
              let x = guiID.indexOf(value1.item_id)
              if (x == -1) {
                guiID[send0] = value1.item_id
              }
              console.log(guiID[send0]);
            } else {
              value1.is_cloose = 0
            }
          });
        }
      }
    })
    let Str = guiID.join('_')
    console.log(Str);
    spec_list.forEach(item => {
      if (item.spec_sku_id == Str) {
        newPrice = item.form.goods_price
      }
    });
    console.log(newPrice);
    that.setData({
      spec_attr: spec_attr,
      guiID,
      newPrice,
      goods_sku_id: Str,
    })
    console.log(Str, "选规格");
  },
  async addstore() { // 加购
    let that = this
    try {
      const {
        data
      } = await request({
        url: 'api/litestore.litestore_cart/add',
        data: {
          goods_id: that.data.goods_id,
          goods_sku_id: that.data.goods_sku_id,
          goods_num: that.data.goods_num,
          date: that.data.buy_time,
        }
      })
      console.log(data);
      that.hideModal()
      a.popSuccessTest(data.msg)
      that.getshopCount()
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  buyStore() { // 购买
    let that = this
    let obj = {}

    // if (spec_type == 10) {
    if (obj.buy_time == '') {
      a.popTest('请选择时间')
      return
    }
    obj.date = that.data.buy_time
    obj.goods_num = that.data.goods_num
    obj.goods_id = that.data.goods_id
    obj.goods_sku_id = that.data.goods_sku_id

    console.log(obj);
    wx.navigateTo({
      url: '/pages/sStoreConfirm/sStoreConfirm?obj=' + JSON.stringify(obj) + '&is_buy=0'
    })
    that.hideModal()
    // }
  },
  countMinus() {
    let that = this
    let goods_num = that.data.goods_num
    if (goods_num != 1) {
      goods_num = goods_num - 1
      that.setData({
        goods_num
      })
    } else {
      goods_num = 1
      that.setData({
        goods_num,
        msg: '至少购买一件'
      })
      that.popTest()
    }
  },
  countPlus() {
    let that = this
    let goods_num = that.data.goods_num
    goods_num = goods_num + 1
    that.setData({
      goods_num
    })
  },
  async getshopCount() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/litestore.litestore_cart/getTotalNum',
        method: 'GET'
      })
      console.log(data);
      that.setData({
        count: data.cart_total_num
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  bindTimeChange(e) { // 时间
    this.setData({
      buy_time: e.detail.value
    })
  },
  clickOpen(e) {
    let that = this
    let type = e.currentTarget.dataset.type
    let token = wx.getStorageSync('token')
    if (token) {
      let startDate = a.getToday()
      let endDate = a.getOutDay()
      that.setData({
        openType: type,
        startDate,
        endDate
      })
      console.log(startDate, "当天");
      console.log(endDate, "30天后");
      that.showModal()
    } else {
      that.onClickOpen()
    }
  },
  onClickOpen() { // 打开登录弹窗
    let that = this
    that.setData({
      openvar: !that.data.openvar
    })
    console.log(that.data.openvar);
    let token = wx.getStorageSync('token')
    if (!token) {
      that.getLoginCode()
    }
  },
  showModal() { //显示对话框
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal() { //隐藏对话框
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  previewImage(e) { // 图片预览
    a.previewImage(e)
  },
  onShareAppMessage(options) {
    var that = this;
    var shareObj = {
      title: "船务购票",
      path: '/pages/sStoreDetails/sStoreDetails?goods_id=' + that.data.goods_id, // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
    };
    // 返回shareObj
    return shareObj;
  },
  async onCllected(e) { // 收藏
    let that = this
    let token = wx.getStorageSync('token')
    if (token) {
      try {
        const {
          data
        } = await request({
          url: 'api/litestore.litestore_goods/collect',
          data: {
            goods_id: e.currentTarget.dataset.goods_id
          }
        })
        console.log(data);
        if (data.code == 1) {
          a.popSuccessTest(data.msg)
          setTimeout(() => {
            that.getDetails()
          }, 800);
        }
      } catch (err) {
        console.log(err);
        a.popTest(err.msg)
      }
    } else {
      that.onClickOpen()
    }
  },
  onCarted() {
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/sShopCart/sShopCart'
      })
    } else {
      this.onClickOpen()
    }
  },
  payStore() {
    wx.navigateTo({
      url: '/pages/sStoreConfirm/sStoreConfirm'
    })
  },
  gosAllEvaluate(e) {
    let count = e.currentTarget.dataset.count
    if (count != 0) {
      wx.navigateTo({
        url: '/pages/sAllEvaluate/sAllEvaluate?goods_id=' + this.data.goods_id
      })
    } else {
      a.popTest('暂无更多评价')
    }

  },
  clickrule() { // 打开规格

  },
  getLoginCode() {
    let that = this
    wx.login({
      success(res) {
        console.log(res);
        if (res.code) {
          console.log(res.code);
          request({
            url: 'api/wechat/getSessionKey',
            data: {
              code: res.code
            },
            method: 'POST'
          }).then(res => {
            console.log(res.data.data);
            that.setData({
              session_key: res.data.data.session_key,
              openid: res.data.data.openid
            })
          }).catch(err => {
            console.log(err, "登录报错");
            a.popTest(err.msg)
          })
        }
      },

    })
  },
  async bindGetUserInfo(e) { // 授权登录
    let that = this
    console.log(e);
    try {
      const {
        data
      } = await request({
        url: 'api/wechat/login',
        method: "POST",
        data: {
          iv: e.detail.iv,
          encrypted_data: e.detail.encryptedData,
          session_key: that.data.session_key,
          openid: that.data.openid
        }
      })
      console.log(data);
      if (data.code == 1) {
        a.popSuccessTest(data.msg)
        wx.setStorageSync('token', data.data.token)
        that.onClickOpen()
      }
    } catch (err) {
      a.popTest('您拒绝了授权')
      console.log(err);
      if (err.code == 0) {
        that.onClickOpen()
      }
    }
  },





















  async public() {
    let that = this
    try {
      const {
        data
      } = await request({
        url: '',
        data: {

        }
      })
      console.log(data);
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },

  goLogin() {
    wx.showModal({
      title: '提示',
      content: '您尚未登录，前往登录',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            // url: '/pages/authorization/authorization'
          })

        } else {
          wx.switchTab({
            url: '/pages/home/home'
          })
        }
      }
    })
  },

})