import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, Button, InputLabel, FormControl } from '@mui/material';

const tipos = ['Preventivo', 'Correctivo', 'General'];

const ReportModal = ({ open, onClose, onSubmit, form, setForm, editReporte }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>{editReporte ? 'Editar reporte' : 'Nuevo reporte'}</DialogTitle>
    <form onSubmit={onSubmit}>
      <DialogContent sx={{ pt: 3 }}>
        <TextField
          label="Título del reporte *"
          name="titulo"
          value={form.titulo}
          onChange={e => setForm({ ...form, titulo: e.target.value })}
          required fullWidth sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tipo *</InputLabel>
          <Select
            name="tipo"
            value={form.tipo || ''}
            label="Tipo *"
            onChange={e => setForm({ ...form, tipo: e.target.value })}
            required
          >
            <MenuItem value="">Seleccione un tipo</MenuItem>
            {tipos.map(tipo => <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>)}
          </Select>
        </FormControl>

        <TextField
          label="Periodo de inicio *"
          name="fecha_inicio"
          type="date"
          value={form.fecha_inicio || ''}
          onChange={e => setForm({ ...form, fecha_inicio: e.target.value })}
          InputLabelProps={{ shrink: true }}
          required fullWidth sx={{ mb: 2 }}
        />
        <TextField
          label="Periodo de fin *"
          name="fecha_fin"
          type="date"
          value={form.fecha_fin || ''}
          onChange={e => setForm({ ...form, fecha_fin: e.target.value })}
          InputLabelProps={{ shrink: true }}
          required fullWidth sx={{ mb: 2 }}
        />

        <TextField
          label="Observaciones finales"
          name="observaciones_finales"
          value={form.observaciones_finales || ''}
          onChange={e => setForm({ ...form, observaciones_finales: e.target.value })}
          fullWidth
          multiline
          minRows={2}
          placeholder="Notas o recomendaciones del reporte..."
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button type="submit" variant="contained">
          {editReporte ? 'Guardar cambios' : 'Guardar'}
        </Button>
      </DialogActions>
    </form>
  </Dialog>
);

export default ReportModal;
