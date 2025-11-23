const express = require('express');
const router = express.Router();
const Activo = require('../models/activos');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/roles');

// Crear un nuevo activo
router.post('/assets', auth, allowRoles('admin', 'supervisor'), async (req, res) => {
  console.log('Datos recibidos para crear:', req.body);
  try {
    const nuevoActivo = new Activo(req.body);
    const activoGuardado = await nuevoActivo.save();
    res.json({ message: 'Activo creado correctamente', activo: activoGuardado });
  } catch (error) {
    console.error('Error creando activo:', error);
    res.status(500).json({ error: 'Error al crear activo', details: error });
  }
});

//Lista de Activos
router.get('/assets', auth, allowRoles('admin', 'supervisor'), async (req, res) => {
  try {
    const activos = await Activo.find();
    res.json(activos); 
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener activos', details: error });
    res.json([{ ejemplo: 'activo1' }]);
  }
});

//Borrar Activo
router.delete('/assets/:id', auth, allowRoles('admin', 'supervisor'), async (req, res) => {
  try {
    const resultado = await Activo.findByIdAndDelete(req.params.id);
    if (!resultado) {
      return res.status(404).json({ error: 'Activo no encontrado' });
    }
    res.json({ message: 'Activo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar activo', details: error });
  }
});

router.put('/assets/:id', auth, allowRoles('admin', 'supervisor'), async (req, res) => {
  console.log('Petición PUT recibida para ID:', req.params.id);
  try {
    const activoActualizado = await Activo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!activoActualizado) {
      return res.status(404).json({ error: 'Activo no encontrado' });
    }
    res.json({ message: 'Activo actualizado correctamente', activo: activoActualizado });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar activo', details: error });
  }
});


module.exports = router;