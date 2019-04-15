(()=>{
    new Vue({
        el:'#main',
        data: {
            items: []
        },
        mounted: function(){
            axios.get('/content').then(function({data}) {
                this.items = data
            }.bind(this))
            .catch(error => console.log(error))
        },
        methods: {
            click: function (item, up) {
                up? item.score++ : item.score--
            }.bind(this)

        },
    })
})()
