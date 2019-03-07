{
    let view = {
        el: '#page-hotsong',
        show(){
            $(this.el).addClass('active').siblings('.active').removeClass('active')
        },
        hide(){
            $(this.el).removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.bindEventhub()
        },
        bindEventhub(){
            window.eventHub.on('selectTab',(tabName)=>{
                if(tabName === 'page-hotsong'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        }
    }
    controller.init(view,model)
}