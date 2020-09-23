const express = require("express");
const app = express();

const db = require("./db");

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const s3 = require("./s3");

const config = require("./config");

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
app.use(express.static("./public"));

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.use(
    // makes req.body accessible
    express.urlencoded({
        extended: false,
    })
);

// initialize images
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

app.get("/image/:image_id", (req, res) => {
    console.log("/image/:image_id dynamic route has been hit!!");
    console.log();
    db.getImageById(req.params.image_id)
        .then((result) => {
            console.log(result.rows[0]);
            res.json(result.rows[0]);
        })
        .catch((err) => console.log(err));
    // send response to axios
    // do db request here.
});

// url-encoded is not neede here because of multer
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("file", req.file);
    console.log("input", req.body);
    // 1. insert arow for the image into db
    // 2. send an object representing the new image back to the client as json
    // the client can then add it to the images area it has so we can see it

    if (req.file) {
        db.addImage(
            req.body.title,
            req.body.username,
            req.body.description,
            config.s3Url + req.file.filename
        )
            .then((result) => {
                // now what??
                console.log("rows", result.rows[0]);
                console.log("unshift here to data obj images array");
                console.log("req.body.data", req.body.data);
                console.log("image added to db... !!!!!!!!!!!!!!!!!!!!!!!!!");

                res.json(result.rows[0]);
            })
            .catch((err) => {
                res.json(rows[0]);

                // res.json({ image: rows[0]})
                console.log(err);
            });

        // res.json({
        //     // eventually make db insert here

        //     success: true,
        // });
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
