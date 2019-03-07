{
    let view = {
        el: 'header',
        template: `
        <div class="logo">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-music"></use>
            </svg>
            <span>网易云音乐</span>
        </div>
    `,
        render(data){
            $(this.el).html(this.template)
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
        }
    }
    controller.init(view,model)
}