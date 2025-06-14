require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const connectDB = require('./config/db')

// Rutas
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const cartRoutes = require('./routes/cartRoutes')
const adminRoutes = require('./routes/adminRoutes')
const serviceRoutes = require('./routes/serviceRoutes')
const consultationRoutes = require('./routes/consultationRoutes')
const technologyRoutes = require('./routes/technologyRoutes')
const orderRoutes = require('./routes/orderRoutes')

// Conectar a la BD
connectDB()

const app = express()

// CORS con origen permitido (whitelist)
const whitelist = [
  'http://localhost:5173',
  'https://laboratoriodcw.netlify.app',
  'https://mielda.netlify.app'
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true)
    } else {
      console.warn('❌ Origen bloqueado por CORS:', origin)
      callback(new Error('No permitido por CORS'))
    }
  },
  credentials: true
}))

// Middleware para JSON
app.use(express.json())

// Servir archivos estáticos (por ejemplo imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Rutas de la API
app.use('/api/auth', authRoutes)
app.use('/api/usuarios', userRoutes)
app.use('/api/carrito', cartRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/servicios', serviceRoutes)
app.use('/api/consultas', consultationRoutes)
app.use('/api/tecnologias', technologyRoutes)
app.use('/api/ordenes', orderRoutes)

// Ruta raíz para test
app.get('/', (req, res) => {
  res.send('🌐 API de Laboratorio DCW funcionando correctamente')
})

// Middleware global de errores
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { error: err })
  })
})

// Puerto
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://laboratoriodcw-production.up.railway.app'
    : `http://localhost:${PORT}`

  console.log(`🚀 Servidor corriendo en ${baseUrl}`)
})
