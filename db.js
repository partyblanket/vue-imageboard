const spicedPg = require('spiced-pg');

const dbUrl = process.env.DATABASE_URL || 'postgres:postgres:postgres@localhost:5432/board';

const db = spicedPg(dbUrl);

exports.load = () => {
    const q = `SELECT * FROM images`
    const params = [];
    return db.query(q, params)
}
