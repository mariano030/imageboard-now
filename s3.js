const aws = require("aws-sdk");

const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("multer did not work out :(|) ");
        return res.sendStatus(500);
    }
    console.log("req.file IN upload", req.file);
    const { filename, mimetype, size, path } = req.file;

    s3.putObject({
        Bucket: "images-for-imageboard",
        ACL: "public-read",
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size,
    })
        .promise()
        .then(() => {
            // it worked!!!
            fs.unlink(path, () => {});
            next();
        })
        .catch((err) => {
            // uh oh
            console.log("could not upload to aws", err);
            res.sendStatus(500);
        });
};
