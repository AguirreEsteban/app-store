module.exports = {
    port: process.env.PORT || 3000,
    mongoUri: process.env.NODE_ENV == 'production' ? process.env.MONGO_URI : 'mongodb://localhost:27017/store',
    AWS : {
        awsId : process.env.AWS_ID,
        awsSecret: process.env.AWS_SECRET,
        awsBucketName: process.env.AWS_BUCKET_NAME
    },
    urlLogo: process.env.LOGO_DEFAULT
}