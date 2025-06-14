const express = require('express')
const router = express.Router()

const {
  registrarUsuario,
  loginUsuario,
  forgotPassword,
  resetPassword
} = require('../controllers/authController')

const {
  verificarToken,
  verificarTokenOptional
} = require('../middleware/authMiddleware')

const User = require('../models/User')

// ---------------------------
// 🔐 Rutas de autenticación
// ---------------------------

// Registro: permite registrar cliente o admin (si el token es admin)
router.post('/register', verificarTokenOptional, registrarUsuario)

// Login de usuario
router.post('/login', loginUsuario)

// Solicitar restablecimiento de contraseña
router.post('/forgotpassword', forgotPassword)

// Restablecer contraseña usando código de recuperación
router.put('/resetpassword', resetPassword)

// Obtener usuario autenticado
router.get('/me', verificarToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    res.json({ user })
  } catch (err) {
    console.error('Error en /me:', err)
    res.status(500).json({ message: 'Error al obtener usuario' })
  }
})

module.exports = router
