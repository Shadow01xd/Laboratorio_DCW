const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const {
  obtenerServicios,
  obtenerServicio,
  crearServicio,
  actualizarServicio,
  eliminarServicio
} = require('../controllers/serviceController')
const { verificarToken } = require('../middleware/authMiddleware')
const { verificarAdmin } = require('../middleware/verificarAdmin')

// ----------------------------
// 🗂 Crear carpeta si no existe
// ----------------------------
const uploadDir = path.join(__dirname, '..', 'uploads', 'servicios')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// ----------------------------
// 📷 Configuración de Multer
// ----------------------------
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, '_')
    const uniqueName = `${Date.now()}-${cleanName}`
    cb(null, uniqueName)
  }
})

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase()
  const allowed = ['.jpg', '.jpeg', '.png', '.gif']
  if (allowed.includes(ext)) cb(null, true)
  else cb(new Error('Solo se permiten imágenes (jpg, jpeg, png, gif)'))
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
})

// ----------------------------
// 🛡️ Rutas protegidas
// ----------------------------

// Requiere usuario autenticado
router.use(verificarToken)

// Acceso para todos los autenticados
router.get('/', obtenerServicios)
router.get('/:id', obtenerServicio)

// Acceso solo para admin
router.use(verificarAdmin)

router.post('/', upload.single('imagen'), crearServicio)
router.put('/:id', upload.single('imagen'), actualizarServicio)
router.delete('/:id', eliminarServicio)

module.exports = router
