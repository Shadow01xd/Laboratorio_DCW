const express = require('express')
const router = express.Router()
const { enviarConsulta } = require('../controllers/consultationController')

// ---------------------------
// 📩 Ruta para enviar consultas
// ---------------------------
router.post('/', enviarConsulta)

module.exports = router
