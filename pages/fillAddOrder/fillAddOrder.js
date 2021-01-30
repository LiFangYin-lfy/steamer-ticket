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
    idType: [],
    names: '',
    IDcard: '',
    type_name: '',
    tick_name: '',
    TicketType: [],
    line_member_id: '',
    add_editor: 1,
    tick: {},
    buy_text: '',


  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    if (options.line_member_id) {
      that.setData({
        line_member_id: options.line_member_id || '',
        add_editor: 2
      })
      that.Passengerdetails()
      console.log('我被执行了');
    } else {
      that.setData({
        add_editor: 1
      })
    }
    that.getConfiguration()
    that.getTicketType()
    that.getConfiguratd()
  },
  onShow: function () {},
  goback() {
    wx.navigateBack()
  },
  submitOrder(e) {
    let that = this
    console.log(e);
    console.log(e.detail.value, "表单提交");
    let button = e.detail.target.dataset.button
    let obj = e.detail.value
    let add_editor = that.data.add_editor
    let TicketType = that.data.TicketType
    let newObj = {}
    TicketType.forEach(item => {
      if (item.name == obj.tick_name) {
        newObj.line_type_id = item.id
      }
    });
    if (obj.name == '') {
      a.popTest('姓名不能为空')
      return false
    } else if (obj.type_name == '身份证') {
      let idcard = a.setIdcard(obj.IDcard)
      newObj.number = idcard
    } else if (obj.IDcard == '') {
      a.popTest('证件号码不能为空')
      return false
    } else {
      newObj.number = obj.IDcard
    }
    newObj.name = obj.names;
    newObj.type = obj.type_name;
    console.log(newObj, "新对象");
    if (add_editor == 1) {
      that.addSubOrder(newObj, button)
    } else {
      that.editorSubOrder(newObj)
    }
  },
  async getConfiguration() { //获取配置
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/common/getConfig',
        data: {
          type: '1'
        }
      })
      console.log(data);
      that.setData({
        idType: data.member_type,
        type_name: data.member_type[0].name
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async getConfiguratd() { //获取配置购票须知
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/common/getConfig',
        data: {
          type: '5'
        }
      })
      console.log(data);
      that.setData({
        buy_text: data.buy_text
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async getTicketType() { //船票类型
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/line.line_type/getList',
      })
      console.log(data);
      that.setData({
        TicketType: data,
        tick_name: data[0].name
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async addSubOrder(newObj, button) { //添加乘客
    let that = this
    try {
      const {
        data
      } = await request({
        url: 'api/line.line_member/add',
        data: newObj
      })
      console.log(data);
      a.popSuccessTest(data.msg)
      if (button != 1) { // 完成并继续添加乘客
        wx.navigateBack()
      } else {
        that.setData({
          names: '',
          // tick_name: '',
          // type_name: '',
          IDcard: '',
        })
      }
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async editorSubOrder(newObj) { //编辑乘客
    let that = this
    let obj = newObj
    obj.line_member_id = that.data.line_member_id
    try {
      const {
        data
      } = await request({
        url: 'api/line.line_member/edit',
        data: obj
      })
      console.log(data);
      a.popSuccessTest(data.msg)
      setTimeout(() => {
        wx.navigateBack()
      }, 1000);
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async Passengerdetails() { // 乘客详情 
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/line.line_member/getInfo',
        data: {
          line_member_id: that.data.line_member_id
        }
      })
      console.log(data);
      that.setData({
        tick: data,
        names: data.name,
        IDcard: data.number,
        type_name: data.type,
        tick_name: data.line_type.name,
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  cli() {
    console.log('我哦耶执行了');
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
  bindTickChange(e) {
    console.log(e.detail.value);
    let that = this
    let TicketType = that.data.TicketType
    this.setData({
      tick_name: TicketType[e.detail.value].name
    })
  },
  bindIdChange(e) {
    console.log(e.detail.value);
    let that = this
    let idType = that.data.idType
    that.setData({
      type_name: idType[e.detail.value].name
    })

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