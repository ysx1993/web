var Video = (function(){
    //封装取对象方法
    function getObj(name){
        return document.getElementsByClassName(name)[0];
    }

    function getObjs(name){
        return document.getElementsByClassName(name);
    }

    //添加视频节点
    function addVideoNode(){
        var vc = getObj("video-container");
        var src = vc.getAttribute("data-source");
        vc.innerHTML = '<video class="video">\
        <source src="'+ src +'" type="video/mp4">\
        </video>\
        <div class="video-controls">\
            <!--播放组件-->\
        <div class="video-btn">\
        <div class="video-play-btn btn-container">\
        <div class="video-play-btn-normal normal"><img src="img/play_btn.png"></div>\
        <div class="video-play-btn-hover hover"><img src="img/play_btn_over.png"></div>\
        </div>\
        <div class="video-pause-btn btn-container">\
        <div class="video-pause-btn-normal normal"><img src="img/pause_btn.png"></div>\
        <div class="video-pause-btn-hover hover"><img src="img/pause_btn_over.png"></div>\
        </div>\
        </div>\
            <!--进度条-->\
        <div class="video-process-bar">\
        <div class="video-total-process-bar"></div>\
        <div class="video-current-process-bar">\
        <div class="video-handle"></div>\
        </div>\
        </div>\
            <!--音量-->\
        <div class="video-vol-btn">\
        <div class="video-unmute-btn btn-container">\
        <div class="video-unmute-btn-normal normal"><img src="img/unmute_btn.png"></div>\
        <div class="video-unmute-btn-hover hover"><img src="img/unmute_btn_over.png"></div>\
        </div>\
        <div class="video-mute-btn btn-container">\
        <div class="video-mute-btn-normal normal"><img src="img/mute_btn.png"></div>\
        <div class="video-mute-btn-hover hover"><img src="img/mute_btn_over.png"></div>\
        </div>\
        </div>\
        </div>\
            <!--播放按钮和重新播放按钮-->\
        <div class="video-big-btn">\
        <div class="video-bigplay-btn btn-container">\
        <div class="video-bigplay-btn-normal normal"><img src="img/bigplay_btn.png"></div>\
        <div class="video-bigplay-btn-hover hover"><img src="img/bigplay_btn_over.png"></div>\
        </div>\
        <div class="video-bigreplay-btn btn-container">\
        <div class="video-bigreplay-btn-normal normal"><img src="img/replay_btn.png"></div>\
        <div class="video-bigreplay-btn-hover hover"><img src="img/replay_btn_over.png"></div>\
        </div>\
        </div>'
    }

    //添加hover效果
    function addHover(){
        var bcs = getObjs("btn-container");
        for (var i = 0; i < bcs.length; i++) {
            var bc = bcs[i]; //得到每个btn-container
            var h = bc.childNodes.item(3);
            h.style.opacity = 0;
            bc.onmouseenter = function(){
                var h = this.childNodes.item(3);
                h.style.opacity = 1;
            }
            bc.onmouseleave = function(){
                var h = this.childNodes.item(3);
                h.style.opacity = 0;
            }
        }
    }

    //为container添加视频组件
    function initVideo(){
        var t = this;
        t.video = getObj("video");
        t.playBtn = getObj("video-play-btn");
        t.pauseBtn = getObj("video-pause-btn");
        t.unmuteBtn = getObj("video-unmute-btn");
        t.muteBtn = getObj("video-mute-btn");
        t.bigPlayBtn = getObj("video-bigplay-btn");
        t.bigRePlayBtn = getObj("video-bigreplay-btn");
        t.pb = getObj("video-process-bar");
        t.tb = getObj("video-total-process-bar");
        t.cb = getObj("video-current-process-bar");
        t.vh = getObj("video-handle");
        //隐藏暂停按钮,静音图标
        t.pauseBtn.style.visibility = "hidden";
        t.pauseBtn.style.opacity = 0;
        t.muteBtn.style.visibility = "hidden";
        t.muteBtn.style.opacity = 0;
        t.bigRePlayBtn.style.visibility = "hidden";
        t.bigRePlayBtn.style.opacity = 0;
    }


    //视频事件定义
    function bindEvent(){
        var that = this;
        var v = this.video;
        v.ontimeupdate = function(){
            //滑块进度更新
            var x = 100 * v.currentTime / v.duration + "%";
            updateHandle.call(that, x);
            //视频进度更新
        }
        v.onplay = function(){
            //播放
        }
        v.onpause = function(){
            //暂停
        }
        v.onended = function(){
            //停止
            that.stop();
        }

        that.pb.onclick = function(e){
            if (that.video.ended) {
                that.hideBigRePlayBtn();
                that.showBigPlayBtn();
            }
            //更新滑块
            var hx = e.offsetX/that.pb.offsetWidth + "%";
            updateHandle.call(that, hx);
            //点击更新视频
            var vx = e.offsetX/that.pb.offsetWidth * that.video.duration;
            updateTime.call(that, vx);
        }

        that.playBtn.onclick = function(){
            that.play();
        }
        that.bigPlayBtn.onclick = function(){
            that.play();
        }
        that.bigRePlayBtn.onclick = function(){
            that.play();
        }
        that.pauseBtn.onclick = function(){
            that.pause();
        }
        that.muteBtn.onclick = function(){
            that.unmute();
        }
        that.unmuteBtn.onclick = function(){
            that.mute();
        }

        that.vh.onselectstart = function(){
            return false;
        }
        that.tb.onselectstart = function(){
            return false;
        }
        that.cb.onselectstart = function(){
            return false;
        }

        that.vh.onmousedown = function(e){
            var b = true;
            var pl = that.pb.offsetLeft;
            var pw = that.pb.offsetWidth;
            var ox = e.offsetX;
            document.onmousemove = function(e){
                if (b) {
                    var to = e.clientX-pl-ox;
                    to = to > pw ? pw : to;
                    that.cb.style.width = 100*to/pw + "%";
                    //更新视频进度
                    var x = to/pw * that.video.duration;
                    updateTime.call(that, x);
                }
            }
            document.onmouseup = function(){
                b = false;
            }

        }
    }

    //更新视频进度
    function updateTime(x){
        this.video.currentTime = x;
    }

    //更新滑条
    function updateHandle(x){
        this.cb.style.width = x;
    }

    //视频类
    function Video(){
        initVideo.apply(this);
        bindEvent.apply(this);
    }

    //视频方法
    Video.prototype = {
        showPlayBtn:function(){
            this.playBtn.style.visibility = "visible";
            this.playBtn.style.opacity = 1;
        },
        hidePlayBtn:function(){
            this.playBtn.style.visibility = "hidden";
            this.playBtn.style.opacity = 0;
        },
        showPauseBtn:function(){
            this.pauseBtn.style.visibility = "visible";
            this.pauseBtn.style.opacity = 1;
        },
        hidePauseBtn:function(){
            this.pauseBtn.style.visibility = "hidden";
            this.pauseBtn.style.opacity = 0;
        },
        showUnmuteBtn:function(){
            this.unmuteBtn.style.visibility = "visible";
            this.unmuteBtn.style.opacity = 1;
        },
        hideUnmuteBtn:function(){
            this.unmuteBtn.style.visibility = "hidden";
            this.unmuteBtn.style.opacity = 0;
        },
        showMuteBtn:function(){
            this.muteBtn.style.visibility = "visible";
            this.muteBtn.style.opacity = 1;
        },
        hideMuteBtn:function(){
            this.muteBtn.style.visibility = "hidden";
            this.muteBtn.style.opacity = 0;
        },
        showBigPlayBtn:function(){
            this.bigPlayBtn.style.visibility = "visible";
            this.bigPlayBtn.style.opacity = 1;
        },
        hideBigPlayBtn:function(){
            this.bigPlayBtn.style.visibility = "hidden";
            this.bigPlayBtn.style.opacity = 0;
        },
        showBigRePlayBtn:function(){
            this.bigRePlayBtn.style.visibility = "visible";
            this.bigRePlayBtn.style.opacity = 1;
        },
        hideBigRePlayBtn:function(){
            this.bigRePlayBtn.style.visibility = "hidden";
            this.bigRePlayBtn.style.opacity = 0;
        },
        mute:function(){
            this.showMuteBtn();
            this.hideUnmuteBtn();
            this.video.muted = true;
        },
        unmute:function(){
            this.showUnmuteBtn();
            this.hideMuteBtn();
            this.video.muted = false;
        },
        play:function(){
            this.hidePlayBtn();
            this.hideBigPlayBtn();
            this.hideBigRePlayBtn();
            this.showPauseBtn();
            if (this.video.ended) {
                this.video.currentTime = 0;
                this.cb.style.width = "0%";
            }
            this.video.play();
        },
        pause:function(){
            this.showPlayBtn();
            this.showBigPlayBtn();
            this.hideBigRePlayBtn();
            this.hidePauseBtn();
            this.video.pause();
        },
        stop:function(){
            this.hidePauseBtn();
            this.showPlayBtn();
            this.showBigRePlayBtn();
        },
        getVideo:function(){
            return this.video;
        }
    }

    addVideoNode();
    addHover();

    return new Video;
})()