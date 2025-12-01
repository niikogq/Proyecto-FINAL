const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

router.put('/me', auth, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id; // soporta ambas formas
    if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });

    const { nombre, email, telefono, nuevoPassword } = req.body;

    const update = { nombre, email };

    if (telefono !== undefined) {
      update.telefono = telefono;
    }

    if (nuevoPassword && nuevoPassword.trim().length >= 6) {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(nuevoPassword, salt);
    }

    const updated = await User.findByIdAndUpdate(userId, update, { new: true }).lean();
    if (!updated) return res.status(404).json({ error: 'Usuario no encontrado' });

    delete updated.password;
    res.json(updated);
  } catch (err) {
    console.error('Error actualizando perfil:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
