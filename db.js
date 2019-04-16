const spicedPg = require('spiced-pg');

const dbUrl = process.env.DATABASE_URL || 'postgres:postgres:postgres@localhost:5432/board';

const db = spicedPg(dbUrl);

exports.load = () => {
    const q = `SELECT * FROM images ORDER BY id DESC`
    const params = [];
    return db.query(q, params)
}

exports.new = (url, username, title, description, score, tag) => {
    const q = `INSERT INTO images (url, username, title, description, score, tag)
        VALUES ($1, $2, $3, $4, $5, $6)`
    const params = [url, username, title, description, score, tag];
    return db.query(q, params)
}
