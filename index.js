require('dotenv/config');
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const cors = require('cors');
const axios = require('axios');

const port = process.env.PORT || 9000;
const app = express();
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
});
console.log("Hello");

const instance = axios.create({
  baseURL: 'https://bgtc-005.dx.commercecloud.salesforce.com'
});

const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '');
    }
});
const date = new Date();
var timeNow = date.getTime();
const imageUpload = multer({storage}).single('image');
const videoUpload = multer({storage}).single('video');

app.post('/upload-image',imageUpload, (req, res) => {
    let imageName = req.file.originalname.split('.');
    const imageExt = imageName[imageName.length - 1];
    const orderID = req.query.orderID;
    console.log(orderID);
    const imgParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `qwikcilver/${orderID}/${timeNow}.${imageExt}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read'
    }
    s3.upload(imgParams, (error, data) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).send(data);
        }
    })
});

app.listen(port, () => {
       console.log(`Server is up @ port #${port}`);
});
