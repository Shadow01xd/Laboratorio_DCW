const User = require('../models/User')

// ─── Obtener todos los usuarios ─────────────────────
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find().select('-password')
    res.status(200).json(usuarios)
  } catch (err) {
    console.error('❌ Error al obtener usuarios:', err)
    res.status(500).json({ message: 'Error al obtener la lista de usuarios.' })
  }
}

// ─── Eliminar un usuario por ID ─────────────────────
const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id)
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' })
    }

    await usuario.deleteOne()
    res.status(200).json({ message: 'Usuario eliminado correctamente.' })
  } catch (err) {
    console.error('❌ Error al eliminar usuario:', err)
    res.status(500).json({ message: 'Error al eliminar usuario.' })
  }
}

// ─── Actualizar un usuario por ID ─────────────────────
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, email, rol } = req.body

    const usuario = await User.findById(id)
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' })
    }

    if (nombre) usuario.nombre = nombre.trim()
    if (email) usuario.email = email.trim()
    if (rol) usuario.rol = rol

    await usuario.save()
    res.status(200).json({ message: 'Usuario actualizado correctamente.', usuario })
  } catch (err) {
    console.error('❌ Error al actualizar usuario:', err)
    res.status(500).json({ message: 'Error al actualizar usuario.' })
  }
}

module.exports = {
  obtenerUsuarios,
  eliminarUsuario,
  actualizarUsuario
}
