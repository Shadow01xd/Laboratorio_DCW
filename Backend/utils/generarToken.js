const jwt = require('jsonwebtoken')

const generarToken = (usuario) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('Falta la clave JWT_SECRET en las variables de entorno')
  }

  return jwt.sign(
    {
      id: usuario._id,
      rol: usuario.rol
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d'
    }
  )
}

module.exports = generarToken
