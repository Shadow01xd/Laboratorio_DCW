const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const technologyController = require('../controllers/technologyController')

// 🔧 Directorio de destino
const uploadDir = path.join(__dirname, '..', 'uploads', 'technologies')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// 🎯 Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const fileName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_')
    cb(null, fileName)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true)
  else cb(new Error('Solo se permiten archivos de imagen'))
}

const upload = multer({ storage, fileFilter })

// --------------------------
// 🧠 Rutas API tecnologías
// --------------------------

router.get('/', technologyController.getAllTechnologies)
router.get('/:id', technologyController.getTechnologyById)
router.post('/', upload.single('image'), technologyController.createTechnology)
router.put('/:id', upload.single('image'), technologyController.updateTechnology)
router.delete('/:id', technologyController.deleteTechnology)

module.exports = router
