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
    Bucket: 'jonathan-images',
    accessKeyId: "AKIAJMEQCK3EU2VM3XOA",
    secretAccessKey: "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",
  }

  const form = new multiparty.Form()
  form.parse(req, (err, fields, files) => {
    files.file.forEach(({ originalFilename, path }) => {
      fs.readFile(path, (err, tmpFile) => {
        if (err) res.send(err)
        const pathFile = `images/${uniqId()}.${getFileType(originalFilename)}`
        
        let s3obj = new AWS.S3({
          params: {
            Bucket: config.Bucket,
            Key: pathFile
          }
        })

        s3obj.config.accessKeyId = config.accessKeyId
        s3obj.config.secretAccessKey = config.secretAccessKey

        s3obj.upload({Body: tmpFile})
        .on('httpUploadProgress', function(evt) { console.log(evt); })
        .send(function(err, { Location }) { 
          if (err) res.send(err)
          res.render('index', {title: 'Success', url: Location})
         });
      })
    })
  })
})

module.exports = router