const router = require('express').Router()
const { resolve, join } = require('path')
const fs = require('fs');
const multiparty = require('multiparty')
const { getFileType, uniqId, fullUrl } = require(resolve('utils/file'))
const AWS = require('aws-sdk');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Upload S3', url: ''})
})

router.post('/', (req, res, next) => {
  const config = {
    bucket: 'jonathan-images',
    accessKeyId: 'AKIAJNN72LIWVHZGVCCQ',
    secretAccessKey: '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'
  }

  const form = new multiparty.Form()
  form.parse(req, (err, fields, { file }) => {
    file.forEach(({ originalFilename, path, headers }) => {
      fs.readFile(path, (err, tmpFile) => {
        if (err) res.send(err)
        const pathFile = `images/${uniqId()}.${getFileType(originalFilename)}`
        const s3obj = new AWS.S3({
          params: {
            ContentType: headers['content-type'],
            Bucket: config.bucket, 
            Key: pathFile
          }
        })

        s3obj.config.accessKeyId = config.accessKeyId
        s3obj.config.secretAccessKey = config.secretAccessKey

        s3obj.upload({Body: tmpFile})
        .on('httpUploadProgress', evt => console.log)
        .send((err, { Location }) => { 
          if (err) res.json(err)
          res.render('index', {title: 'Success', url: Location})
        });
      })
    })
  })
})

module.exports = router