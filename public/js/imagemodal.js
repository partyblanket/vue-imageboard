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
            comments: {},
            newcomment: {
                name: '',
                content: '',
            },
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
                        <div id='new-comment'>
                                <textarea class='comment' v-model='newcomment.content' name='content' type='text' placeholder='write your stuff' rows="4" cols="50"></textarea>
                                <input class='name' v-model='newcomment.name' name='name' type='text' placeholder='your name'>
                                <input v-on:click="newComment" type="submit" value="Submit">
                        </div>
                        <div class='comment' v-for="comment in comments">

                        </div>
                    </div>
            </div>
        </div>
    `,
    watch: {
        id: function () {
            if(this.id) {
                axios.get('/content/'+this.id).then(function({data}) {
                    this.item = data[0]
                }.bind(this))
                .catch(error => console.log(error))

                axios.get('/comment/' + this.id).then(function({data}) {
                    this.comments = data
                    console.log(this.comments);
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
            axios.post('/comment', {...this.newcomment, id: this.id}).then(function(res) {
                if(res.status === 200){
                    console.log(res);
                }else{
                    console.log('ERROR status ' + res.status);

                }
            }.bind(this))
        },
        addHidden(e){
            document.getElementById('image-modal').classList.add('hidden')
        }
    }

});
