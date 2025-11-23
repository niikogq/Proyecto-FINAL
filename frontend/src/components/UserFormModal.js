import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem,
} from '@mui/material';

function UserFormModal({ open, onClose, onSubmit, user, mode }) {
  // Al abrir/editar, inicializa el formulario
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'tecnico',
    estado: 'activo'
  });

  useEffect(() => {
    if (mode === 'edit' && user) {
      setForm({
        nombre: user.nombre || '',
        email: user.email || '',
        password: '', // No mostramos/edita password existente
        rol: user.rol || 'tecnico',
        estado: user.estado || 'activo'
      });
    } else {
      // Nuevo usuario
      setForm({
        nombre: '', email: '', password: '', rol: 'tecnico', estado: 'activo'
      });
    }
  }, [open, user, mode]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {mode === 'edit' ? 'Editar usuario' : 'Crear nuevo usuario'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          {/* Solo pide password al crear nuevo usuario */}
          {mode === 'create' && (
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
          )}
          <TextField
            label="Rol"
            name="rol"
            value={form.rol}
            onChange={handleChange}
            select
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="tecnico">Técnico</MenuItem>
            <MenuItem value="supervisor">Supervisor</MenuItem>
          </TextField>
          <TextField
            label="Estado"
            name="estado"
            value={form.estado}
            onChange={handleChange}
            select
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="activo">Activo</MenuItem>
            <MenuItem value="inactivo">Inactivo</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" variant="outlined">
            Cancelar
          </Button>
          <Button type="submit" color="primary" variant="contained">
            {mode === 'edit' ? 'Guardar cambios' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default UserFormModal;
