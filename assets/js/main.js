/**
 * 1.Render songs
 * 2. Scroll top
 * 3. Play/pause/seek
 * 4. CD rotate
 * 5. Next/prev
 * 6. Random
 * 7. Next/repeat when ended
 * 8. Active song
 * 9. Scroll active song into view - keo bai hat dang phat len tren dau
 * 10. Play song when click
 */


const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $('header h2');
const cdThumb =  $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const repeatBtn = $('.btn-repeat');
const randomBtn = $('.btn-random');


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    arrayRandom: [],
    songs: [
        {
            name: 'Ah Yeah',
            singer: 'EXID',
            path: './assets/music/AhYeah-EXID-3865317.mp3',
            image: './assets/img/ahyeah.jpg'
        },
        {
            name: 'Dreamer',
            singer: 'Solji-EXID',
            path: './assets/music/DreamerSoljiSolo-EXID-5278423.mp3',
            image: './assets/img/dreamer_solji.jpg'
        },
        {
            name: 'Hot Pink',
            singer: 'EXID',
            path: './assets/music/HotPink-EXID-4182877.mp3',
            image: './assets/img/hotpink.jpg'
        },
        {
            name: 'I love you',
            singer: 'EXID',
            path: './assets/music/ILoveYou-EXID-5769723.mp3',
            image: './assets/img/iloveyou.jpg'
        },
        {
            name: 'Lady',
            singer: 'EXID',
            path: './assets/music/Lady-EXID-5437154.mp3',
            image: './assets/img/lady.jpg'
        },
        {
            name: 'LIE',
            singer: 'EXID',
            path: './assets/music/LIE-EXID-4470174.mp3',
            image: './assets/img/LIE.jpg'
        },
        {
            name: 'Me & You',
            singer: 'EXID',
            path: './assets/music/MeYou-EXID-6026293.mp3',
            image: './assets/img/me_you.jpg'
        },
        {
            name: 'Only One',
            singer: 'Solji-EXID',
            path: './assets/music/OnlyOne-SolJiEXIDHANIEXID-4357292.mp3',
            image: './assets/img/onlyone_solji.jpg'
        },
        {
            name: 'Up & Down',
            singer: 'EXID',
            path: './assets/music/UpDown-EXID-3329063.mp3',
            image: './assets/img/up_down.jpg'
        },
        {
            name: 'Velvet',
            singer: 'LE-EXID',
            path: './assets/music/Velvet-LEEXID-4863251.mp3',
            image: './assets/img/velvet_le.jpg'
        }
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song song-${index} ${index === this.currentIndex ? 'active':''}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
        });

        $('.playlist').innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this,'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvent: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        //Xu ly CD quay va dung
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10s
            iterations: Infinity
        });
        cdThumbAnimate.pause();

        //Xu ly phong to/thu nho CD
        document.onscroll = function() {
        const scrollTop = window.scrollTop || document.documentElement.scrollTop;
        const newCdWidth = cdWidth - scrollTop;

        cd.style.opacity = newCdWidth/cdWidth;
        cd.style.width = newCdWidth > 0? newCdWidth +'px' : 0;
        }
        //Xu ly khi click player
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        //khi song play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        //khi song pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        //khi thoi gian phat cua song thay doi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.round(audio.currentTime/audio.duration*10000)/100;
                progress.value = progressPercent;
            }
        }

        //xu ly khi tua bai hat
        progress.onchange = function(e) {
            //lay gia tri phan tram tren thanh progress: e.target.value
            const seekTime = e.target.value/100*audio.duration;
            audio.currentTime = seekTime;
        }

        //khi next bai hat
        nextBtn.onclick = function() {
            _this.nextSong();
            _this.scrollToActiveSong();
            audio.play();
        }

        //khi prev bai
        prevBtn.onclick = function() {
            _this.prevSong();
            _this.scrollToActiveSong();
            audio.play();
        }

        //Xu ly random bat/tat
        randomBtn.onclick = function() {
            _this.isRandom = ! _this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
            if (_this.isRandom) _this.arrayRandom.push(_this.currentIndex);
            else _this.arrayRandom = [];
        }

        //Khi repeat sog
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        //Xu li next song khi audio ended
        audio.onended = function() {
            if (!_this.isRepeat) _this.nextSong();
            audio.play();
        }
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function() {
        if (this.isRandom) this.randomSong();
        else {
            this.removeActiveSong(this.currentIndex);
            this.currentIndex = this.currentIndex < (this.songs.length - 1) ? this.currentIndex + 1 : 0;
            this.loadCurrentSong();
            this.activeSong(this.currentIndex);
        }
    },
    prevSong: function() {
        if (this.isRandom) this.randomSong();
        else {
            this.removeActiveSong(this.currentIndex);
            this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : (this.songs.length -1);
            this.loadCurrentSong();
            this.activeSong(this.currentIndex);
        }
    },
    randomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random()*this.songs.length);
            this.arrayRandom.push(this.currentIndex);
            console.log(this.arrayRandom);
            if (this.arrayRandom.length == this.songs.length)
                this.arrayRandom = [];
        } while(this.arrayRandom.includes(newIndex))
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    removeActiveSong: function(index) {
        $(`.song.song-${index}`).classList.remove('active');
    },
    activeSong: function(index) {
        $(`.song.song-${index}`).classList.add('active');
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 300)
    },
    start: function() {
        //dinh nghia cac thuoc tinh cho object
        this.defineProperties();
        //lang nge va xu ly cac su kien
        this.handleEvent();

        //tai thong tin bai hat dau tien vao UI khi tai trang
        this.loadCurrentSong();
        //Render playlist
        this.render();
    }
};

//
app.start();
