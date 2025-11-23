const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // el usuario técnico destinatario
  message: { type: String, required: true },
  link: { type: String }, // opcional, para redirigir a detalles de la orden
  type: { type: String, default: 'orden' }, // tipo de notificación
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

module.exports = mongoose.model('Notification', NotificationSchema);
