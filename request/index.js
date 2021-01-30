// const a = getApp()
// 导出一个封装好的异步请求
export const request = (params) => {
  wx.showNavigationBarLoading()
  // const baseUrl = a.globalData.baseUrl
  const baseUrl = 'https://beihaiwz.com/'
  // const baseUrl = 'http://steamer.t.brotop.cn/'
  return new Promise((resolve, reject) => {
    let header = {
      // 'XX-Device-Type': 'wxapp',
      'token': wx.getStorageSync("token") || ''
    }
    header = Object.assign(header)
    let that = this;
    wx.request({
      ...params,
      url: baseUrl + params.url,
      data: params.data,
      header: header,
      success: (res) => {
        if (res.data.code == "1") {
          resolve(res)
        } else {
          reject(res.data)
        }

      },
      fail: (err) => {
        reject(err)
        wx.showNavigationBarLoading()

        // wx.hideLoading();
        // wx.showModal({
        //   title: '提示',
        //   showCancel: false,
        //   content: '请求超时，请重新进入',
        //   //  success: function () {
        //   //    wx.redirectTo({
        //   //      url: '../scan/scan'
        //   //    })
        //   //  }
        // })

      },
      complete: function () {
        wx.hideNavigationBarLoading()
      },

    })
  })

}