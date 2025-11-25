const express = require('express');
const router = express.Router();
const WorkOrder = require('../models/WorkOrder');
const Activo = require('../models/activos');
const User = require('../models/User');
const Notification = require('../models/Notification'); // Si tienes este modelo

router.get('/', async (req, res) => {
  try {
    // Órdenes por estado
    const statuses = ['Pendiente', 'En Progreso', 'Completada'];
    const ordersCounts = {};
    for (const status of statuses) ordersCounts[status] = await WorkOrder.countDocuments({ status });

    // Activos por estado
    const estadoActivos = ['Activo', 'Inactivo', 'En mantenimiento', 'Fuera de servicio'];
    const activosCounts = {};
    for (const estado of estadoActivos) activosCounts[estado] = await Activo.countDocuments({ estado });

    // Total activos críticos (ejemplo: estado = "Fuera de servicio" o lo que tú determines)
    const activosCriticos = await Activo.countDocuments({ estado: 'Fuera de servicio' });

    // Usuarios por rol
    const usuariosPorRol = {
      supervisor: await User.countDocuments({ rol: 'supervisor' }),
      tecnico: await User.countDocuments({ rol: 'tecnico', estado: 'activo' }),
      admin: await User.countDocuments({ rol: 'admin' }),
    };

    // Técnicos disponibles (estado = 'activo')
    const tecnicosDisponibles = await User.find({ rol: 'tecnico', estado: 'activo' }).lean();

    // Actividad reciente tipo log (usando notificaciones como base)
    let actividadReciente = [];
    try {
      actividadReciente = await Notification.find({})
        .sort({ createdAt: -1 })
        .limit(8)
        .lean()
        .then(arr =>
          arr.map(n => ({
            // Adapta a lógica de negocio real, ajustan estos campos como quieras
            message: n.message,
            usuario: n.user?.nombre || n.createdBy || 'Sistema',
            tipoActividad: n.type || '',
            createdAt: n.createdAt
          }))
        );
    } catch {
      actividadReciente = [];
    }

    // Cálculo para gráfico de órdenes por periodo (ejemplo: últimos 7 días, por día)
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const now = new Date();
    const workordersPorPeriodo = {
      labels: [],
      pendientes: [],
      enProgreso: [],
      completadas: []
    };
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      workordersPorPeriodo.labels.push(days[day.getDay()]);
      const start = new Date(day.setHours(0,0,0,0));
      const end = new Date(day.setHours(23,59,59,999));
      workordersPorPeriodo.pendientes.push(
        await WorkOrder.countDocuments({ status: 'Pendiente', createdAt: { $gte: start, $lte: end } })
      );
      workordersPorPeriodo.enProgreso.push(
        await WorkOrder.countDocuments({ status: 'En Progreso', createdAt: { $gte: start, $lte: end } })
      );
      workordersPorPeriodo.completadas.push(
        await WorkOrder.countDocuments({ status: 'Completada', createdAt: { $gte: start, $lte: end } })
      );
    }

    res.json({
      workorders: ordersCounts,
      activos: {
        total: Object.values(activosCounts).reduce((a,b)=>a+b,0),
        porEstado: activosCounts
      },
      activosCriticos,
      fallosHoy: ordersCounts['Pendiente'],
      usuariosPorRol,
      tecnicosDisponibles,
      actividadReciente,
      workordersPorPeriodo
    });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo dashboard', details: error.message });
  }
});

module.exports = router;
