{
    let view = {
        el: 'footer',
        template:`
        <div class="footerArea">
            <ul>
                <li>关于网易</li>
                <li>客户服务</li>
                <li>服务条款</li>
                <li>网站导航</li>
                <li>意见反馈</li>
            </ul>
            <p>网易公司版权所有©1997-2019杭州乐读科技有限公司 运营：浙网文[2018]3506-263号</p>
            <p>违法和不良信息举报电话：0571-89853516 举报邮箱：ncm5990@163.com</p>
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