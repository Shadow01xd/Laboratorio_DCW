const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Crear una nueva orden desde el carrito
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // Obtener el carrito del usuario
    const cart = await Cart.findOne({ userId }).populate({
      path: 'items.servicioId',
      model: 'Service'
    }).populate({
      path: 'items.tecnologiasSeleccionadas',
      model: 'Technology'
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío' });
    }

    // Calcular totales
    const subtotal = cart.items.reduce((total, item) => {
      const totalItem = item.precioTotal * item.cantidad;
      return total + totalItem;
    }, 0);
    const impuestos = parseFloat((subtotal * 0.13).toFixed(2));
    const total = parseFloat((subtotal + impuestos).toFixed(2));

    // Crear la orden
    const orderData = {
      usuario: userId,
      items: cart.items.map(item => ({
        servicio: item.servicioId._id,
        cantidad: item.cantidad,
        precioUnitario: item.precioTotal,
        tecnologiasSeleccionadas: item.tecnologiasSeleccionadas?.map(tech => tech._id) || []
      })),
      subtotal,
      impuestos,
      total
    };

    const order = new Order(orderData);
    await order.save();

    // Limpiar el carrito
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: 'Orden creada exitosamente',
      order
    });
  } catch (error) {
    console.error('❌ Error al crear la orden:', error.message);
    res.status(500).json({ 
      message: 'Error al procesar la orden',
      error: error.message 
    });
  }
};

// Obtener todas las órdenes del usuario
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ usuario: userId })
      .populate('items.servicio')
      .populate('items.tecnologiasSeleccionadas')
      .sort({ fechaCompra: -1 });

    res.json(orders);
  } catch (error) {
    console.error('❌ Error al obtener las órdenes:', error.message);
    res.status(500).json({ message: 'Error al obtener las órdenes' });
  }
};

// Obtener una orden específica
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.servicio')
      .populate('items.tecnologiasSeleccionadas');

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    // Verificar que la orden pertenece al usuario
    if (order.usuario.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    res.json(order);
  } catch (error) {
    console.error('❌ Error al obtener la orden:', error.message);
    res.status(500).json({ message: 'Error al obtener la orden' });
  }
};
