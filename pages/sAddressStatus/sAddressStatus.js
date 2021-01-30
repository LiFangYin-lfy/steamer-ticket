import {
  request
} from "../../request/index.js"
const a = getApp()
// var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    baseUrl: a.globalData.baseUrl,
    statusTop: a.globalData.statusHeight,
    imagesUrl: a.globalData.imagesUrl,
    four: 4,
    msg: '',
    default: 0,
    delTrue: false,
    formTrue: false,
    ress_box: {},
    user_address_id: '',
    address: '',
    area: '',
    mobile: '',
    name: '',
    code: ''
  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      user_address_id: options.id || '',
    })
    if (that.data.user_address_id != '') {
      that.getEditor()
    }
  },
  onShow: function () {},
  goback() {
    wx.navigateBack()
  },
  bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      area: e.detail.value.join(',')
    })
  },
  setIsMo() {
    let that = this
    let is_default = that.data.default
    if (is_default == 1) {
      that.setData({
        default: 0
      })
    } else {
      that.setData({
        default: 1
      })
    }
    console.log(that.data.default);
  },
  getInput(e) {
    this.setData({
      name: e.detail.value
    })
  },
  getPhone(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  async clickDelete() {
    let that = this
    that.setData({
      delTrue: true
    })
    wx.showModal({
      title: '提示',
      content: '您确认要删除该地址吗？',
      success: async function (res) {
        if (res.confirm) {
          try {
            const {
              data
            } = await request({
              url: 'api/user_address/delUserAddress',
              data: {
                user_address_id: that.data.user_address_id
              }
            })
            console.log(data);
            if (data.code == 1) {
              a.popSuccessTest(data.msg)
              that.setData({
                delTrue: false
              })
              setTimeout(() => {
                wx.navigateBack()
              }, 1000);
            }
          } catch (err) {
            console.log(err);
            a.popTest(err.msg)
            that.setData({
              delTrue: false
            })
          }
        } else {

        }
      }
    })

  },
  async submitForm(e) {
    console.log(e.detail.value, "e.detail.value");
    let that = this
    let id = that.data.user_address_id
    let obj = e.detail.value
    obj.mobile = a.setPhone(obj.mobile)
    // obj.area = obj.area.join(',') || that.data.area
    obj.area = that.data.area
    obj.default = that.data.default
    let postalCodeTrue = /^\d{6}$/
    var ispostalCode = postalCodeTrue.exec(obj.code)
    if (obj.name == '') {
      return a.popTest('姓名不能为空')
    } else if (obj.area == '') {
      return a.popTest('地区不能为空')
    } else if (obj.code == '') {
      return a.popTest('邮编不能为空')
    } else if (!ispostalCode) {
      return a.popTest('邮编有误')
    }
    if (id == '') {
      that.submit(obj)
    } else {
      that.editorSubmit(obj)
    }
  },
  async submit(obj) { // 添加
    let that = this
    console.log(obj);
    that.setData({
      formTrue: true
    })
    try {
      const {
        data
      } = await request({
        url: 'api/user_address/addUserAddress',
        data: obj
      })
      console.log(data);
      if (data.code == 1) {
        that.setData({
          msg: data.msg,
          formTrue: false
        })
        that.popSuccessTest()
        setTimeout(() => {
          wx.navigateBack()
        }, 500);
      }
    } catch (err) {
      console.log(err);
      that.setData({
        formTrue: false
      })
      a.popTest(err.msg)
    }
  },
  async editorSubmit(obj) { //  编辑保存
    let that = this
    obj.user_address_id = that.data.user_address_id
    that.setData({
      formTrue: true
    })
    try {
      const {
        data
      } = await request({
        url: 'api/user_address/editUserAddress',
        data: obj
      })
      console.log(data);
      if (data.code == 1) {
        that.setData({
          formTrue: false
        })
        a.popSuccessTest(data.msg)
        setTimeout(() => {
          wx.navigateBack()
        }, 500);
      }
    } catch (err) {
      console.log(err);
      that.setData({
        formTrue: false
      })
      a.popTest(err.msg)
    }
  },
  async getEditor() { // 获取编辑数据
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/user_address/getUserAddressInfo',
        data: {
          user_address_id: that.data.user_address_id
        }
      })
      console.log(data, "获取编辑数据");
      that.setData({
        ress_box: data,
        address: data.address,
        area: data.area,
        default: data.default,
        mobile: data.mobile,
        name: data.name,
        code: data.code
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