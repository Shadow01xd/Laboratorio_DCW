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

// CORS con origen permitido
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}))

// Middleware para JSON
app.use(express.json())

// Servir archivos estáticos (para imágenes u otros)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Rutas API
app.use('/api/auth', authRoutes)
app.use('/api/usuarios', userRoutes)
app.use('/api/carrito', cartRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/servicios', serviceRoutes)
app.use('/api/consultas', consultationRoutes)
app.use('/api/tecnologias', technologyRoutes)
app.use('/api/ordenes', orderRoutes)

// Ruta raíz de test
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

// Puerto y arranque
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://laboratoriodcw-production.up.railway.app'
    : `http://localhost:${PORT}`

  console.log(`🚀 Servidor corriendo en ${baseUrl}`)
})
