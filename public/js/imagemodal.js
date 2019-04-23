Vue.component('commentdiv', {
    data: function () {
        return {
            name: '',
            content: '',

        }
    },
    props: ['comments', 'modalitem', 'parentid'],
    template: `
                        <div class='comment-outer'>
                            <div class='comment' v-for="entry in comments" :key="entry.id">
                                <div>
                                    <div class='comment-name'><p><img class="add" id='entry.id' src="./css/add.svg"><div class='idx hidden'>{{entry.id}}</div> {{entry.username}} on <i>{{Date(entry.created_at)}}</i></p></div>
                                    <div class='comment-text'>{{entry.comment}}</div>
                                    <commentdiv v-if='entry.children' :comments='entry.children'></commentdiv>
                                </div>
                            </div>
                        </div>
                            `,
    methods: {

    }

})

Vue.component('image-modal', {
    data: function() {
        return {
            comments: [],
            modalItemData: {},
            name: '',
            content: '',
            commentsNested: null,
            commentingOn: 0,
        };
    },
    props: ['modalitem'],
    template: `
        <div id='image-modal' class='modal-background hidden' @click.self='addHidden'>
            <div id='image-modal-container'>
                    <img id='modal-image' :src="modalItemData.url">
                    <div id='modal-image-dets' >
                        <div id="title-username">
                            <h2>{{modalItemData.title}}</h2> <h3>by</h3><h2> {{modalItemData.username}}</h2>
                        </div>
                        <div id="vote-tag">
                            <img v-on:click="$emit('vote', modalItemData.id, 'up')" class="arrow" src="./css/arrow.svg" alt="">
                            <div>{{modalItemData.score}}</div>
                            <img v-on:click="$emit('vote', modalItemData.id)" class="arrow down" src="./css/arrow.svg" alt="">
                            <div> {{modalItemData.tag}} </div>
                        </div>
                    </div>
                    <div id='newcomment' class='comment'>
                        <div v-if='commentingOn' @click="commentingOn = 0">Commenting on comment#{{commentingOn}} (click to reply on parent)</div>
                        <textarea class='comment' v-model='content' name='content' type='text' placeholder='write your stuff' rows="4" cols="50"></textarea>
                        <input class='name' v-model='name' name='name' type='text' placeholder='your name'>
                        <input v-on:click="newComment" type="submit" value="Submit">
                    </div>
                    <commentdiv :comments='commentsNested'></commentdiv>

            </div>
        </div>
    `,
    watch: {
        modalitem: function () {
            if(this.modalitem) {
                axios.get('/content/'+this.modalitem).then(function({data}) {
                    this.modalItemData = data[0]
                }.bind(this))
                .catch(error => console.log(error))

                this.loadComments()
            }
        }
    },
    mounted: function(){

        window.addEventListener("click", function (e) {
            if(e.target.parentNode.nextSibling && e.target.parentNode.nextSibling.classList && e.target.parentNode.nextSibling.classList.contains('idx')) {
                this.commentingOn = e.target.parentNode.nextSibling.innerText
            }
        }.bind(this))
    },
    methods: {

        loadComments () {
            axios.get('/comment/' + this.modalitem).then(function({data}) {
                this.comments = data
                this.handleComments(data, '0')
            }.bind(this))
            .catch(error => console.log(error))
        },

        addHidden(e){
            document.getElementById('image-modal').classList.add('hidden')
            window.history.back()
        },

        newComment () {
            axios.post('/comment', {name: this.name, content: this.content, id: this.modalitem, parent: this.commentingOn}).then(function(res) {
                if(res.status === 200){
                    this.loadComments()
                    this.name = this.content = ''
                }else{
                    console.log('ERROR status ' + res.status);
                }
            }.bind(this))
        },
        handleComments(arr, parent){
            this.commentsNested = handleNested(arr, parent)
            function handleNested(arr, parent){
                const out = []
                for(let i in arr) {
                    if(arr[i].parentcomment == parent) {
                        var children = handleNested(arr, arr[i].id)

                        if(children.length) {
                            arr[i].children = children
                        }
                        out.push(arr[i])
                    }
                }
                return out
            }
        },
    }

});
