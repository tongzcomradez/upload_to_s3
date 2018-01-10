const router = require('express').Router()
const { resolve, join } = require('path')
const fs = require('fs');
const multiparty = require('multiparty')
const { getFileType, uniqId, fullUrl } = require(resolve('utils/file'))

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Upload S3', url: ''})
})

router.post('/', (req, res, next) => {
  const form = new multiparty.Form()
  form.parse(req, (err, fields, files) => {
    files.file.forEach(({ originalFilename, path }) => {
      fs.readFile(path, (err, tmpFile) => {
        if (err) res.send(err)
        const pathFile = `images/${uniqId()}.${getFileType(originalFilename)}`
        fs.writeFile(`./public/${pathFile}`, tmpFile, err => {
          if (err) res.send(err)

          res.render('index', {title: 'Success', url: fullUrl(req, pathFile) })
        })
      })
    })
  })
})


module.exports = router
