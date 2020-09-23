const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getImages = () => {
    const q = `
    SELECT *
    FROM images 
    ORDER BY id DESC`; // descending id order!

    const params = [];
    ///
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
