const express = require('express');
const router = express.Router();
const Reporte = require('../models/reporte');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/roles');
const WorkOrder = require('../models/WorkOrder'); // verifica que la ruta/modelo sea correcta

// CREAR REPORTE: Genera intervenciones automáticas según rango y estado workorder
router.post('/reportes', auth, allowRoles('admin', 'supervisor'), async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, tipo, titulo, observaciones_finales } = req.body;

    // Busca las work orders finalizadas/cerradas en el rango solicitado
    const workorders = await WorkOrder.find({
      estado: { $in: ['finalizada', 'cerrada'] },
      fecha: { $gte: new Date(fecha_inicio), $lte: new Date(fecha_fin) }
    });

    // Genera el array resultados/intervenciones
    const resultados = workorders.map(wo => ({
      activo: wo.activo,
      nombre_activo: wo.nombre_activo || '',  // ajusta según tu modelo de WorkOrder
      accion: wo.tipo_trabajo || wo.tipo,
      fecha: wo.fecha,
      estado: wo.estado,
      responsable: wo.responsable,
      observaciones: wo.observaciones
    }));

    // Calcula los totales
    const totales = {
      total_activos: [...new Set(workorders.map(w => w.activo?.toString() ?? ''))].length,
      total_intervenciones: workorders.length,
      tiempo_promedio_cierre: '-', // Calcula si tienes fechas de apertura/cierre en modelo WorkOrder
      incidencias_abiertas: workorders.filter(w => w.estado === 'abierta').length,
      incidencias_cerradas: workorders.filter(w => w.estado === 'cerrada' || w.estado === 'finalizada').length
    };

    // Arma el reporte y lo guarda
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
    res.status(500).json({ error: 'Error al crear reporte', details: error });
  }
});

// Listar todos los reportes
router.get('/reportes', auth, allowRoles('admin', 'supervisor'), async (req, res) => {
  try {
    const filtros = {}; // puedes mapear req.query aquí si quieres
    const reportes = await Reporte.find(filtros).sort({ fecha_creacion: -1 });
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar reportes', details: error });
  }
});

// Obtener un reporte por ID
router.get('/reportes/:id', auth, allowRoles('admin', 'supervisor'), async (req, res) => {
  try {
    const reporte = await Reporte.findById(req.params.id);
    if (!reporte) return res.status(404).json({ error: 'Reporte no encontrado' });
    res.json(reporte);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reporte', details: error });
  }
});

// Actualizar (opcional)
router.put('/reportes/:id', auth, allowRoles('admin', 'supervisor'), async (req, res) => {
  try {
    const editado = await Reporte.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Reporte actualizado', reporte: editado });
  } catch (error) {
    res.status(500).json({ error: 'Error al editar', details: error });
  }
});

// Borrar
router.delete('/reportes/:id', auth, allowRoles('admin'), async (req, res) => {
  try {
    await Reporte.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reporte eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar', details: error });
  }
});

module.exports = router;
