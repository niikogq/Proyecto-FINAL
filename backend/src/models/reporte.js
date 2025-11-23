const mongoose = require('mongoose');

const ReporteSchema = new mongoose.Schema({
  titulo: { type: String, required: true }, // Ej: Reporte de Mantenimiento
  fecha_creacion: { type: Date, default: Date.now }, // fecha del reporte

  autor: {
    nombre: String,
    correo: String,
    rol: String,
    // Puedes guardar el _id del usuario si lo necesitas
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },

  fecha_inicio: { type: Date, required: true }, // inicio del periodo reportado
  fecha_fin: { type: Date, required: true },    // fin del periodo reportado

  tipo: { type: String, required: true }, // Ej: Preventivo, Correctivo, General

  filtros: {
    activos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activo' }], // lista de activos incluidos
    estado: [String],  // estados filtrados (ej: "Activo", "Inactivo")
    responsables: [String], // nombres/correos de responsables filtrados
    // Agrega más filtros si lo deseas
  },

  resultados: [
    {
      activo: { type: mongoose.Schema.Types.ObjectId, ref: 'Activo' }, // activo involucrado
      nombre_activo: String, // redundante, para facilitar consulta en frontend
      accion: String,        // Ej: "Mantenimiento", "Inspección", "Reparación"
      fecha: Date,
      estado: String,
      responsable: String,
      observaciones: String
    }
  ],

  totales: {
    total_activos: Number,
    total_intervenciones: Number,
    tiempo_promedio_cierre: Number, // en horas/días
    incidencias_abiertas: Number,
    incidencias_cerradas: Number
  },

  observaciones_finales: String, // recomendación del autor
  // firma/aprobación puede ser un booleano o info extra
  firmado_por: {
    nombre: String,
    correo: String,
    fecha: Date
  }
});

module.exports = mongoose.model('Reporte', ReporteSchema);
