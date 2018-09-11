var musicList;
var musicIndex = 0;
var musicTotalLength;
var musicPlay = new Audio();//c创建Audio 对象
//console.log(musicPlay)
var displaydot;
var dot
musicPlay.autoplay = true;


function $(selector){//模仿jQuery选择器
    return document.querySelector(selector);
}

musicPlay.ontimeupdate  =  function (){ //监听事件 针对进度条
    //console.log(this.currentTime);
    var curTime =this.currentTime;
    var percentage = (curTime / this.duration)*100; 
    $(".playarea .progress .playbarnow").style.width = percentage + '%',1000;
}

//利用setInterval 匀速输出时间 监听play
musicPlay.onplay = function(){
    var musicTotalMinute = Math.floor(this.duration / 60);
    var musicTotalSecond = Math.floor(this.duration % 60);
    if(musicTotalSecond<10){
        musicTotalSecond = '0' + musicTotalSecond;
    }
    musicTotalLength = musicTotalMinute + ':' + musicTotalSecond;//得到总长度     
    clock = setInterval(function(){
        var minute = Math.floor(musicPlay.currentTime / 60);
        var second = Math.floor(musicPlay.currentTime % 60);
        if(second<10){
            second = '0' + second;
        }
        var timeDisplay = minute + ":" + second + " / "+ musicTotalLength;
        $(".playarea .progress .time").innerText = timeDisplay;
    },1000);
    }

musicPlay.onpause = function(){
    clearInterval(clock);//重置时间
}

//本首结束自动下一首
musicPlay.ended = function(){
    musicIndex = (++musicIndex) % (musicList.length);
    loadMusic(musicList[musicIndex]);
}

//play 与 pause
$(".playarea .control .play").onclick = function(){
     if(musicPlay.paused){
        musicPlay.play();
        this.querySelector(".fas").classList.remove("fa-play");
        this.querySelector(".fas").classList.add("fa-pause");
        $('.layout .pic').style.animationPlayState = 'running';
    }else{
        musicPlay.pause();
        this.querySelector(".fas").classList.remove("fa-pause");
        this.querySelector(".fas").classList.add("fa-play");
        $('.layout .pic').style.animationPlayState = 'paused';
    }
}

//下一首事件
$(".playarea .control .forward").onclick = function(){
    musicIndex = (++musicIndex) % (musicList.length);
    //console.log(musicIndex);
    loadMusic(musicList[musicIndex]);
}

//上一首
$(".playarea .control .back").onclick = function(){
    musicIndex = (musicList.length + (--musicIndex)) % musicList.length;
    console.log(musicIndex);
    loadMusic(musicList[musicIndex]);
}

//调节进度条
$(".playarea .playbar").onclick = function(e){//事件需要当做参数传入
    console.log(e);
    var percentage = e.offsetX / parseInt (getComputedStyle(this).width);
    console.log(percentage);
    musicPlay.currentTime = percentage * musicPlay.duration;
}

function getMusicList(callback){
// AJAX 调用数据,异步数据要加载完成后才会过来,利用callback
var xhr = new XMLHttpRequest();
xhr.open("GET"," https://wjxalexander.github.io/weblearning/source.json",true);
xhr.onload = function(){
    if((xhr.status >= 200 && xhr.status < 300)||xhr.status===304){
        callback(JSON.parse(this.responseText));//变成对象,作为函数传入callback
    }else{
        console.log('获取数据失败');
    }
}
xhr.onerror = function(){
    console.log('网络异常');
}
xhr.send();
}

//获取list 回调函数
getMusicList(function(List){//函数的参数就是callback里的结果
     //console.log(List);
     loadMusic(List[musicIndex]);
     musicList = List;
     generateList(musicList);
 })

//实现播放功能
function loadMusic(musicObj){
    //console.log(musicObj);
    $('.playarea .info .title').innerText = musicObj.title;//获取对应值
    $('.playarea .info .author').innerText = musicObj.author;
    $('.playarea .pic').style.backgroundImage = 'url('+ musicObj.img+')';
    musicPlay.src = musicObj.src; //AUDIO对象赋值
}

//生成数据列表 容器绑定 
function generateList(List){
    var parent =  $('.layout .musiclist');
    //console.log(parent);
    for (var i = 0; i<List.length; i++){
        var placeholder = document.createElement('p');
        placeholder.setAttribute("class","songtitle");
        placeholder.setAttribute("id", i);
        placeholder.innerText = List[i].title;
        parent.appendChild(placeholder);
    }
   // console.log(parent.children[1]);
}
//绑定播放事件
$('.layout .musiclist').onclick = function(e){
    //console.log(e.target.id);
    musicIndex = parseInt(e.target.id);
    loadMusic(musicList[musicIndex]);
}
//显示input[type=range]
$('.playarea .vol .fa-volume-up').onclick = function(){
    $('.playarea .vol input[type=range]').style.display = 'inline-block';
}
//设置音量
$('.playarea .vol input[type=range]').onchange = function(){
    var vol = (this.value);
    console.log(vol);
    musicPlay.volume = vol;
}