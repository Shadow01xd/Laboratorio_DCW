const Cart = require('../models/Cart')
const Service = require('../models/Service')
const Technology = require('../models/Technology')
const mongoose = require('mongoose')

// Obtener carrito del usuario
const obtenerCarrito = async (req, res) => {
  try {
    const userId = req.user.id
    const carrito = await Cart.findOne({ userId })
      .populate('items.servicioId')
      .populate('items.tecnologiasSeleccionadas')

    res.json(carrito || { items: [] })
  } catch (err) {
    console.error('❌ Error al obtener carrito:', err)
    res.status(500).json({ message: 'Error al obtener carrito' })
  }
}

// Agregar o actualizar servicio al carrito
const agregarAlCarrito = async (req, res) => {
  try {
    const { servicioId, cantidad, tecnologiasSeleccionadas } = req.body
    const userId = req.user.id

    const servicio = await Service.findById(servicioId)
    if (!servicio) {
      return res.status(404).json({ message: 'Servicio no encontrado' })
    }

    let precioTotal = servicio.costo
    let tecnologias = []

    if (tecnologiasSeleccionadas?.length > 0) {
      tecnologias = await Technology.find({ _id: { $in: tecnologiasSeleccionadas } })
      precioTotal += tecnologias.reduce((acc, t) => acc + t.price, 0)
    }

    let carrito = await Cart.findOne({ userId })

    if (!carrito) {
      carrito = new Cart({
        userId,
        items: [{ servicioId, cantidad, tecnologiasSeleccionadas, precioTotal }]
      })
    } else {
      const index = carrito.items.findIndex(item => item.servicioId.toString() === servicioId)
      if (index > -1) {
        carrito.items[index].cantidad = cantidad
        carrito.items[index].tecnologiasSeleccionadas = tecnologiasSeleccionadas
        carrito.items[index].precioTotal = precioTotal
      } else {
        carrito.items.push({ servicioId, cantidad, tecnologiasSeleccionadas, precioTotal })
      }
    }

    await carrito.save()
    await carrito.populate('items.servicioId').populate('items.tecnologiasSeleccionadas')

    res.json(carrito)
  } catch (err) {
    console.error('❌ Error al agregar al carrito:', err)
    res.status(500).json({ message: 'Error al agregar al carrito' })
  }
}

// Eliminar servicio del carrito
const eliminarDelCarrito = async (req, res) => {
  try {
    const userId = req.user.id
    const { servicioId } = req.params

    await Cart.updateOne(
      { userId },
      { $pull: { items: { servicioId: new mongoose.Types.ObjectId(servicioId) } } }
    )

    const carrito = await Cart.findOne({ userId }).populate('items.servicioId')

    if (!carrito) {
      return res.status(404).json({ message: 'Carrito no encontrado' })
    }

    if (carrito.items.length === 0) {
      await Cart.deleteOne({ userId })
      return res.json({ message: 'Servicio eliminado y carrito vacío eliminado.' })
    }

    res.json(carrito)
  } catch (err) {
    console.error('❌ Error al eliminar del carrito:', err)
    res.status(500).json({ message: 'Error al eliminar del carrito' })
  }
}

// Actualizar cantidad de un ítem
const actualizarCantidad = async (req, res) => {
  try {
    const userId = req.user.id
    const { servicioId } = req.params
    const { cantidad } = req.body

    const carrito = await Cart.findOne({ userId })

    if (!carrito) {
      return res.status(404).json({ message: 'Carrito no encontrado' })
    }

    const item = carrito.items.find(item => item.servicioId.toString() === servicioId)
    if (!item) {
      return res.status(404).json({ message: 'Servicio no encontrado en el carrito' })
    }

    item.cantidad = cantidad

    await carrito.save()
    await carrito.populate('items.servicioId')

    res.json(carrito)
  } catch (err) {
    console.error('❌ Error al actualizar cantidad:', err)
    res.status(500).json({ message: 'Error al actualizar cantidad' })
  }
}

module.exports = {
  obtenerCarrito,
  agregarAlCarrito,
  eliminarDelCarrito,
  actualizarCantidad
}
