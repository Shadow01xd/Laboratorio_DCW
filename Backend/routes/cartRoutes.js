const express = require('express')
const router = express.Router()
const { verificarToken } = require('../middleware/authMiddleware')
const {
  obtenerCarrito,
  agregarAlCarrito,
  eliminarDelCarrito,
  actualizarCantidad
} = require('../controllers/cartController')

// ---------------------------
// 🛒 Rutas de carrito de compras
// ---------------------------

// Requieren autenticación
router.use(verificarToken)

// Obtener el carrito del usuario actual
router.get('/', obtenerCarrito)

// Agregar un servicio al carrito
router.post('/', agregarAlCarrito)

// Eliminar un servicio del carrito
router.delete('/:servicioId', eliminarDelCarrito)

// Actualizar cantidad de un servicio en el carrito
router.put('/:servicioId', actualizarCantidad)

module.exports = router
