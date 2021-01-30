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
    four: 14,
    msg: '',
    showDialog: false,
    listError: '正在占座中，预计需5-10分钟，期间可能会占座失败，失败后金额原路退回',
    id: '',
    fillOrder: {},
    fill_line: {},
    half_price: '',
    total_price: 0,
    look_true: false,
    idArr: [], //乘客id 
    phone: '',
    ticket_price: '',
    ary_obj: {},
    mobile: '',
    arrivalHarbourName: '',
    departureHarbourName: '',
    week: '',
    is_pay: false

  },
  onLoad: function (options) {
    let that = this
    this.nowInDateBetwen()
    console.log(options);
    if (options.qiang == 1) { // 抢票
      let obj = JSON.parse(options.obj)
      let week = a.getWeek(new Date(obj.date))
      console.log(week);
      console.log(obj);
      that.setData({
        ary_obj: obj,
        ticket_price: options.ticket_price,
        qiang: options.qiang,
        id: obj.line_rob_cabin_id,
        ticket_name: obj.ticket_name,
        half_price: options.ticket_price * 0.5,
        week,
      })
    } else { //  购票
      that.setData({
        id: options.id,
        qiang: options.qiang
      })
      that.getfillOrder()
    }


  },
  onShow: function () {
    let that = this
    that.getList()
    that.telPhone()
  },

  goback() {
    wx.navigateBack()
  },
  toggleDialog() {
    this.setData({
      showDialog: !this.data.showDialog
    })
  },
  toggleDialog2() {
    this.setData({
      showDialog: !this.data.showDialog
    })
    // if (this.is_pay) {

    // } else {
    //   this.payoff()
    // }
    wx.redirectTo({
      url: '/pages/myOrder/myOrder?is_nav=0' + '&status=0'
    })
  },
  toggleDialog3() {
    this.setData({
      showDialog: !this.data.showDialog
    })
    wx.redirectTo({
      url: '/pages/myOrder/myOrder?is_nav=0' + '&status=0'
    })
    // if (this.is_pay) {

    // // } else {
    // //   this.payoff()
    // }

  },
  setTrue() {
    let that = this
    let list = that.data.list
    let idArr = []
    list.forEach(item => {
      if (item.it_cloose == true) {
        idArr.push(item.id)
      }
    })
    console.log(idArr);
    that.setData({
      idArr
    })
    that.hideModal()
    if (idArr.length != 0) {
      if (that.data.qiang == 0) {
        that.getTotalPri(idArr)
      } else {
        that.getTotalPrc(idArr)
      }
    }
  },
  TofillAddOrder() {
    wx.navigateTo({
      url: '/pages/fillAddOrder/fillAddOrder'
    })
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
  async getfillOrder() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/line.line_order/order',
        data: {
          line_cabin_id: that.data.id
        }
      })
      console.log(data);
      that.setData({
        fillOrder: data,
        fill_line: data.line,
        half_price: data.fullTicketPrice * 0.5,
        ticket_price: data.fullTicketPrice,
        arrivalHarbourName: data.line.arrivalHarbourName,
        departureHarbourName: data.line.departureHarbourName,

      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async getTtotalPrice() { // 获取订单价格
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/line.line_order/price',
        data: {
          line_cabin_id: that.data.id,
          line_member_id: ''
        }
      })
      console.log(data);
      that.setData({
        totalPrice: data
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async getList() { //乘客列表 
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/line.line_member/getList',
      })
      console.log(data);
      if (data.length != 0) {
        data.forEach(item => {
          item.it_cloose = false
        });
      }
      that.setData({
        list: data
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async getTotalPri(idArr) { //获取订单价格
    let that = this
    let Str = idArr.join(',')
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/line.line_order/price',
        data: {
          line_cabin_id: that.data.id,
          line_member_id: Str
        }
      })
      console.log(data);
      that.setData({
        total_price: data
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async getTotalPrc(idArr) { //获取抢票订单价格
    let that = this
    let Str = idArr.join(',')
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/line.line_order/robPrice',
        data: {
          price: that.data.ticket_price,
          rob_ball: that.data.ary_obj.ticket_number,
          line_member_id: Str
        }
      })
      console.log(data);
      that.setData({
        total_price: data
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  clickOpen() {
    this.showModal()
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
  changedPer(e) {
    let that = this
    let send = e.currentTarget.dataset.index
    let list = that.data.list
    list.forEach((item, index) => {
      if (index == send) {
        if (item.it_cloose == true) {
          item.it_cloose = false
        } else {
          item.it_cloose = true
        }
      }
    })
    that.setData({
      list
    })
  },
  getEditor(e) {
    wx.navigateTo({
      url: '/pages/fillAddOrder/fillAddOrder?line_member_id=' + e.currentTarget.dataset.id
    })
  },
  phoneInput(e) {
    let that = this
    that.setData({
      phone: e.detail.value
    })
  },
  changeTrue() {
    this.setData({
      look_true: !this.data.look_true
    })
  },
  nowInDateBetwen() {
    const start_itmes = new Date(new Date(new Date().toLocaleDateString()).getTime() + 8 * 60 * 60 * 1000);
    console.log(new Date(new Date().toLocaleDateString()).getTime() + 8 * 60 * 60 * 1000);
    console.log(start_itmes); //Mon Dec 04 2017 00:00:00 GMT+0800 (中国标准时间)

    const end_itmes = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1800000);
    console.log(end_itmes); //Mon Dec 04 2017 23:59:59 GMT+0800 (中国标准时间)
  },
  trueOrder() { // 购票
    let that = this
    let new_time = new Date().getTime()
    let start_itmes = new Date(new Date().toLocaleDateString()).getTime() + 8 * 60 * 60 * 1000
    let end_itmes = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1800000;
    console.log(start_itmes);
    console.log(end_itmes);
    if (new_time < start_itmes) {
      that.setData({
        listError: '23:30-8:00期间服务器维护，在此期间单为排队占座，待服务器开放后如占座失败，金额原路返回',
        is_pay: true
      })
      that.toggleDialog()
    } else if (new_time > end_itmes) {
      that.setData({
        listError: '23:30-8:00期间服务器维护，在此期间单为排队占座，待服务器开放后如占座失败，金额原路返回',
        is_pay: true
      })
      that.toggleDialog()
    } else {
      that.setData({
        listError: '正在占座中，预计需5-10分钟，期间可能会占座失败，失败后金额原路退回',
      })
      that.toggleDialog()
    }
  },
  async payoff() {
    let that = this
    let idArr = that.data.idArr
    console.log(idArr);
    let look_true = that.data.look_true
    let phone = a.setPhone(that.data.phone)
    console.log(phone);
    if (idArr.length == 0) {
      a.popTest('请选择乘客')
      return false
    } else if (!look_true) {
      a.popTest('请勾选服务协议')
      return false
    }
    if (phone) {
      let Str = idArr.join(',')
      try {
        const {
          data
        } = await request({
          url: 'api/line.line_order/buyNowPay',
          data: {
            line_cabin_id: that.data.id,
            line_member_id: Str,
            mobile: phone
          },
          method: 'POST'
        })
        console.log(data);
        if (data.code == 1) {
          wx.requestPayment({
            timeStamp: data.data.timestamp,
            nonceStr: data.data.nonceStr,
            package: data.data.package,
            signType: 'MD5',
            paySign: data.data.paySign,
            appId: data.data.appId,
            success(res) {
              console.log(res);
              that.trueOrder()
            },
            fail(res) {
              console.log(res)
              // 未支付成功。跳转我的订单dai支付
              wx.navigateTo({
                url: '/pages/myOrder/myOrder?is_nav=0' + '&status=10'
              })
            }
          })
        }
      } catch (err) {
        console.log(err);
        a.popTest(err.msg)
      }
    }
  },
  async qiangoff() {
    let that = this
    let ary_obj = that.data.ary_obj
    let idArr = that.data.idArr
    let look_true = that.data.look_true
    let phone = a.setPhone(that.data.phone)
    console.log(phone);
    if (idArr.length == 0) {
      a.popTest('请选择乘客')
      return false
    } else if (!look_true) {
      a.popTest('请勾选服务协议')
      return false
    }
    if (phone) {
      let Str = idArr.join(',')
      ary_obj.line_member_id = Str
      ary_obj.mobile = phone
      try {
        const {
          data
        } = await request({
          url: 'api/line.line_order/robNowPay',
          data: ary_obj
        })
        console.log(data);
        if (data.code == 1) {
          wx.requestPayment({
            timeStamp: data.data.timestamp,
            nonceStr: data.data.nonceStr,
            package: data.data.package,
            signType: 'MD5',
            paySign: data.data.paySign,
            appId: data.data.appId,
            success(res) {
              console.log(res);
              that.qiangPay()
            },
            fail(res) {
              console.log(res)
              // 未支付成功。跳转我的订单dai支付
              wx.navigateTo({
                url: '/pages/myOrder/myOrder?is_nav=0' + '&status=10'
              })
            }
          })
        }
      } catch (err) {
        console.log(err);
        a.popTest(err.msg)
      }
    }
  },


  async qiangPay() { // 抢票下单支付
    let that = this
    let new_time = new Date().getTime()
    let start_itmes = new Date(new Date().toLocaleDateString()).getTime() + 8 * 60 * 60 * 1000
    let end_itmes = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1800000;
    console.log(start_itmes);
    console.log(end_itmes);
    if (new_time < start_itmes) {
      that.setData({
        listError: '23:30-8:00期间服务器维护，在此期间单为排队占座，待服务器开放后如占座失败，金额原路返回'
      })
      that.toggleDialog()
    } else if (new_time > end_itmes) {
      that.setData({
        listError: '23:30-8:00期间服务器维护，在此期间单为排队占座，待服务器开放后如占座失败，金额原路返回'
      })
      that.toggleDialog()
    } else {
      that.setData({
        listError: '正在占座中，预计需5-10分钟，期间可能会占座失败，失败后金额原路退回',
      })
      that.toggleDialog()
    }

  },
  goOrderRule() {
    wx.navigateTo({
      url: '/pages/detailPage/detailPage?type=6'
    })
  },
  async telPhone() { // 系统配置客服电话
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/common/getConfig',
        data: {
          type: 4
        }
      })
      console.log(data);

      that.setData({
        mobile: data.service_mobile
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },



})