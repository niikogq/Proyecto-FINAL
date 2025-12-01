const express = require('express');
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');

// Reusar modelo si ya existe, o crearlo solo una vez
let WorkOrder;
try {
  WorkOrder = mongoose.model('WorkOrder');
} catch {
  WorkOrder = mongoose.model(
    'WorkOrder',
    new mongoose.Schema({}, { strict: false, collection: 'workorders' })
  );
}

router.post('/orden-trabajo', async (req, res) => {
  try {
    const { workorderId } = req.body;
    if (!workorderId) return res.status(400).json({ error: "workorderId es requerido" });

    const orden = await WorkOrder.findById(workorderId).lean();
    if (!orden) return res.status(404).json({ error: "Orden no encontrada" });

    let descripcionCompleta =
      `Descripción: ${orden.descripcion || 'No hay descripción'}\n` +
      `Estado: ${orden.estado || "Desconocido"}\n` +
      `Técnico asignado: ${orden.tecnico || 'Sin asignar'}\n` +
      `Fecha asignación: ${orden.fecha_asignacion || 'No disponible'}\n` +
      `Historial: ${JSON.stringify(orden.historial || [])}\n` +
      `Observaciones: ${orden.observaciones || 'Ninguna'}\n`;

    const response = await axios.post(
      'http://localhost:8000/api/ia/orden-trabajo',
      { descripcion: descripcionCompleta }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error en ruta IA:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
