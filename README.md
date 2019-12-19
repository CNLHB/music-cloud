# 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
云函数中获取云数据库
//云数据库初始化
const db = cloud.database()
云函数获取 100条
小程序20条
云函数限制50，有路由




小程序使用云函数
  wx.cloud.callFunction({
      name: 'music',
      data: {
        start: this.data.playlist.length,
        count: MAX_LIMIT,
        $url: 'playlist',
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        playlist: this.data.playlist.concat(res.result.data)
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })

    高斯模糊效果
    两个绝对定位元素
    bulr
    z-index
    ```css
    .player-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  filter: blur(40rpx);
  opacity: 0.5;
  z-index: -1;
}

.player-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  background: #222;
}

    ```


今日内容
播放内核实现
1、背景实现、高斯模糊，两个绝对定位，z-index不同，背景图片，  filter: blur(40rpx);opacity: 0.5;      z-index: -1;
2、小程序使用iconfont
   全局引入，app.wxss中导入@import "iconfont.wxss";
3、暂定animation-动画animation-play-state： paused
4、小程序进度条实现
    自定义==progress配合组件movable-view的可移动区域。
    <movable>
      <movable-view/>
    </movable-area>
   <progress></progress> 
5、组件中获取dom节点，查看节点详情
  const query = this.createSelectorQuery()，page页面wx.获取
  query.select('.movable-area').boundingClientRect()

 自定义组件
 1、组件声明周期
 2、自定义事件
 3、页面间通信
 子组件 this.triggerEvent（"事件名"）
 父组件  bind:事件名
 歌词
 解析歌词，歌词联动 

1、组件配置
options{
  styleIsolation："apply-shared", 样式作用域配置
  multipleSlots:true，设置命名插槽
}
2、获得焦点获取键盘高度
onFocus
3、获取图片存放到数组中
  遍历
4、上传图片wx.cloud.uploadFile
   返回fileId存储到数据库
5、 使用存储图片

1、图片预览
    onPreviewImage(event) {
      const ds = event.target.dataset
      wx.previewImage({
        urls: ds.imgs,
        current: ds.imgsrc,
      })
    },
2、绑定事件的两种方式
    catch 阻止冒泡
    bind
3、小程序端操作数据库
        // 小程序端调用云数据库
    /*  const db = wx.cloud.database()
     db.collection('blog').orderBy('createTime', 'desc').get().then((res)=>{
     }) */
4、判断用户是否授权
    wx.getSetting({
      success: (res) => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              // console.log(res)
              this.onLoginSuccess({
                detail: res.userInfo
              })
            }
          })
        } else {
          this.setData({
            modalShow: true,
          })
        }
      }
    })

5、小程序模板推送formid,需要配置云函数
{
  "permissions": {
    "openapi": [
      "templateMessage.send"
    ]
  }
}
6、小程序分享
  onShareAppMessage: function() {
    return {
      title: "内容",
      path: ``完整路径,
      imgsrc:
    }
  }
7、获取用户信息的方法
  1、组件形式获取
  <open-data type="userAvatarUrl"> </open-data> 只能用户展示，无需授权，只能获取自己的信息
  2、JS获取
    wx.getUserInfo只有授权后才能获取
  3、通过button方式
  4、获取openid
8、生成小程序码，二进制形式，
    存储到云存储