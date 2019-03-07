{
    let view = {
        el: '.songArea > .songList',
        template: `
            <ul>
                <li>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-music-logo"></use>
                    </svg>
                    同一首歌
                </li>
                <li class="active">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-music-logo"></use>
                    </svg>
                    同一首歌
                </li>
                <li>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-music-logo"></use>
                    </svg>
                    同一首歌
                </li>
            </ul>  
        `,
        render(data) {
            let $el = $(this.el)
            $el.html(this.template)
            let { songs, selectSongId } = data
            let svg = '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-music-logo"></use></svg>'
            let liList = songs.map((song) => {
                let $li = $('<li></li>').text(song.name).attr('song-id', song.id)
                if(song.id === selectSongId){
                    $li.addClass('active')
                }
                return $li
            })
            $el.find('ul').empty()
            liList.map((domLi) => {
                $el.find('ul').append(domLi)
            })
            $el.find('ul>li').prepend(svg)
        },
        activeItem(li) {
            let $li = $(li)
            $li.addClass('active').siblings('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            songs: [],
            selectSongId: null
        },
        find() {
            var query = new AV.Query('Song')
            return query.find().then((songs) => {
                this.data.songs = songs.map((song) => {
                    return { id: song.id, ...song.attributes }
                })
                return songs
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.getAllSongs()
            this.bindEventHub()
            this.bindEvents()

        },
        getAllSongs() {
            return this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        },
        bindEvents() {
            $(this.view.el).on('click', 'li', (e) => {
                let songId = e.currentTarget.getAttribute('song-id')
                this.model.data.selectSongId = songId
                this.view.render(this.model.data)
                let data
                let songs = this.model.data.songs
                for (let i = 0; i < songs.length; i++) {
                    if (songId === songs[i].id) {
                        data = songs[i]
                        break
                    }
                }
                let copy = JSON.parse(JSON.stringify(data))
                window.eventHub.emit('select', copy)
            })
        },
        bindEventHub() {
            window.eventHub.on('create', (songData) => {
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            })
            window.eventHub.on('update', (song) => {
                let songs = this.model.data.songs
                for (let i = 0; i < songs.length; i++) {
                    if (songs[i].id === song.id) {
                        Object.assign(songs[i], song)
                    }
                }
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}