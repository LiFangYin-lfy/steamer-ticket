const a = getApp()
import {
  request
} from "../../request/index.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    baseUrl: a.globalData.baseUrl,
    statusTop: a.globalData.statusHeight,
    imagesUrl: a.globalData.imagesUrl,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tel() {
      wx.makePhoneCall({
        phoneNumber: '18222936511'
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
        wx.makePhoneCall({
          phoneNumber: data.service_mobile
        })
        that.setData({})
      } catch (err) {
        console.log(err);
        a.popTest(err.msg)
      }
    },
  }
})