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
    openvar: false,
    session_key: '',
    openid: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClickOpen() {
      let that = this
      a.popTest('把偶凑了')
      this.setData({
        openvar: !this.data.openvar
      })
      console.log(this.data.openvar);
      that.getLoginCode()
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
    async bindGetUserInfo(e) {
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
          that.setData({
            openvar: false
          })
        }
      } catch (err) {
        a.popTest('您拒绝了授权')
        if (err.code == 0) {
          this.setData({
            openvar: !this.data.openvar
          })
        }
      }
    },
    onOpen() {
      this,
      triggerEvent('#open', {
        openvar: this.data.openvar
      })
    },


  },

})