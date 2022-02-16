const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const path = require('path');
const fs = require('fs')
const { AWS: { awsId, awsBucketName, awsSecret } } = require('./vars');

const s3 = new aws.S3({
  accessKeyId: awsId,
  secretAccessKey: awsSecret
})


const uploadMultiple = multer({
  storage: multerS3({
    s3,
    bucket: awsBucketName,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: 'TESTING_META_DATA' });
    },
    key: function (req, file, cb) {
      console.log("Hola mundo")
      const folderName = req.body.folderName
      cb(null, `${folderName}/` + 'store-'+Date.now() + path.extname(file.originalname));
    }
  })
})

const removeFile = async (location) => {
  const params = {
    Bucket: awsBucketName,
    Key: location
  }
  const res = await s3.deleteObject(params).promise()
  return res
}

module.exports = {
  uploadMultiple,
  removeFile
}
