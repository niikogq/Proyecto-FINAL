const express = require('express');
const router = express.Router();
const Reporte = require('../models/reporte');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/roles');
const WorkOrder = require('../models/WorkOrder');

// CREAR REPORTE: Genera intervenciones automáticas según rango y estado workorder
router.post('/reportes', auth, allowRoles('admin', 'supervisor'), async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, tipo, titulo, observaciones_finales } = req.body;

    // Busca las work orders "Completada" en el rango solicitado
    const workorders = await WorkOrder.find({
      status: 'Completada',
      endDate: { $gte: new Date(fecha_inicio), $lte: new Date(fecha_fin) }
    }).populate('asset');

    const resultados = workorders.map(wo => ({
      activo: wo.asset,
      nombre_activo: wo.asset?.nombre || '',
      accion: tipo,
      fecha: wo.endDate,
      estado: wo.status,
      responsable: wo.assignedTo,
      observaciones: wo.description || ''
    }));

    const totales = {
      total_activos: [...new Set(workorders.map(w => w.asset?.toString() ?? ''))].length,
      total_intervenciones: workorders.length,
      tiempo_promedio_cierre: null, // <-- ¡NUNCA pongas un string aquí!
      incidencias_abiertas: workorders.filter(w => w.status === 'Pendiente').length,
      incidencias_cerradas: workorders.filter(w => w.status === 'Completada').length
    };

    const nuevo = new Reporte({
      titulo,
      fecha_creacion: new Date(),
      autor: {
        nombre: req.user.nombre,
        correo: req.user.email,
        rol: req.user.rol,
        usuarioId: req.user._id
      },
      fecha_inicio,
      fecha_fin,
      tipo,
      resultados,
      totales,
      observaciones_finales
    });

    await nuevo.save();
    res.json({ message: 'Reporte guardado', reporte: nuevo });
  } catch (error) {
    console.error('ERROR AL CREAR REPORTE:', error); // <--- AGREGA ESTA LINEA
    res.status(500).json({ error: 'Error al crear reporte', details: error.message });
  }
});

// Listar todos los reportes
router.get('/reportes', auth, allowRoles('admin', 'supervisor'), async (req, res) => {
  try {
    const filtros = {}; // puedes mapear req.query aquí si quieres
    const reportes = await Reporte.find(filtros).sort({ fecha_creacion: -1 });
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar reportes', details: error.message });
  }
});

// Obtener un reporte por ID
router.get('/reportes/:id', auth, allowRoles('admin', 'supervisor'), async (req, res) => {
  try {
    const reporte = await Reporte.findById(req.params.id);
    if (!reporte) return res.status(404).json({ error: 'Reporte no encontrado' });
    res.json(reporte);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reporte', details: error.message });
  }
});

// Actualizar (opcional)
router.put('/reportes/:id', auth, allowRoles('admin', 'supervisor'), async (req, res) => {
  try {
    const editado = await Reporte.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Reporte actualizado', reporte: editado });
  } catch (error) {
    res.status(500).json({ error: 'Error al editar', details: error.message });
  }
});

// Borrar
router.delete('/reportes/:id', auth, allowRoles('admin'), async (req, res) => {
  try {
    await Reporte.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reporte eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar', details: error.message });
  }
});

module.exports = router;
