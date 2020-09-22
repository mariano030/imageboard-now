const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getImages = () => {
    const q = `
    SELECT url, username, title, description
    FROM images `;

    const params = [];
    ///
    return db.query(q);
};

// url VARCHAR NOT NULL,
//     username VARCHAR NOT NULL,
//     title VARCHAR NOT NULL,
//     description TEXT,
