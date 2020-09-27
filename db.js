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
    LIMIT 9`; // descending id order!

    const params = [];
    ///
    return db.query(q);
};

module.exports.getMoreImages = (lastId) => {
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
    // const q = `
    // SELECT *
    // FROM images
    // WHERE id = $1`;
    const q = `
    SELECT *,
    (SELECT id FROM images WHERE id > $1 LIMIT 1) AS "prevId",
    (SELECT id FROM images WHERE id < $1 ORDER BY id DESC LIMIT 1) AS "nextId"
    FROM images
    WHERE id = $1`;
    const params = [image_id];
    ///
    return db.query(q, params);
};

// SELECT *,
// (SELECT id FROM images WHERE id > 10 LIMIT 1) AS "prevId",
// (SELECT id FROM images WHERE id < 10 ORDER BY id DESC LIMIT 1) AS "nextId"
// FROM images
// WHERE id = 10

module.exports.deleteImageById = (image_id) => {
    const q = `
DELETE
FROM images
WHERE id = $1
    `;
    const params = [image_id];
    return db.query(q, params);
};

module.exports.deleteCommentsByImageId = (image_id) => {
    const q = `
    DELETE
    FROM comments
    WHERE image_id = $1
    `;
    const params = [image_id];
    return db.query(q, params);
};

// DELETE i.*, c.*
// FROM images c
// LEFT JOIN comments c ON i.id = c.image_id
// WHERE i.id = $1

// DELETE T1, T2
// FROM T1
// INNER JOIN T2 ON T1.key = T2.key
// WHERE condition;

// DELETE FROM images, comments INNER JOIN comments
// WHERE images.id = comments.image_id and images.id = '3'

// DELETE images, comments FROM images INNER JOIN comments
// WHERE images.id = comments.image_id and images.id = '3'
// DELETE messages , usersmessages  FROM messages  INNER JOIN usersmessages
// WHERE messages.messageid= usersmessages.messageid and messages.messageid = '1'

// DELETE
// FROM images
// WHERE id = 2;
// DELETE FROM comments WHERE image_id =2;

// SELECT *,
// (SELECT id FROM images WHERE id > 1 LIMIT 1) AS "prevId",
// (SELECT id FROM images WHERE id < 1 ORDER BY id DESC LIMIT 1) AS "nextId"
// FROM images
// WHERE id = 1

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
