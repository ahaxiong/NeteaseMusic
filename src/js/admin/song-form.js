{
    let view = {
        el: '.songForm',
        template: `
        <main>
            <h3>
                本地音乐
                <span>1首音乐，<a href="#">选择目录</a></span>
            </h3>
            <div class="play">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-play"></use>
                </svg>
                播放音乐
            </div>
            <form>
                <table>
                    <tr>
                        <td style="width:60px;"></td>
                        <td>音乐标题</td>
                        <td>歌手</td>
                        <td>链接</td>
                        <td>封面</td>
                        <td>歌词</td>
                        <td>状态</td>
                    </tr>
                    <tr class="edit">
                        <td style="width:60px;text-align:right;">01</td>
                        <td>
                            <input type="text" name="name" value="%name%">
                        </td>
                        <td>
                            <input type="text" name="singer" value="%singer%">
                        </td>
                        <td>
                            <input type="text" name="url" value="%url%">
                        </td>
                        <td>
                            <input type="text" name="cover" value="%cover%">
                        </td>
                        <td>
                            <input type="text" name="lyrics" value="%lyrics%">
                        </td>
                        <td>
                            <button type="submit">保存</button>
                        </td>
                    </tr>
                </table>
            </form>
        </main>            
    `,
        render(data = {}) {
            let placeholders = ['name', 'singer', 'url', 'cover', 'lyrics']
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`%${string}%`, data[string] || '')
            })
            $(this.el).html(html)
        },
        reset() {
            this.render({})
        }
    }
    let model = {
        data: {
            name: '', singer: '', url: '', cover: '', lyrics: '', id: ''
        },
        create(data) {
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            song.set('cover', data.cover);
            song.set('lyrics', data.lyrics);
            return song.save().then((newSong) => {
                let { id, attributes } = newSong
                Object.assign(this.data, {
                    id,
                    ...attributes,
                })
            }, (error) => {
                console.error(error);
            });
        },
        update(data){
            var song = AV.Object.createWithoutData('Song', this.data.id);
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            song.set('cover', data.cover);
            song.set('lyrics', data.lyrics);
            return song.save().then((response)=>{
                Object.assign(this.data,data)
                return response
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventhub()
        },
        create() {
            let needs = ['name', 'singer', 'url', 'cover', 'lyrics']
            let data = {}
            needs.map((string) => {
                data[string] = $(this.view.el).find(`input[name="${string}"]`).val()
            })
            this.model.create(data).then(() => {
                this.view.reset()
                let copy = JSON.parse(JSON.stringify(this.model.data))
                window.eventHub.emit('create', copy)
            })
        },
        update() {
            let needs = ['name', 'singer', 'url', 'cover', 'lyrics']
            let data = {}
            needs.map((string) => {
                data[string] = $(this.view.el).find(`input[name="${string}"]`).val()
            })
            this.model.update(data).then(()=>{
                this.view.reset()
                let copy = JSON.parse(JSON.stringify(this.model.data))
                window.eventHub.emit('update',copy)
            })
        },
        bindEventhub() {
            window.eventHub.on('upload', (data) => {
                this.model.data = data
                this.view.render(data)
            })
            window.eventHub.on('select', (data) => {
                this.model.data = data
                this.view.render(data)
            })
        },
        bindEvents() {
            $(this.view.el).on('submit', 'form', (e) => {
                e.preventDefault()    
                if (this.model.data.id) {
                    this.update()
                } else {
                    this.create()
                }
            })
        }
    }
    controller.init(view, model)
}