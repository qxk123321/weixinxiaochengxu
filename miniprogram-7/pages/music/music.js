// pages/music/music.js
Page({
  data: {
    item:0,
    tab:0,
    playlist:[{
      id:1,title:'钢琴协奏曲',singer:'肖邦',
      src:'http://localhost/03.mp3',coverImgUrl:'../images/k.jpg'
    }, {
      id: 1, title: '奏鸣曲', singer: '莫扎特',
        src: 'http://localhost/03.mp3', coverImgUrl: '../images/k.jpg'
      }, {
      id: 1, title: '欢乐颂', singer: '贝多芬',
        src: 'http://localhost/03.mp3', coverImgUrl: '../images/k.jpg'
      }, {
      id: 1, title: '爱之梦', singer: '李斯特',
        src: 'http://localhost/03.mp3', coverImgUrl: '../images/k.jpg'}],
    state:'paused',
    playIndex:0,
    play:{
      currentTime:'00:00',
      duration:'00:00',
      percent:0,
      title:'',
      singer:'',
      coverImgUrl:'../images/k.jpg',
    }
  },
  changePage:function(e){
    wx:wx.navigateTo({
      url: '/playlist.wxml',
    })
  },
  change:function(e){
    this.setMusic(e.currentTarget.dataset.index)
    this.play()
  },
  changeItem:function(e)
  {
    this.setData({
      item:e.target.dataset.item
    })
  },
  changeTab:function(e){
    this.setData({
      tab: e.detail.current
    })
  },
  audioCtx:null,
  onReady:function(){
    this.audioCtx = wx.createInnerAudioContext()
    this.setMusic(0)
  },
  setMusic:function(index){
    var music = this.data.playlist[index]
    this.audioCtx.src = music.src
    this.setData({
      playIndex:index,
      'play.title':music.title,
      'play.singer':music.singer,
      'play.coverImgUrl':music.coverImgUrl,
      'play.currentTime':'00:00',
      'play.duration':'00:00',
      'play.percent':0
    })
  },
  play: function () {
    this.audioCtx.play()
    this.setData({ state:'running' })
  },
  pause: function () {
    this.audioCtx.pause()
    this.setData({ state: 'paused' })
  },
  next:function(){
    var index = this.data.playIndex >=this.data.playlist.length - 1 ? 0:this.data.playIndex + 1
    this.setMusic(index)
    if (this.data.state === 'running'){
      this.play()
    }
  },
  onReady:function(){
    this.audioCtx = wx.createInnerAudioContext()
    var that = this
    this.audioCtx.onError(function(){
      console.log('播放失败:'+that.audioCtx.src)
    })
    this.audioCtx.onEnded(function(){
      that.next()
    })
    this.audioCtx.onPlay(function(){})
    this.audioCtx.onTimeUpdate(function(){
      that.setData({
        'play.duration':formatTime(that.audioCtx.duration),
        'play.currentTime':formatTime(that.audioCtx.currentTime),
        'play.percent':that.audioCtx.currentTime / that.audioCtx.duration*100

      })
    })
    this.setMusic(0)
    function formatTime(time) {
      var minute = Math.floor(time / 60)%60;
      var second = Math.floor(time)%60
      return( minute<10 ? '0'+minute:minute ) +':'+(second<10?'0'+second:second)
    }
  },
  sliderChange:function(e){
    var second = e.detail.value * this.audioCtx.duration/100
    this.audioCtx.seek(second)
  }
})