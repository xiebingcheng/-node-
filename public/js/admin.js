$(function(){
    $('.del').on('click',function(e){
        //确定点击的是哪个按钮 e.target
        var target = $(e.target)
        //拿到被点击的按钮的data-id
        var id =target.data('id')
        //为ajax里面的,tr.remove做准备
        var tr = $('.item-id-' + id)

        $.ajax({
            type:'delete',
            url:'/admin/list?id=' +id
        })
        //删除后,返回一个服务器的状态
        .done(function(results){
            if(results.success === 1){
                //返回1的话,删除成功.
                if(tr.length > 0){
                //数据库删除成功,把页面的tr也删掉
                tr.remove()
                }
            }
        })
    })
})