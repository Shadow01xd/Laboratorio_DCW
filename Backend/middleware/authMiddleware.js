const jwt = require('jsonwebtoken')

// 🔒 Middleware obligatorio: protege rutas privadas
const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido o expirado' })
  }
}

// 🟣 Middleware opcional: no lanza error si no hay token
const verificarTokenOptional = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return next()

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
  } catch (err) {
    // Token inválido, continuar sin req.user
  }

  next()
}

module.exports = {
  verificarToken,
  verificarTokenOptional
}
