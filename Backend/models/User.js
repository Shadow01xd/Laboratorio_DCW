const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const crypto = require('crypto') // Para generar códigos de recuperación

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio']
  },
  email: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'Debe tener al menos 6 caracteres']
  },
  rol: {
    type: String,
    enum: ['cliente', 'admin'],
    default: 'cliente'
  },
  resetPasswordToken: String,       // Código de recuperación (hasheado)
  resetPasswordExpire: Date         // Tiempo de expiración del código
}, {
  timestamps: true
})

// 🔐 Encriptar contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    next(err)
  }
})

// 🔍 Comparar contraseña ingresada vs guardada
userSchema.methods.compararPassword = function (passwordIngresada) {
  return bcrypt.compare(passwordIngresada, this.password)
}

// 🔁 Generar código numérico para recuperación de contraseña
userSchema.methods.getResetPasswordCode = function () {
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString()

  // Hash del código numérico
  this.resetPasswordToken = crypto.createHash('sha256').update(resetCode).digest('hex')

  // Código expira en 10 minutos
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

  return resetCode
}

module.exports = mongoose.model('User', userSchema)
