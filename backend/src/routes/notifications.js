const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// Obtener notificaciones del usuario logueado (tecnico)
router.get('/', auth, async (req, res) => {
  const userId = req.user.id;
  const notis = await Notification.find({ user: userId }).sort({ date: -1 });
  res.json(notis);
});

// Marcar una notificación como leída (opcional)
router.post('/:id/read', auth, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ ok: true });
});

module.exports = router;
