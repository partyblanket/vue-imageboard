DROP TABLE IF EXISTS images;


CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR(300) NOT NULL,
    username VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    score INTEGER,
    tag VARCHAR(50)[],
    created_at BIGINT
);

DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    score INTEGER,
    comment TEXT NOT NULL,
    username VARCHAR(255) NOT NULL,
    parentcomment INTEGER,
    imageid INTEGER REFERENCES images(id) ON DELETE CASCADE NOT NULL,
    created_at BIGINT
);

INSERT INTO images (url, username, title, description, score, tag) VALUES (
    'https://s3.amazonaws.com/spicedling/jAVZmnxnZ-U95ap2-PLliFFF7TO0KqZm.jpg',
    'funkychicken',
    'Welcome to Berlin and the future!',
    'This photo brings back so many great memories.',
    1,
    ARRAY ['kitty', 'berlin']
);
INSERT INTO images (url, username, title, description, score, tag) VALUES (
    'https://s3.amazonaws.com/spicedling/wg8d94G_HrWdq7bU_2wT6Y6F3zrX-kej.jpg',
    'discoduck',
    'Elvis',
    'We can''t go on together with suspicious minds.',
    1,
    ARRAY ['elvis', 'USA']
);


INSERT INTO images (url, username, title, description, score, tag) VALUES (
    'https://s3.amazonaws.com/spicedling/XCv4AwJdm6QuzjenFPKJocpipRNNMwze.jpg',
    'discoduck',
    'Hello Berlin',
    'This is going to be worth a lot of money one day.',
    1,
    ARRAY ['berlin']
);

SELECT id, url, description, score, tag, created_at, username, (score * 10000000000::bigint) / (1555786361321::bigint - created_at) as timescore
            FROM images
            ORDER BY timescore DESC
            LIMIT 2
            OFFSET 2
