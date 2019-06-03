(()=>{
    const DEFAULTS = {
        form: {
            title: '',
            description: '',
            name: '',
            tags: '',
            file: null,
        }
    }

    new Vue({
        el:'#main',
        data: {
            items: [],
            tags: [],
            title: '',
            description: '',
            name: '',
            formtags: '',
            file: '',
            current: '',
            picsPerPage: "6",
            offset: "0",
            recentUpload: null,
            totalPics: null,
            // Voting needs to be wrapped in 5sec delay
            voting: null,

        },
        mounted: function(){

            this.loadImages()

            window.addEventListener("dragenter", function (e) {
                    document.querySelector("#dropzone").style.visibility = "";
                    document.querySelector("#dropzone").style.opacity = 1;
                    document.querySelector("#textnode").style.fontSize = "48px";
            });

            window.addEventListener("dragleave", function (e) {
                e.preventDefault();
                document.querySelector("#dropzone").style.visibility = "hidden";
                document.querySelector("#dropzone").style.opacity = 0;
                document.querySelector("#textnode").style.fontSize = "42px";
            });

            window.addEventListener("dragover", function (e) {
                e.preventDefault();
                document.querySelector("#dropzone").style.visibility = "";
                document.querySelector("#dropzone").style.opacity = 1;
                document.querySelector("#textnode").style.fontSize = "48px";
            });

            window.addEventListener("drop", function (e) {
                e.preventDefault();
                document.querySelector("#dropzone").style.visibility = "hidden";
                document.querySelector("#dropzone").style.opacity = 0;
                document.querySelector("#textnode").style.fontSize = "42px";
                this.showSubmit()
            }.bind(this));



            this.current = location.hash.slice(1);

            window.addEventListener('hashchange', function() {
                console.log(location.hash);
                const hash = location.hash.slice(1)
                if(hash.indexOf('/') === -1) {
                    this.current = hash;
                }else{
                    const hashDets = hash.split('/')
                    this.picsPerPage = hashDets[0]
                    this.offset = hashDets[1]
                }
            }.bind(this))
        },
        methods: {
            vote: function (id, up) {
                for (let item of this.items) {
                    if (item.id === id) {
                        up ? item.score++ : item.score--
                    }
                }
                this.syncVote(id, up ? 1 : -1)
                this.sortImages()
            },
            syncVote(id, score) {
                const data = {
                    id,
                    score
                }
                axios.post('/score', data)
                .then(x=>x)
                .catch(err => console.log(err))
            },
            sortTags: function () {
                const temp = []
                this.items.forEach(el => {
                    temp.push(...el.tag)
                })
                this.tags = [...new Set(temp)]

            },
            sortImages: function () {
                this.items.sort((a,b) => ((b.score * 10000000000) / (Date.now() - b.created_at)) - (a.score * 10000000000) / (Date.now() - a.created_at))
            },

            handleFileSelect (e) {
                this.file = e.target.files[0]
            },

            drop (e) {
                // console.log(e);
            },

            submitNew () {
                if(this.recentUpload === this.file) return console.log('file uploaded already')
                const formToSubmit = new FormData();
                formToSubmit.append('file', this.file)
                formToSubmit.append('title', this.title)
                formToSubmit.append('description', this.description)
                formToSubmit.append('name', this.name)
                formToSubmit.append('tags', this.formtags)

                axios.post('/upload', formToSubmit).then(function(res) {

                    if(res.status === 200){
                        this.recentUpload = this.file
                        this.title = this.description = this.name = this.formtags = this.file = ''

                    }else{
                        console.log('ERROR status ' + res.status);
                    }
                    this.addHidden()
                }.bind(this))
            },
            showSubmit () {
                document.getElementById('submit-modal').classList.remove('hidden')
            },
            addHidden () {
                document.getElementById('submit-modal').classList.add('hidden')
            },
            linkTo: function (id) {
                location.href = window.location.origin + '/#' + id
            }.bind(this),
            loadImages: function (more) {
                console.log('loading...');
                if(!more) {this.state.file
                    this.items = []
                }
                axios.get('/contents/' + this.picsPerPage + '/' + this.offset).then(function({data}) {
                    this.items.push(...data.pics)
                    this.totalPics = data.count
                    this.offset = Number(this.offset) + Number(this.picsPerPage)
                    this.sortTags()
                    this.sortImages()
                }.bind(this))
                .catch(error => console.log(error))
            },


        },
        watch: {
            current: function () {
                if (this.current) {
                    document.getElementById('image-modal').classList.remove('hidden')
                }

            }
        }

    })
})()
