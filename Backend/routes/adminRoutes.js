const express = require('express')
const router = express.Router()

const {
  obtenerUsuarios,
  eliminarUsuario,
  actualizarUsuario
} = require('../controllers/adminController')

const {
  verificarToken
} = require('../middleware/authMiddleware')

const {
  verificarAdmin
} = require('../middleware/verificarAdmin')

// -----------------------------
// 🛡️ Rutas protegidas para ADMIN
// -----------------------------

// Middleware global: requiere token y rol admin
router.use(verificarToken)
router.use(verificarAdmin)

// Obtener todos los usuarios
router.get('/usuarios', obtenerUsuarios)

// Eliminar un usuario
router.delete('/usuarios/:id', eliminarUsuario)

// Actualizar datos de un usuario
router.put('/usuarios/:id', actualizarUsuario)

module.exports = router
