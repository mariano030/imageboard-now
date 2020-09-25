const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getImages = () => {
    const q = `
    SELECT *
    FROM images 
    ORDER BY id DESC
    LIMIT 6`; // descending id order!

    const params = [];
    ///
    return db.query(q);
};

module.exports.getMoreImages = (lastId) => {
    //new
    const q = `
        SELECT *, (
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1) AS "lowestId" FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 10;`;
    const params = [lastId];
    return db.query(q, params);
};

// will be done in the other query as secondary select
module.exports.getLastImageId = () => {
    const q = `
    SELECT id FROM images
    ORDER BY id ASC
    LIMIT 1`;
    return db.query(q);
};

module.exports.getImageById = (image_id) => {
    const q = `
    SELECT *
    FROM images 
    WHERE id = $1`; // descending id order!

    const params = [image_id];
    ///
    return db.query(q, params);
};

module.exports.getCommentsById = (image_id) => {
    const q = `
    SELECT *
    FROM comments
    WHERE image_id = $1
    ORDER BY created_at DESC`;
    const params = [image_id];
    return db.query(q, params);
};

module.exports.addComment = (username, text, imageId) => {
    const q = `
    INSERT INTO comments (username, text, image_id)
    values ($1,$2,$3)
    RETURNING *`;
    const params = [username, text, imageId];
    return db.query(q, params);
};

module.exports.addImage = (title, username, description, url) => {
    const q = `
    INSERT INTO images (title,username,description,url)
    values ($1,$2,$3,$4)
    RETURNING *
    `;
    const params = [title, username, description, url];
    return db.query(q, params);
};

// url VARCHAR NOT NULL,
//     username VARCHAR NOT NULL,
//     title VARCHAR NOT NULL,
//     description TEXT,
