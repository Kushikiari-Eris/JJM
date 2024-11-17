const rawMaterialController = require('../controller/rawMaterialController')
const express = require('express')
const multer = require('multer')
const path = require('path')
const router = express.Router()

// Set up storage for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/') // Directory where files will be saved
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)) // Rename file with timestamp to avoid collisions
    },
  })

const upload = multer({ storage: storage })

router.post('/rawMaterial',  upload.single('image'), rawMaterialController.addRawMaterial)
router.get('/rawMaterial',  rawMaterialController.showAllRawMaterial)
router.put('/rawMaterial/:id',  upload.single('image'), rawMaterialController.editRawMaterial)
router.delete('/rawMaterial/:id',  rawMaterialController.deleteRawMaterial)

module.exports = router