const express = require("express");
const app = express();

const db = require("./db");

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

// middleware
app.use(express.static("public"));

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

let cities = [
    { name: "Berlin", country: "DE" },
    { name: "Guayaquil", country: "Ecuador" },
    { name: "Oslo", country: "Spain" },
];

let images = [];

app.get("/images", (req, res) => {
    console.log("/images route has been hit!!");
    db.getImages()
        .then((result) => {
            console.log(result.rows);
            res.json(result.rows);
        })
        .catch((err) => console.log(err));
    // send response to axios
    // do db request here.
});

// url-encoded is not neede here because of multer
app.post("/upload", uploader.single("file"), (req, res) => {
    console.log("file", req.file);
    console.log("input", req.body);
    if (req.file) {
        res.json({
            // eventually make db insert here
            success: true,
        });
    } else {
        res.json({
            // eventually make db insert here
            success: false,
        });
    }
});

app.listen(3000, () =>
    console.log(
        "##~~~~~~~~~~~~ ImageBoard server is listening... on port 3000 ~~~~~~~~~~~~##"
    )
);
