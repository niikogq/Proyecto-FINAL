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
    const workOrder = new WorkOrder(req.body);
    await workOrder.save();

    // --- LOGS DE DEPURACIÓN ---
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

// Listar todas las órdenes
router.get('/', auth, allowRoles('admin', 'tecnico', 'supervisor'), async (req, res) => {
  const orders = await WorkOrder.find().populate('asset');
  res.json(orders);
});

// Obtener orden por ID
router.get('/:id', async (req, res) => {
  const order = await WorkOrder.findById(req.params.id).populate('asset');
  res.json(order);
});

// Actualizar orden
router.put('/:id', auth, allowRoles('admin', 'supervisor'), async (req, res) => {
  const order = await WorkOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(order);
});

// Eliminar orden
router.delete('/:id', auth, allowRoles('admin', 'supervisor'), async (req, res) => {
  await WorkOrder.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
