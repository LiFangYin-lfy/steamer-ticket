const a = getApp()
import {
  request
} from "../../request/index.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    contents: {
      type: String,
      value: '111'
    },
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
    getContest() {
      this.setData({
        content: ''
      })
    }
  }
})