Vue.component('image-modal', {
    data: function() {
        return {
            item: {
                title: '',
                created_at: null,
                username: '',
                description: '',
                score: null,
                tag: [],
                url: '',
            },
            comments: {}
        };
    },
    props: ['id'],
    template: `
        <div id='image-modal' class='modal-background hidden' @click.self='addHidden'>
            <div id='image-modal-container'>


                    <img id='modal-image' :src="item.url">
                    <div id='modal-image-dets' >
                        <div id="title-username">
                            <h2>{{item.title}}</h2> <h3>by</h3><h2> {{item.username}}</h2>
                        </div>
                        <div id="vote-tag">
                            <img v-on:click="vote(item, 'up')" class="arrow" src="./css/arrow.svg" alt="">
                            <div>{{item.score}}</div>
                            <img v-on:click="vote(item)" class="arrow down" src="./css/arrow.svg" alt="">
                            <div> {{item.tag}} </div>
                        </div>
                    </div>
                    <div id='comments'>
                    </div>




            </div>
        </div>
    `,
    watch: {
        id: function () {
            if(this.id) {
                axios.get('/content/'+this.id).then(function({data}) {
                    this.item = data[0]
                    console.log(this.item);
                }.bind(this))
                .catch(error => console.log(error))
            }
        }
    },
    methods: {
        loadImage () {


        },
        loadComments () {

        },
        newComment () {

        },
        addHidden(e){
            document.getElementById('image-modal').classList.add('hidden')
        }
    }

});
