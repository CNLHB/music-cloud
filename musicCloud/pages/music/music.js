// pages/playlist/playlist.js
const MAX_LIMIT = 15
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgUrls: [],
    playlist: [],
    topList:[],
    selAct: true,
    tips:''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getPlaylist()
    this._getSwiper()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      playlist: []
    })
    this._getPlaylist()
    this._getSwiper()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.selAct){
      this._getPlaylist()
    }else{
      console.log("pt");
      this._getTopList(true)
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  _recomlist(){
    this.setData({
      selAct: !this.data.selAct
    })
    if(this.data.playlist.length == 0){
      this._getPlaylist()
    }
  },
  _selectItem(event){
    // console.log(event.currentTarget.dataset.item)
    let item = event.currentTarget.dataset.item
    delete item.songList   
    wx.setStorageSync("top", item)
      wx.navigateTo({
        url: `../../pages/musiclist/musiclist?playlistId=${item.id}&top=1`,
      })
  },
  _getPlaylist() {

    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        start: this.data.playlist.length,
        count: MAX_LIMIT,
        $url: 'myplaylist',//路由
      }
    }).then((res) => {
      let tips = ''
      if(res.result.data.length<MAX_LIMIT){
        tips="我是有底线的！"
      }
      let data = this.data.playlist.concat(res.result.data)
      let count = data.length%3
      data.length = data.length -count
      this.setData({
        playlist: data,
        tips:tips
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  },
  toggleSelAct(){
    this.setData({
      selAct: !this.data.selAct,
      tips:''
    })
    this._getTopList()
  },
  _getTopList(flag){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:"music",
        data: {
          start: this.data.topList.length,
          count: MAX_LIMIT,
          $url: 'mytoplist',//路由
        }
    }).then(res=>{
      let tips = ''
      if(res.result.data.length<MAX_LIMIT){
        tips="我是有底线的！"
      }
      let data =this.data.topList.concat(res.result.data)
      this.setData({
        topList: data,
        tips
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  },
  _getSwiper() {
    db.collection('swiper').get().then((res) => {
      this.setData({
        swiperImgUrls: res.data
      })
    })
  }

})