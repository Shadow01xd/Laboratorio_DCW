const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { verificarToken } = require('../middleware/authMiddleware')
const { verificarAdmin } = require('../middleware/verificarAdmin')
const bcrypt = require('bcryptjs')

// Middleware global: todas las rutas protegidas con token
router.use(verificarToken)

// 🟡 Actualizar perfil del usuario autenticado
router.put('/update-profile', async (req, res) => {
  try {
    const { nombre, email, password } = req.body
    const userId = req.user.id

    const datosActualizar = {}

    if (nombre) datosActualizar.nombre = nombre
    if (email) {
      const existente = await User.findOne({ email, _id: { $ne: userId } })
      if (existente) return res.status(400).json({ message: 'El email ya está en uso' })
      datosActualizar.email = email
    }

    if (password) {
      const salt = await bcrypt.genSalt(10)
      datosActualizar.password = await bcrypt.hash(password, salt)
    }

    const usuario = await User.findByIdAndUpdate(userId, datosActualizar, { new: true }).select('-password')
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' })

    res.json(usuario)
  } catch (err) {
    console.error('❌ Error al actualizar perfil:', err)
    res.status(500).json({ message: 'Error al actualizar el perfil' })
  }
})

// ---------------------- Rutas solo para ADMIN ----------------------
router.use(verificarAdmin)

// ✅ Obtener todos los usuarios
router.get('/', async (_req, res) => {
  try {
    const usuarios = await User.find().select('-password')
    res.json(usuarios)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuarios' })
  }
})

// ✅ Obtener un usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id).select('-password')
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' })
    res.json(usuario)
  } catch (err) {
    res.status(400).json({ message: 'ID inválido o error al buscar usuario' })
  }
})

// ✅ Actualizar un usuario por ID
router.put('/:id', async (req, res) => {
  try {
    const { nombre, email, rol } = req.body

    const usuarioActualizado = await User.findByIdAndUpdate(
      req.params.id,
      { nombre, email, rol },
      { new: true }
    ).select('-password')

    if (!usuarioActualizado) return res.status(404).json({ message: 'Usuario no encontrado' })

    res.json(usuarioActualizado)
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar usuario' })
  }
})

// ✅ Eliminar un usuario por ID
router.delete('/:id', async (req, res) => {
  try {
    const usuario = await User.findByIdAndDelete(req.params.id)
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' })

    res.json({ message: 'Usuario eliminado correctamente' })
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar usuario' })
  }
})

module.exports = router
