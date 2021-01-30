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
    msg: '',
    idCard: '',
    goods_id: "",
    buy_time: "",
    goods_num: '',
    spec_type: '',
    goods_sku_id: '',
    details: {},
    is_buy: 0, // 0详情   1 购物车
    idList: [],
    detailList: [],
    total_price: '0', // 商品总额
    is_true: false,
    remark: '',
    content: '',
    notice: '',
  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    if (options.is_buy == 1) { // 购物车进来额
      that.setData({
        is_buy: options.is_buy,
        idList: JSON.parse(options.idList)
      })
      console.log(that.data.idList);
      that.getDetailList()
    } else { // 详情进来
      let obj = JSON.parse(options.obj)
      that.setData({
        goods_id: obj.goods_id,
        buy_time: obj.date,
        goods_num: obj.goods_num,
        goods_sku_id: obj.goods_sku_id,
        is_buy: options.is_buy,
      })
      that.getStoreDetail(obj)
    }
  },
  onShow: function () {},
  goback() {
    wx.navigateBack()
  },

  getIdcard(e) {
    let that = this
    console.log(e.detail.value);
    let idCard = e.detail.value
    that.setData({
      idCard,
    })

  },
  getTextarea(e) {
    console.log(e.detail.value);
    this.setData({
      remark: e.detail.value
    })
  },
  async getStoreDetail(obj) {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/litestore.litestore_order/buyNow',
        data: obj
      })
      console.log(data);
      if (data.goods_list.length != 0) {
        data.goods_list.forEach(item => {
          item.person_info = ''
        });
      }
      console.log(data.goods_list[0].business_notice)
      that.setData({
        detailList: data.goods_list,
        total_price: data.order_pay_price,
        // content: data.goods_list[0].notice
        notice: data.goods_list[0].business_notice,

      })
      console.log(that.data.notice);
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async getDetailList() { // 购物车
    let that = this
    let obj = [...that.data.idList]
    console.log(obj);
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/litestore.litestore_cart/getlists',
        method: 'POST',
        data: obj
      })
      console.log(data);
      let obj = ''
      if (data.goods_list.length != 0) {
        data.goods_list.forEach(item => {
          item.person_info = ''
        });
        for (let index = 0; index < data.goods_list.length; index++) {
          if (data.goods_list[index].business_notice != '') {
            obj = data.goods_list[index].business_notice
          }
        }
      }

      that.setData({
        detailList: data.goods_list,
        total_price: data.order_pay_price,
        notice: obj.replace(/&nbsp;/g, '\xa0')
      })
      console.log(that.data.detailList);
      // WxParse.wxParse('content', 'html', that.data.content, that, 5);

    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  nameBlur(e) { // 填写姓名
    let that = this
    let names = e.detail.value
    let send = e.currentTarget.dataset.index
    let detailList = that.data.detailList
    if (names != '') {
      detailList.forEach((item, index) => {
        if (index == send) {
          item.name = names
        }
      })
      that.setData({
        detailList
      })
    } else {
      a.popTest('请输入姓名')
      return
    }
    console.log(detailList, "detailList_姓名");
  },
  getIdnumber(e) { // 填写身份证
    let that = this
    console.log(e.detail.value, "blur");
    let id_number = a.setIdcard(e.detail.value)
    if (id_number) {
      let send = e.currentTarget.dataset.index
      let detailList = that.data.detailList
      detailList.forEach((item, index) => {
        if (index == send) {
          item.id_number = id_number
        }
      })
    }
  },
  areatext(e) {
    let that = this
    console.log(e.detail.value, "blur");
    let index = e.currentTarget.dataset.index
    let detailList = that.data.detailList
    detailList[index].person_info = e.detail.value
    that.setData({
      detailList
    })

  },
  async cartPay() { // 购物车下单支付 付款
    let that = this
    let data_ary = []
    that.setData({
      is_true: true
    })
    if (that.data.remark == '') {
      a.popTest('请输入姓名及联系方式')
      return
    }
    let detailList = that.data.detailList
    detailList.forEach((item, index) => {
      let ary = {}
      ary.person_info = item.person_info
      ary.goods_id = item.goods_id
      ary.goods_sku_id = item.goods_sku_id
      data_ary.push(ary)
    })

    console.log(data_ary);
    try {
      const {
        data
      } = await request({
        url: 'api/litestore.litestore_order/cart_pay',
        data: {
          data: data_ary,
          remark: that.data.remark
        },
        method: 'POST'
      })
      console.log(data);
      if (data.code == 1) {
        let obj = {}
        obj.order_no = data.data.order_no
        obj.datetime = data.data.datetime
        obj.order_id = data.data.order_id
        console.log(obj);
        wx.requestPayment({
          timeStamp: data.data.timestamp,
          nonceStr: data.data.nonceStr,
          package: data.data.package,
          signType: 'MD5',
          paySign: data.data.paySign,
          appId: data.data.appId,
          success(res) {
            console.log(res);
            wx.redirectTo({
              url: '/pages/sOrderSuccess/sOrderSuccess?oj=' + JSON.stringify(obj)
            })
            that.setData({
              is_true: false
            })
          },
          fail(res) {
            console.log(res)
            that.setData({
              is_true: false
            })
            wx.redirectTo({
              url: '/pages/myOrder/myOrder?is_nav=1' + '&status=1'
            })
          }
        })
      }
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
      that.setData({
        is_true: false
      })
    }
  },
  async detailPay() { // 详情下单支付  付款
    let that = this
    let detailList = that.data.detailList
    let data_ary = []
    let ary = {}
    detailList.forEach((item, index) => {
      console.log(item);
      ary.person_info = item.person_info
      ary.goods_id = item.goods_id
      ary.goods_sku_id = item.goods_sku.spec_sku_id
      data_ary.push(ary)
    })
    ary.goods_num = that.data.goods_num
    ary.date = that.data.buy_time
    ary.remark = that.data.remark
    if (ary.remark == '') {
      a.popTest('请输入姓名及联系方式')
      return
    }

    console.log(ary, "shujui");
    try {
      const {
        data
      } = await request({
        url: 'api/litestore.litestore_order/buyNow_pay',
        data: ary,
        method: 'POST'
      })
      console.log(data);
      if (data.code == 1) {
        let obj = {}
        obj.order_no = data.data.order_no
        obj.datetime = data.data.datetime
        obj.order_id = data.data.order_id
        console.log(obj);
        wx.requestPayment({
          timeStamp: data.data.timestamp,
          nonceStr: data.data.nonceStr,
          package: data.data.package,
          signType: 'MD5',
          paySign: data.data.paySign,
          appId: data.data.appId,
          success(res) {
            console.log(res);
            wx.redirectTo({
              url: '/pages/sOrderSuccess/sOrderSuccess?oj=' + JSON.stringify(obj)
            })
            that.setData({
              is_true: false
            })
          },
          fail(res) {
            console.log(res)
            that.setData({
              is_true: false
            })
            wx.redirectTo({
              url: '/pages/myOrder/myOrder?is_nav=1' + '&status=1'
            })
          }
        })
      }
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
      that.setData({
        is_true: false
      })
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
  popSuccessTest() {
    wx.showToast({
      title: this.data.msg,
      icon: '', //默认值是success,就算没有icon这个值，就算有其他值最终也显示success
      duration: 1300, //停留时间
    })
  },
  popTest() {
    wx.showToast({
      title: this.data.msg,
      icon: 'none', //如果要纯文本，不要icon，将值设为'none'
      duration: 1300
    })
  },
})