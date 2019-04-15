(()=>{
    new Vue({
        el:'#main',
        data: {
            items: []
        },
        mounted: function(){
            axios.get('/content').then(function({data}) {
                console.log(data);
                this.items = data
            }.bind(this))
            .catch(error => console.log(error))
        },
        methods: {

        },
    })
})()
