{
    let view = {
        el: '#page-recommend',
        show() {
            $(this.el).addClass('active').siblings('.active').removeClass('active')
        },
        hide() {
            $(this.el).removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.bindEventhub()
            this.loadModule1()
            this.loadModule2()
        },
        bindEventhub() {
            window.eventHub.on('selectTab', (tabName) => {
                if (tabName === 'page-recommend') {
                    this.view.show()
                } else {
                    this.view.hide()
                }
            })
        },
        loadModule1() {
            let script1 = document.createElement('script')
            script1.src = './js/index/songList.js'
            script1.onload = function () {
            }
            document.body.appendChild(script1)
        },
        loadModule2() {
            let script2 = document.createElement('script')
            script2.src = './js/index/playList.js'
            script2.onload = function () {
            }
            document.body.appendChild(script2)
        }
    }
    controller.init(view, model)
}