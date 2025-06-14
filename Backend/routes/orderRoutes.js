const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')
const { verificarToken } = require('../middleware/authMiddleware')

// ---------------------------
// 🔐 Middleware de autenticación
// ---------------------------
router.use(verificarToken)

// ---------------------------
// 🧾 Rutas de órdenes del usuario
// ---------------------------
router.post('/', orderController.createOrder)           // Crear nueva orden
router.get('/', orderController.getUserOrders)          // Obtener todas las órdenes del usuario
router.get('/:id', orderController.getOrderById)        // Obtener detalle de una orden

module.exports = router
