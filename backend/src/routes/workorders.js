const express = require('express');
const router = express.Router();
const WorkOrder = require('../models/WorkOrder');
const Notification = require('../models/Notification');
const User = require('../models/User');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/roles');

// Crear orden de trabajo y notificar al técnico asignado
router.post('/', auth, allowRoles('admin', 'tecnico'), async (req, res) => {
  try {
    // Asegurar estado Pendiente al crear
    const workOrderData = {
      ...req.body,
      status: 'Pendiente'
    };
    const workOrder = new WorkOrder(workOrderData);
    await workOrder.save();

    console.log('AssignedTo:', workOrder.assignedTo);
    const assignedTech = await User.findOne({ email: workOrder.assignedTo, rol: 'tecnico' });
    console.log('Usuario técnico encontrado:', assignedTech);

    if (assignedTech && (req.user.rol === 'admin' || req.user.rol === 'supervisor')) {
      const notif = await Notification.create({
        user: assignedTech._id,
        message: `Se te ha asignado una nueva orden: "${workOrder.title}"`,
        link: `/workorders/${workOrder._id}`,
        type: "orden"
      });
      console.log('Notificación creada:', notif);
    }

    res.status(201).json(workOrder);
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ message: error.message });
  }
});

// Listar órdenes según el rol del usuario
router.get('/', auth, allowRoles('admin', 'tecnico', 'supervisor'), async (req, res) => {
  let query = {};
  if (req.user.rol === 'tecnico') {
    query.assignedTo = req.user.email; // solo las asignadas a este técnico
  }
  const orders = await WorkOrder.find(query).populate('asset');
  res.json(orders);
});

// Obtener orden por ID
router.get('/:id', auth, allowRoles('admin', 'tecnico', 'supervisor'), async (req, res) => {
  const order = await WorkOrder.findById(req.params.id).populate('asset');
  if (!order) return res.status(404).json({ error: 'Orden no encontrada' });

  // Opcional: Validar que técnico vea solo sus órdenes
  if (req.user.rol === 'tecnico' && order.assignedTo !== req.user.email) {
    return res.status(403).json({ error: 'No autorizado para esta orden' });
  }

  res.json(order);
});

// Actualizar orden (solo admin, supervisor)
router.put('/:id', auth, allowRoles('admin', 'supervisor'), async (req, res) => {
  const order = await WorkOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
  res.json(order);
});

// Eliminar orden (solo admin, supervisor)
router.delete('/:id', auth, allowRoles('admin', 'supervisor'), async (req, res) => {
  await WorkOrder.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// Técnico comienza la orden (solo técnico asignado)
router.put('/:id/comenzar', auth, allowRoles('tecnico'), async (req, res) => {
  const order = await WorkOrder.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Orden no encontrada' });

  if (order.assignedTo !== req.user.email) {
    return res.status(403).json({ error: 'No autorizado para comenzar esta orden' });
  }
  if (order.status !== 'Pendiente') {
    return res.status(400).json({ error: 'La orden no está en estado Pendiente' });
  }

  order.status = 'En Progreso';
  order.startDate = new Date();
  await order.save();
  res.json(order);
});

// Técnico finaliza la orden (solo técnico asignado)
router.put('/:id/finalizar', auth, allowRoles('tecnico'), async (req, res) => {
  const order = await WorkOrder.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Orden no encontrada' });

  if (order.assignedTo !== req.user.email) {
    return res.status(403).json({ error: 'No autorizado para finalizar esta orden' });
  }
  if (order.status !== 'En Progreso') {
    return res.status(400).json({ error: 'La orden no está en estado En Progreso' });
  }

  order.status = 'Completada';
  order.endDate = new Date();
  await order.save();
  res.json(order);
});

module.exports = router;
