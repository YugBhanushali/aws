const express = require("express");
const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client } = require("@aws-sdk/client-s3");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const app = express();
var dotenv = require("dotenv");
dotenv.config();

app.use(express.json());

app.use(fileUpload());

const accessKeyId = process.env.KEYID;
const secretAccessKey = process.env.SECRETKEY;
const region = process.env.REGION;
const Bucket = process.env.BUCKET;

app.get("/", (req, res) => {
  res.send(`
      <h2>File Upload With <code>"Node.js"</code></h2>
      <form action="/api/upload" enctype="multipart/form-data" method="post">
        <div>Select a file: 
          <input type="file" name="file" multiple="multiple" />
        </div>
        <input type="submit" value="Upload" />
      </form>
  
    `);
});

app.post("/api/upload", (req, res) => {
  let currFileName = req.files.file;

  // upload to S3
  new Upload({
    client: new S3Client({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region,
    }),
    params: {
      ACL: "public-read",
      Bucket,
      Key: currFileName.name,
      Body: currFileName.data,
    },
    tags: [], // optional tags
    queueSize: 4, // optional concurrency configuration
    partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
    leavePartsOnError: false, // optional manually handle dropped parts
  })
    .done()
    .then((data) => {
      console.log(data);
      res.status(201).json({ status: "success", data });
    })
    .catch((err) => {
      console.log(err);
      res.status(501).json({ status: "success", err });
    });
});

app.listen(8080, () => {
  console.log("Server at port 8080");
});
