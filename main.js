const $ = document.querySelector.bind(document)
const $$ = document.querySelector.bind(document)

const player = $('.player')
const playing = $('.player .playing')
const heading = $('header h2')
const cdthumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const randomBtn= $('.btn-random')
const repeatBtn = $('.btn-repeat')

const PLAYER_STORAGE_KEY = 'APP'
const app ={
    currentInddex :0,
    isPlaying : false,
    isRandom:false,
    isRepeat:false,
    config : JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))||{},
    songs:[    
    {
        name : 'Trơn',
        singer : 'Bình Gold',
        img : './img/1.jpg',
        path : './music/song1.mp3'
    },
    {
        name : 'Yêu Đương Khó Quá',
        singer : 'Erik',
        img : './img/2.jpg',
        path : './music/song2.mp3'
    },
    {
        name : 'Thức giấc',
        singer : 'quên',
        img : './img/3.jpg',
        path : './music/song3.mp3'
    },
    {
        name : 'Có hẹn với thanh xuân',
        singer : 'MONTER',
        img : './img/4.jpg',
        path : './music/song4.mp3'
    },
    {
        name : 'Ái nộ',
        singer : 'MASEW',
        img : './img/5.jpg',
        path : './music/song5.mp3'
    },{
        name : 'Trơn',
        singer : 'Bình Gold',
        img : './img/1.jpg',
        path : './music/song1.mp3'
    },
    {
        name : 'Yêu Đương Khó Quá',
        singer : 'Erik',
        img : './img/2.jpg',
        path : './music/song2.mp3'
    },
    {
        name : 'Thức giấc',
        singer : 'quên',
        img : './img/3.jpg',
        path : './music/song3.mp3'
    },
    {
        name : 'Có hẹn với thanh xuân',
        singer : 'MONTER',
        img : './img/4.jpg',
        path : './music/song4.mp3'
    },
    {
        name : 'Ái nộ',
        singer : 'MASEW',
        img : './img/5.jpg',
        path : './music/song5.mp3'
    }],
    setConfig : function(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
    defineProperties : function(){
        Object.defineProperty(this,'currentSong',{
            get() { return this.songs[this.currentInddex]}
            
        })
    },
    render : function(){
        var htmls = this.songs.map((song,index)=>{
            return `
         <div class="song song${index}">
         <div class="thumb" style="background-image: url('${song.img}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>         
      </div>`
            
        })    
        $('.playlist').innerHTML = htmls.join(' ')
    },
    handleEvents :function(){
        _this = this;
        const cdWidth = cd.offsetWidth 
        // xu li khi cuon
        document.onscroll = function(){
                  
           const scroll = window.scrollY  
           const cdNewWidth = cdWidth - scroll
         
           cd.style.width = cdNewWidth>0? cdNewWidth + 'px':0 
           cd.style.opacity = cdNewWidth/cdWidth  
        }
        // cho CD quay
        const cdthumbAnimate = cdthumb.animate({
            transform : 'rotate(360deg)'
        },{
            duration :10000,
            iterations :Infinity
        })
        cdthumbAnimate.pause()
        // xu ly khi play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }else audio.play()

        }

        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing')
            cdthumbAnimate.play()
            
        }
        audio.onpause = function pause(){
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdthumbAnimate.pause()
        }
        // khi bai hat chay
        audio.ontimeupdate = function(){
            if(audio.duration){
                const now = audio.currentTime*100/audio.duration
                progress.value = now
                
            }  
                     
        }
        // khi bai hat ket thuc
        audio.onended = function(){
            _this.nextSong()
            audio.play()
        }
        
        // khi tua
        progress.oninput = function(e){
            const  seekTime =(e.target.value/100)*audio.duration
            audio.currentTime =seekTime
        }
        // khi next
        const next = $('.btn-next')
        next.onclick= function(){
            _this.nextSong()
            audio.play()
        }
        const prev = $('.btn-prev')
        prev.onclick = function(){
            _this.prevSong()
            audio.play()
        }

            // xu li khi bat tat random
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active',_this.isRandom)
            
        }
        // khi bat tat repeat
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active',_this.isRepeat)
            
            audio.loop = _this.isRepeat
        }
        // gan su kien click cho PLAYLIST
        window.onload =function(){
            _this.songs.forEach((song,index) => {
                let active
                active = $('.song'+index)
                active.onclick= function(){
                    _this.unActiveSong()
                    _this.currentInddex = index
                    _this.loadCurrentSong()
                    
                    audio.play()
                    _this.activeSong()
                }               
            });
        }
        
       
    },

    // load config
    loadConfig : function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    setConfig : function(){
        repeatBtn.classList.toggle('active',this.isRepeat)
        randomBtn.classList.toggle('active',this.isRandom)
    },

    loadCurrentSong : function(){
       heading.textContent =this.currentSong.name
        cdthumb.style.backgroundImage =`url('${this.currentSong.img}')`
        audio.src = this.currentSong.path    
    },
    nextSong : function(){
        this.unActiveSong()
        if (this.isRandom == false){
            this.currentInddex++
        if (this.currentInddex == this.songs.length){
            this.currentInddex = 0
        }
        this.loadCurrentSong()
        }else{
           this.playRandomSong()
        }
        this.activeSong()
        
    },
    prevSong: function(){
        this.unActiveSong()
        if (this.isRandom == false){
            this.currentInddex--
        if (this.currentInddex < 0){
            this.currentInddex = this.songs.length-1
        }
        this.loadCurrentSong()
        
        }else{
           this.playRandomSong()
        }
        this.activeSong()
        
        
    },
    
    playRandomSong : function(){
        this.unActiveSong()
        let newIndex
        do{ newIndex = Math.floor(Math.random()*this.songs.length)}
        while(newIndex === this.currentInddex)
        this.currentInddex = newIndex
        this.loadCurrentSong()
        this.activeSong()
    },

    activeSong : function(){
        const songActive = $('.song'+this.currentInddex)       
        songActive.classList.add('active')
        
        
    },
    unActiveSong : function(){
        const songActive = $('.song'+this.currentInddex)       
        songActive.classList.remove('active')
    }
    ,
    start: function(){
        
        // ĐỊNH NGHĨA THUỘC TÍNH CHO OBJECT
        this.defineProperties()
        // tai thong tin bai hat dau tien vao UI
        this.loadCurrentSong()
        // SỬ LÝ SỰ KIỆN 
        
        this.handleEvents()
        // RENDER PLAYLIST
        this.render()
        
        
    }        
    
}
app.start()

