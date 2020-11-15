const app = getApp()
// pages/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },

  onTapQrCode(event) {
    let id = event.currentTarget.dataset.id;
    wx.showLoading({
      title: '生成中',
    })
    if(!!id){
      wx.previewImage({
        urls: ["https://6c68-lhb2526-1300735609.tcb.qcloud.la/blog/mywxcode.jpg?sign=084f2f93418cffdc6e9feff5e8465982&t=1583655735"],
        current: "https://6c68-lhb2526-1300735609.tcb.qcloud.la/blog/mywxcode.jpg?sign=084f2f93418cffdc6e9feff5e8465982&t=1583655735"
      })
    }else{
      wx.cloud.callFunction({
        name: 'getQrCode'
      }).then((res) => {
        // console.log(res)
        const fileId = res.result
        wx.previewImage({
          urls: [fileId],
          current: fileId
        })
       
      })
    }
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})