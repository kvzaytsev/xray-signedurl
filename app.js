const aws = require('aws-sdk');
const xray = require('aws-xray-sdk');
const express = require('express');

const accessKeyId = 'test-access-key-id';
const secretAccessKey = 'test-secret-access-key';
const region = 'test-region';

aws.config.update({
  credentials: { accessKeyId, secretAccessKey },
  region,
});

const s3 = xray.captureAWSClient(new aws.S3());
const app = express();

app.use(xray.express.openSegment('test'));

app.get('/test', (req, res, next) => {
  s3.getSignedUrl('putObject', { Bucket: 'test-bucket', Key: 'test/key'}, (err, url) => {
    if (err) next (err);
    else res.json({ url });
  });
});

app.use(xray.express.closeSegment());

app.use((err, req, res, next) => {
  res.status(500).json(err);
});

module.exports = app;
