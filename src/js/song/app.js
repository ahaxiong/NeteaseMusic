{
    let view = {
        el: '.page',
        render(data) {
            let { song, status } = data
            $(this.el).find('div.bgImage').css('background', `url(${song.cover}) center center / cover no-repeat`)
            $(this.el).find('img.cover').attr('src', song.cover)

            if ($(this.el).find('audio').attr('src') !== song.url) {
                let audio = $(this.el).find('audio').attr('src', song.url).get(0)
                audio.onended = () => {
                    window.eventHub.emit('songEnd')
                }
                audio.ontimeupdate = () => {
                    this.showLyric(audio.currentTime)
                }
            }
            $(this.el).find('.song-description>h1').text(song.name)
            if (status === 'playing') {
                $(this.el).find('.disc-container').addClass('playing')
                $(this.el).find('.play').removeClass('active')
            } else {
                $(this.el).find('.disc-container').removeClass('playing')
                $(this.el).find('.play').addClass('active')
            }
            let { lyrics } = song
            lyrics.split('↵').map((string) => {
                let p = document.createElement('p')
                let regex = /\[([\d:.]+)\](.+)/
                let matches = string.match(regex)
                if (matches) {
                    p.textContent = matches[2]
                    let time = matches[1]
                    let parts = time.split(':')
                    let minutes = parts[0]
                    let seconds = parts[1]
                    let newTime = parseInt(minutes, 10) * 60 + parseFloat(seconds, 10)
                    p.setAttribute('time', newTime)
                } else {
                    p.textContent = string
                }
                $(this.el).find('.lyric>.lines').append(p)
            })
        },
        play() {
            $(this.el).find('audio')[0].play()
        },
        pause() {
            $(this.el).find('audio')[0].pause()
        },
        showLyric(time) {
            let allP = $(this.el).find('.lyric>.lines>p')
            let p
            for (let i = 0; i < allP.length; i++) {
                if (i === allP.length - 1) {
                    p = allP[i]
                    break
                } else {
                    let currentTime = allP.eq(i).attr('time')
                    let nextTime = allP.eq(i + 1).attr('time')
                    if (currentTime <= time && time < nextTime) {
                        p = allP[i]
                        break
                    }
                }
            }
            let pHeight = p.getBoundingClientRect().top
            let linesHeight = $(this.el).find('.lyric>.lines')[0].getBoundingClientRect().top
            let height = pHeight - linesHeight
            $(this.el).find('.lyric>.lines').css({
                transform: `translateY(${-(height - 25)}px)`
            })
            $(p).addClass('active').siblings('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            song: { id: '', name: '', singer: '', url: '', cover: '', lyrics: '' },
            status: 'playing'
        },
        getSong(id) {
            var query = new AV.Query('Song');
            return query.get(id).then((song) => {
                Object.assign(this.data.song, { id: song.id, ...song.attributes })
                return song
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            let id = this.getSongId()
            this.model.getSong(id).then(() => {
                this.view.render(this.model.data)
                this.view.play()
            })
            this.bindEvents()
        },
        bindEvents() {
            $(this.view.el).on('click', '.cover', () => {
                this.model.data.status = 'paused'
                this.view.render(this.model.data)
                this.view.pause()
            })
            $(this.view.el).on('click', '.play', () => {
                this.model.data.status = 'playing'
                this.view.render(this.model.data)
                this.view.play()
            })
            window.eventHub.on('songEnd', () => {
                this.model.data.status = 'paused'
                this.view.render(this.model.data)
            })
        },
        getSongId() {
            let search = window.location.search
            if (search.indexOf('?') === 0) {
                search = search.substring(1)
            }
            let array = search.split('&').filter(v => v)
            let id = ''
            for (let i = 0; i < array.length; i++) {
                let string = array[i].split('=')
                let key = string[0]
                let value = string[1]
                if (key === 'id') {
                    id = value
                    break
                }
            }
            return id
        }
    }
    controller.init(view, model)
}