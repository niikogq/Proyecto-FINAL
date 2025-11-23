import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';

function WorkOrderForm({ open, onClose, order, assets, onSubmit }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    asset: '',
    assignedTo: '',
    supervisor: '',
    startDate: '',
    endDate: '',
    status: 'Pendiente' // 👈 Valor inicial corregido
  });

  const [tecnicos, setTecnicos] = useState([]);
  const [supervisores, setSupervisores] = useState([]);

  useEffect(() => {
    if (open) {
      axios.get('/api/users', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      })
        .then(res => {
          const todos = res.data;
          setTecnicos(todos.filter(u => u.rol === 'tecnico'));
          setSupervisores(todos.filter(u => u.rol === 'supervisor'));
        })
        .catch(() => {
          setTecnicos([]); setSupervisores([]);
        });
    }
  }, [open]);

  useEffect(() => {
    if (order) {
      setForm({
        title: order.title || '',
        description: order.description || '',
        asset: order.asset ? order.asset._id : '',
        assignedTo: order.assignedTo || '',
        supervisor: order.supervisor || '',
        startDate: order.startDate ? order.startDate.slice(0, 10) : '',
        endDate: order.endDate ? order.endDate.slice(0, 10) : '',
        status: order.status || 'Pendiente' // 👈 Usa el valor exacto del modelo
      });
    } else {
      setForm({
        title: '',
        description: '',
        asset: '',
        assignedTo: '',
        supervisor: '',
        startDate: '',
        endDate: '',
        status: 'Pendiente' // 👈 Usa el valor exacto del modelo
      });
    }
  }, [order, open]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{order ? 'Editar Orden' : 'Nueva Orden'}</DialogTitle>
      <DialogContent>
        <form onSubmit={submit} id="orden-form">
          <TextField label="Título" name="title" value={form.title} onChange={handleChange} required fullWidth sx={{ mb: 2 }} />
          <TextField label="Descripción" name="description" value={form.description} onChange={handleChange} multiline fullWidth sx={{ mb: 2 }} />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="activo-label">Activo</InputLabel>
            <Select labelId="activo-label" name="asset" value={form.asset} onChange={handleChange} label="Activo" required>
              <MenuItem value=""><em>Selecciona activo</em></MenuItem>
              {assets.map(activo => (
                <MenuItem key={activo._id} value={activo._id}>{activo.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="responsable-label">Responsable (Técnico)</InputLabel>
            <Select
              labelId="responsable-label"
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              label="Responsable (Técnico)"
              required
            >
              <MenuItem value=""><em>Selecciona técnico</em></MenuItem>
              {tecnicos.map(user => (
                <MenuItem key={user._id} value={user.email}>
                  {user.nombre} ({user.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="supervisor-label">Supervisor</InputLabel>
            <Select
              labelId="supervisor-label"
              name="supervisor"
              value={form.supervisor}
              onChange={handleChange}
              label="Supervisor"
              required
            >
              <MenuItem value=""><em>Selecciona supervisor</em></MenuItem>
              {supervisores.map(user => (
                <MenuItem key={user._id} value={user.email}>
                  {user.nombre} ({user.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField type="date" label="Fecha de inicio" name="startDate" value={form.startDate} onChange={handleChange} InputLabelProps={{ shrink: true }} required fullWidth sx={{ mb: 2 }} />
          <TextField type="date" label="Fecha de cierre" name="endDate" value={form.endDate} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth sx={{ mb: 2 }} />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="estado-label">Estado</InputLabel>
            <Select labelId="estado-label" name="status" value={form.status} onChange={handleChange} label="Estado" required>
              {/* 👇 Usar exactamente los valores del modelo en el value */}
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="En Progreso">En Progreso</MenuItem>
              <MenuItem value="Completada">Completada</MenuItem>
            </Select>
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" form="orden-form" variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}
export default WorkOrderForm;
