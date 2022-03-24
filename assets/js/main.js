/**
 * 1.Render songs
 * 2. Scroll top
 * 3. Play/pause/seek
 * 4. CD rotate
 * 5. Next/prev
 * 6. Random
 * 7. Next/repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
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


const app = {
    currentIndex: 0,
    isPlaying: false,
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
        const htmls = this.songs.map(song => {
            return `
            <div class="song">
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
    definePropertis: function() {
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
            interations: Infinity
        });

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
        }

        //khi song pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
        }


        //khi thoi gian phat cua song thay doi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime/audio.duration*100);
                progress.value = progressPercent;
            }
        }

        //xu ly khi tua bai hat
        progress.onchange = function(e) {
            //lay gia tri phan tram tren thanh progress: e.target.value
            const seekTime = e.target.value/100*audio.duration;
            audio.currentTime = seekTime;
        }
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    start: function() {
        //dinh nghia cac thuoc tinh cho object
        this.definePropertis();
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
