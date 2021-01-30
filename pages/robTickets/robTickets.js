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
    four: 2,
    msg: '',
    speeder: [{
      id: 1,
      names: '2个/张（成功几率+20%）',
      is_true: false
    }, {
      id: 2,
      names: '4个/张（成功几率+40%）',
      is_true: false
    }, {
      id: 3,
      names: '6个/张（成功几率+60%）',
      is_true: false
    }],
    date_time: [{
      id: 1,
      names: '8:00-13:00',
      is_true: false
    }, {
      id: 2,
      names: '13:00-19:00',
      is_true: false
    }, {
      id: 3,
      names: '8:00-19:00',
      is_true: false
    }],
    rob_time: [],
    line_rob_cabin: [],
    rob_ball: [],
    content: '',
    rob_end_time: [],
    rob_time_id: '',
    line_rob_cabin_id: '',
    rob_ball_id: '',
    rob_end_time_id: '',
    ticket_price: '',
    ticket_name: '',
    rob_ball_name: '',
    ticket_ratio: '',
    ticket_number: '',
    date: '',
    start: '',
    end: '',
    tip_item: '',

  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    let option = JSON.parse(options.obj)
    that.setData({
      date: option.date,
      start: option.start_name,
      end: option.end_name,
    })
    that.getRob()
  },
  onShow: function () {},
  goback() {
    wx.navigateBack()
  },
  async getRob() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/line.line/rob'
      })
      console.log(data);
      if (data.rob_time.length != 0) {
        data.rob_time.forEach(item => {
          item.is_true = false
        });
        data.rob_time[0].is_true = true
        that.setData({
          rob_time_id: data.rob_time[0].time
        })
      }
      if (data.line_rob_cabin.length != 0) {
        data.line_rob_cabin.forEach(item => {
          item.is_true = false
        });

        // data.line_rob_cabin[0].is_true = true
        that.setData({
          is_true: 0,
          // line_rob_cabin_id: data.line_rob_cabin[0].id,
          // ticket_name: data.line_rob_cabin[0].name,
          // ticket_price: data.line_rob_cabin[0].price,
          ticket_ratio: Number(data.rob_ball[0].number) * 10,
          ticket_number: Number(data.rob_ball[0].number)
        })
      }
      if (data.rob_ball.length != 0) {
        data.rob_ball.forEach(item => {
          item.is_true = false
        });
        data.rob_ball[0].is_true = true
        that.setData({
          rob_ball_id: data.rob_ball[0].number,
          rob_ball_name: data.rob_ball[0].text
        })
      }
      if (data.rob_end_time.length != 0) {
        data.rob_end_time.forEach(item => {
          item.is_true = false
        });
        data.rob_end_time[0].is_true = true
        that.setData({
          rob_end_time_id: data.rob_end_time[0].text,
        })
      }

      that.setData({
        robList: data,
        rob_time: data.rob_time,
        line_rob_cabin: data.line_rob_cabin,
        rob_ball: data.rob_ball,
        content: data.rob_content.replace(/&nbsp;/g, '\xa0'),
        rob_end_time: data.rob_end_time,
      })
      WxParse.wxParse('content', 'html', that.data.content, that, 5);
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  changedRob(e) { //选择时段
    let that = this
    let send = e.currentTarget.dataset.index
    let rob = that.data.rob_time
    rob.forEach((item, index) => {
      item.is_true = false
      if (send == index) {
        item.is_true = true
        that.setData({
          rob_time_id: item.time
        })
      }
    })
    that.setData({
      rob_time: rob
    })
    console.log(that.data.rob_time_id, "选择时段");
  },
  changedBall(e) { //成功率
    let that = this
    let send = e.currentTarget.dataset.index
    let rob = that.data.rob_ball
    console.log(send);
    rob.forEach((item, index) => {
      item.is_true = false
      if (send == index) {
        item.is_true = true
        that.setData({
          rob_ball_id: item.number,
          rob_ball_name: item.text,
          ticket_ratio: Number(item.number) * 10,
          ticket_number: Number(rob[0].number)

        })
      }
    })
    console.log(that.data.ticket_ratio, "比例");
    that.setData({
      rob_ball: rob
    })
    console.log(that.data.rob_ball_id, "成功率");

  },
  changedCabin(e) { //仓位
    let that = this
    let send = e.currentTarget.dataset.index
    let rob = that.data.line_rob_cabin
    that.setData({
      is_true: 1
    })
    rob.forEach((item, index) => {
      item.is_true = false
      if (send == index) {
        item.is_true = true
        that.setData({
          line_rob_cabin_id: item.id,
          ticket_price: item.price,
          ticket_name: item.name,
          tip_item: item.tip

        })
      }
    })
    that.setData({
      line_rob_cabin: rob
    })
    console.log(that.data.rob_ball_id, that.data.ticket_price, "仓位");

  },
  changedTime(e) { //截至时间
    let that = this
    let send = e.currentTarget.dataset.index
    let rob = that.data.rob_end_time
    rob.forEach((item, index) => {
      item.is_true = false
      if (send == index) {
        item.is_true = true
        that.setData({
          rob_end_time_id: item.text,
        })
      }
    })
    that.setData({
      rob_end_time: rob
    })
    console.log(that.data.rob_end_time_id, "截至事件");

  },

  goNext() { // 下一步
    let that = this
    let obj = {}
    obj.date = that.data.date
    obj.start = that.data.start
    obj.end = that.data.end
    obj.rob_time = that.data.rob_time_id
    obj.rob_ball = that.data.rob_ball_id
    obj.rob_end_time = that.data.rob_end_time_id
    obj.ticket_name = that.data.ticket_name
    obj.ticket_number = that.data.ticket_number
    if (that.data.line_rob_cabin_id != '') {
      obj.line_rob_cabin_id = that.data.line_rob_cabin_id
    } else {
      a.popTest('请选择舱位')
      return
    }
    console.log(obj);
    wx.navigateTo({
      url: '/pages/fillOrder/fillOrder?obj=' + JSON.stringify(obj) + '&qiang=1' + '&ticket_price=' + that.data.ticket_price
    })
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