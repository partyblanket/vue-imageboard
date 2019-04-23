//// TODO:
// show newest pic at top to all user when upload occurs
//
//
//
//
const express = require('express')
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const fs = require('fs');
const knox = require('knox-s3');


const db = require('./db')

const app = express()

const PORT = process.env.PORT || 8080

//handles file uploads ==>
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
      uidSafe(24).then(function(uid) {
          callback(null, uid + path.extname(file.originalname));
      });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
//<===

// handles S3 ===>
let secrets;
if (process.env.NODE_ENV === 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('./secrets.json'); // secrets.json is in .gitignore
}

const client = knox.createClient({
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
    bucket: 'tabascoimageboard'
});

function uploadToAWS(req, res, next) {
    if (!req.file) {
        return res.sendStatus(500);
    }
    const s3Request = client.put(req.file.filename, {
        'Content-Type': req.file.mimetype,
        'Content-Length': req.file.size,
        'x-amz-acl': 'public-read'
    });
    const stream = fs.createReadStream(req.file.path);
    stream.pipe(s3Request);

    s3Request.on('response', s3Response => {
        console.log(s3Response.statusCode, req);
        if (s3Response.statusCode == 200) {
            next();
            fs.unlink(req.file.path, () => {});
        } else {
            res.sendStatus(500);
        }
    });
};

//<====
app.use(express.static('./public'))

app.use(require('body-parser').json())

app.get('/contents/:amnt/:offset', (req,res) => {
    const {amnt, offset} = req.params
    Promise.all([
        db.load(amnt, offset),
        db.count()
    ]).then(response => {
        return res.json({pics: response[0].rows, count: response[1].rows[0].count})
    })
})

app.get('/content/:id', (req,res) => {
    db.loadSingleImage(req.params.id).then(({rows}) => res.json(rows))
})

app.get('/comment/:id', (req,res) => {
    db.loadComments(req.params.id).then(({rows}) => res.json(rows))
})

app.post('/comment', (req,res) => {
    const {id, content, name, parent} = req.body
    db.newComment(id, content, name, Date.now(), Number(parent))
        .then(response => {
            return res.sendStatus(200)
        })
        .catch(e => res.sendStatus(500))
})

app.post('/score', (req,res) => {
    const {score, id} = req.body
    if(score > 5) {
        score = 5
    }else if (score < -5){
        score = -5
    }
    console.log(score, id);
    db.vote(score, id)
        .then(response => {
            return res.sendStatus(200)
        })
        .catch(e => {
            console.log(e)
            res.sendStatus(500)
        })
})

app.post('/upload', uploader.single('file'), uploadToAWS, function(req, res) {
    // If nothing went wrong the file is already in the uploads directory
        const url = 'https://s3.amazonaws.com/tabascoimageboard/' + req.file.filename
        db.new(url, req.body.name, req.body.title, req.body.description, 1, req.body.tags.split(','), Date.now()).then(res => console.log(res))
            .then((data) => {
                res.json({
                    success: true,
                    data
                });
            })


});

app.listen(PORT, () => console.log(`listening to port ${PORT}`))
