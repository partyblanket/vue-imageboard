
(()=>{
    new Vue({
        el:'#main',
        data: {
            items: [],
            tags: [],
            form: {
                title: '',
                description: '',
                name: '',
                tags: '',
                file: null,
            },
            modalid: null,
        },
        mounted: function(){
            axios.get('/content').then(function({data}) {
                this.items = data
                this.sortTags()
            }.bind(this))
            .catch(error => console.log(error))

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

                console.log("Drop files:", files);
                this.form.file = e.dataTransfer.files[0]
                console.log(this);
                this.showSubmit()
            }.bind(this));
        },
        methods: {
            vote: function (item, up) {
                up ? item.score++ : item.score--
            }.bind(this),
            sortTags () {
                const temp = []
                this.items.forEach(el => {
                    temp.push(...el.tag)
                })
                this.tags = [...new Set(temp)]

            },openImageModal({id}){
                this.modalid = id
                document.getElementById('image-modal').classList.remove('hidden')
            },
            handleFileSelect (e) {
                this.form.file = e.explicitOriginalTarget.files[0]
            },
            submitNew () {
                const form = new FormData();
                form.append('file', this.form.file)
                form.append('title', this.form.title)
                form.append('description', this.form.description)
                form.append('name', this.form.name)
                form.append('tags', this.form.tags)
                axios.post('/upload', form).then(function(res) {
                    if(res.status === 200){
                        this.items.unshift({
                            title: this.form.title,
                            description: this.form.description,
                            tags: this.form.tags.split(','),
                            url: res.data.url,
                            score: 1,
                        })
                    }else{
                        console.log('ERROR status ' + res.status);

                    }
                    addHidden()
                }.bind(this))
            },
            showSubmit () {
                document.getElementById('submit-modal').classList.remove('hidden')
            },
            addHidden () {
                document.getElementById('submit-modal').classList.add('hidden')
            }

        },

    })
})()
