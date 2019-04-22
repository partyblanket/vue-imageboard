const spicedPg = require('spiced-pg');

const dbUrl = process.env.DATABASE_URL || 'postgres:postgres:postgres@localhost:5432/board';

const db = spicedPg(dbUrl);

exports.load = (amnt, offset) => {
    const date = Date.now()
    const q = `SELECT id, url, description, score, tag, created_at, username, (score * 10000000000::bigint) / (${date} - created_at) as timescore
                FROM images
                ORDER BY timescore DESC
                LIMIT $1
                OFFSET $2
                `
    const params = [amnt, offset];
    return db.query(q, params)
}

exports.count = () => {
    const q = `SELECT COUNT (id)
                FROM images
                `
    const params = [];
    return db.query(q, params)
}

exports.new = (url, username, title, description, score, tag, created_at) => {
    const q = `INSERT INTO images (url, username, title, description, score, tag, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`
    const params = [url, username, title, description, score, tag, created_at];
    return db.query(q, params)
}

exports.loadSingleImage = (id) => {
    const q = `SELECT * FROM images WHERE $1 = id`
    const params = [id];
    return db.query(q, params)
}

exports.newComment = (imageid, comment, username, created_at, parentcomment) => {
    const q = `INSERT INTO comments (imageid, comment, username, created_at, parentcomment)
        VALUES ($1, $2, $3, $4, $5)`
    const params = [imageid, comment, username, created_at, parentcomment];
    return db.query(q, params)
}

exports.loadComments = (id) => {
    const q = `SELECT * FROM comments WHERE imageid = $1 ORDER BY created_at DESC`
    const params = [id];
    return db.query(q, params)
}

exports.vote = (int, id) => {
    console.log(int, id);
    // how to improve, got error when using VALUES
    const q = `UPDATE images SET score = score + ${int} WHERE id = ${id}`
    const params = [];
    return db.query(q, params)
}
