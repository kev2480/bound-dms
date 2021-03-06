const express = require('express')
const router = express.Router()
const formidable = require('formidable')
const authService = require('../services/auth')()
const controller = require('../controllers/file')
const config = require('../config')

router.post('/', authService.authenticate(['jwt']), (req, res, next) => {
  // create an incoming form object
  let form = new formidable.IncomingForm()

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true

  // store all uploads in the /uploads directory
  form.uploadDir = config.uploads.directory

  form.keepExtensions = true

  form.hash = true

  // log any errors that occur
  form.on('error', function (err) {
    console.log('An error has occurred: \n' + err)
    next(err)
  })

  // parse the incoming request containing the form data
  form.parse(req, function (err, fields, uploadedFiles) {
    if (err) {
      return res.status(400).json({status: 400, errors: err})
    }

    if (!fields.projectId) {
      return res.status(400).json({status: 400, errors: 'projectId must be provided'})
    }

    if (Array.isArray(uploadedFiles['files'])) {
      controller.createMultiple(req, res, uploadedFiles['files'], fields)
    } else {
      controller.createSingle(req, res, uploadedFiles['files'], fields)
    }
  })
})

router.patch('/:id', authService.authenticate(['jwt']), controller.update)
router.delete('/:id', authService.authenticate(['jwt']), controller.delete)

module.exports = router
