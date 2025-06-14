require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const connectDB = require('./config/db') // mejor separar conexión

// Rutas
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const cartRoutes = require('./routes/cartRoutes')
const adminRoutes = require('./routes/adminRoutes')
const serviceRoutes = require('./routes/serviceRoutes')
const consultationRoutes = require('./routes/consultationRoutes')
const technologyRoutes = require('./routes/technologyRoutes')
const orderRoutes = require('./routes/orderRoutes')

// Conectar a MongoDB
connectDB()

// Inicializar app
const app = express()

// Middlewares globales
app.use(cors())
app.use(express.json())

// Servir archivos estáticos (por si subes imágenes, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Endpoints de API
app.use('/api/auth', authRoutes)
app.use('/api/usuarios', userRoutes)
app.use('/api/carrito', cartRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/servicios', serviceRoutes)
app.use('/api/consultas', consultationRoutes)
app.use('/api/tecnologias', technologyRoutes)
app.use('/api/ordenes', orderRoutes)

// Ruta raíz para probar conexión
app.get('/', (req, res) => res.send('🌐 API funcionando correctamente'))

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  })
})

// ---------------------------
// 🚀 LEVANTAR SERVIDOR
// ---------------------------
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://laboratorio-dcw-production.up.railway.app' // 👈 cámbialo por tu URL real
      : `http://localhost:${PORT}`

  console.log(`🚀 Servidor corriendo en ${baseUrl}`)
})
