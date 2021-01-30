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
    four: 5,
    msg: '',
    is_selected: 0,
    op_obj: '',
    ticket_box: [],
    tuiList: [],
    per_page: 2,
    day: 4,
    dataArr: [],
    is_no_ticket: 2, //  有船没船
    ress_type: '',
    bd_count: '',
    no_sale: true, // 用来展示船票是否开售
    goods_id: '',
    vad: 0,
    lat: '',
    lng: '',
  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    let ary = JSON.parse(options.obj)
    console.log(ary);
    let startDate = new Date(ary.date);
    let endDate = new Date(ary.date)
    let day = that.data.day
    let newDate = new Date()
    let new2Date = new Date()
    let dataArr = a.getnetDate(startDate, endDate, day)
    let dataAry = a.getnetDate(newDate, new2Date, 30)
    // console.log(dataAry);
    let ster = ary.date.slice(5)
    if (dataAry.length != 0) {
      var bd_count = new Date(dataAry.slice(-1)[0].yearDate).getTime()
      console.log(dataAry.slice(-1)[0].yearDate);
      console.log(bd_count);
      that.setData({
        bd_count
      })
    }
    if (dataArr.length != 0) {
      dataArr.forEach((item, index) => {
        if (ster == item.date) {
          that.setData({
            is_selected: index
          })
        }
      });
      that.setData({
        dataArr,
      })
    }
    if (ary.start_name == '涠洲') {
      that.setData({
        ress_type: 2,
        vad: 1,

      })
    } else {
      that.setData({
        ress_type: 3,
        vad: 0,
      })
    }
    console.log(that.data.vad, "ress_type");
    that.setData({
      op_obj: ary,
    })
    console.log(dataArr);
    that.ticketQuery()

  },
  vageClick(e) { // 切换航程
    let that = this
    let vad = e.currentTarget.dataset.vad
    let op_obj = that.data.op_obj
    if (vad == 0) {
      op_obj.start_name = '北海'
      op_obj.end_name = "涠洲"
      that.setData({
        vad: 0,
        op_obj,
        ress_type: 3
      })
    } else {
      op_obj.start_name = '涠洲'
      op_obj.end_name = "北海"
      that.setData({
        vad: 1,
        op_obj,
        ress_type: 2
      })
    }
    console.log(op_obj);
    that.ticketQuery()
    that.getConfig()
  },
  onShow: function () {
    let that = this
    that.getTuijie()
    that.getConfig()
    that.getConfigId()
  },
  goback() {
    wx.navigateBack()
  },
  changeDate(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let bd_count = Number(that.data.bd_count)
    let op_obj = that.data.op_obj
    let dataArr = that.data.dataArr
    op_obj.date = dataArr[index].yearDate
    let count = Number(new Date(dataArr[index].yearDate).getTime())
    console.log(bd_count);
    console.log(count);
    if (bd_count < count) {
      console.log(120);
      that.setData({
        no_sale: false
      })
    } else {
      that.setData({
        no_sale: true
      })
    }
    console.log(op_obj);
    that.setData({
      is_selected: index,
      op_obj,
    })
    that.ticketQuery()

  },
  lookedNext() { //查看下一天航班
    let that = this
    let is_selected = that.data.is_selected
    let op_obj = that.data.op_obj
    console.log(op_obj);
    let dataArr = that.data.dataArr
    if (is_selected != dataArr.length) {
      is_selected = is_selected + 1
      op_obj.date = dataArr[is_selected].yearDate
      let bd_count = Number(that.data.bd_count)
      let count = Number(new Date(dataArr[is_selected].yearDate).getTime())
      if (bd_count < count) {
        that.setData({
          no_sale: false
        })
      } else {
        that.setData({
          no_sale: true
        })
      }
    }
    console.log(op_obj);
    console.log(dataArr);
    that.setData({
      is_selected: is_selected,
      op_obj,
    })
    that.ticketQuery()
  },
  clickSubscribe() { //点击链接预约为开售航班
    wx.navigateTo({
      url: '/pages/sStoreDeatils/sStoreDetails?goods_id=' + this.data.goods_id
    })
  },
  goOptionCalendar() { //全部日期
    let that = this
    let obj = that.data.op_obj
    wx.navigateTo({
      url: '/pages/optionCalendar/optionCalendar?obj=' + JSON.stringify(obj)
    })
  },
  ticketDetail(e) { // 票务详情
    let that = this
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/optionDetail/optionDetail?id=' + id
    })
  },
  async ticketQuery() { // 查询
    let that = this
    let obj = that.data.op_obj;
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/line.line/getList',
        data: obj
      })
      console.log(data);
      that.setData({
        ticket_box: data
      })
    } catch (err) {
      console.log(err);
      // a.popTest(err.msg)
      if (err.code == -1) {
        that.setData({
          // msg: '今日已无船可发',
          is_no_ticket: 1,
          no_sale: true,
          ticket_box: [],
        })

      } else if (err.code == -2) {
        that.setData({
          is_no_ticket: 0,
          ticket_box: [],
          no_sale: true

        })
      } else if (err.code == -3) {
        that.setData({
          is_no_ticket: 0,
          ticket_box: [],
          no_sale: false
        })
      }
    }
  },
  async getTuijie() { // 推荐购买
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/litestore.litestore_goods/hotList',
        data: {
          per_page: that.data.per_page
        }
      })
      console.log(data);
      that.setData({
        tuiList: data
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  goToDeatils(e) {
    let id = e.currentTarget.dataset.goods_id
    wx.navigateTo({
      url: '/pages/sStoreDeatils/sStoreDetails?goods_id=' + id
    })
  },
  goRobTickets() {
    wx.navigateTo({
      url: '/pages/robTickets/robTickets?obj=' + JSON.stringify(this.data.op_obj)
    })

  },
  goclickmap() {
    let that = this
    wx.openLocation({
      latitude: that.data.lat,
      longitude: that.data.lng,
      success(res) {
        console.log(res);
      }
    })
  },
  gonavHome() {
    wx.switchTab({
      url: '/pages/navHome/navHome'
    })
  },

  async getConfig() { // 系统配置
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/common/getConfig',
        data: {
          type: that.data.ress_type
        }
      })
      console.log(data);

      if (that.data.ress_type == 2) {
        that.setData({
          ress: data.weizhou,
          lat: Number(data.weizhou.lat),
          lng: Number(data.weizhou.lng),
        })
      } else {
        that.setData({
          ress: data.beihai,
          lat: Number(data.beihai.lat),
          lng: Number(data.beihai.lng),
        })
      }

      console.log(that.data.lat, that.data.lng);
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)

    }
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
      wx.makePhoneCall({
        phoneNumber: data.service_mobile
      })
      that.setData({})
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async getConfigId() { // 系统配置 商品详情id
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/common/getConfig',
        data: {
          type: 10
        }
      })
      console.log(data);
      that.setData({
        goods_id: data.goods_id
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },












  async public() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: '',
        data: {
          goods_id: that.data.goods_id
        }
      })
      console.log(data);
      that.setData({
        public: data
      })
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
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