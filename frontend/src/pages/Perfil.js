import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Grid,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

const Perfil = () => {
  const usuarioStorage = JSON.parse(localStorage.getItem('usuario')) || {};
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    nombre: usuarioStorage.nombre || '',
    email: usuarioStorage.email || '',
    telefono: usuarioStorage.telefono || '',
    nuevoPassword: '',
    confirmarPassword: '',
  });

  const handleChange = (campo) => (e) => {
    setForm(prev => ({ ...prev, [campo]: e.target.value }));
  };

  const handleGuardar = async () => {
    if (form.nuevoPassword && form.nuevoPassword !== form.confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:3001/api/user/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
          nuevoPassword: form.nuevoPassword || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('No se pudo actualizar el perfil');
      }

      const updatedUser = await res.json();
      localStorage.setItem('usuario', JSON.stringify(updatedUser));
      setEditando(false);
    } catch (error) {
      console.error(error);
      alert('Error al actualizar perfil');
    }
  };

  const handleCancelar = () => {
    setForm({
      nombre: usuarioStorage.nombre || '',
      email: usuarioStorage.email || '',
      telefono: usuarioStorage.telefono || '',
      nuevoPassword: '',
      confirmarPassword: '',
    });
    setEditando(false);
  };

  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};

  return (
    <Box
      sx={{
        minHeight: '440px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        background: '#f4f6fc',
        pt: 4,
        pb: 4,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          px: 4,
          py: 4,
          maxWidth: 700,
          width: '100%',
          borderRadius: 3,
        }}
      >
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Columna izquierda: avatar + info básica */}
          <Box sx={{ minWidth: 220, textAlign: 'center' }}>
            <Avatar
              sx={{
                bgcolor: '#4F8AD8',
                width: 96,
                height: 96,
                mb: 2,
                fontSize: 40,
                mx: 'auto',
              }}
            >
              {usuario.nombre ? usuario.nombre[0].toUpperCase() : ''}
            </Avatar>
            <Typography variant="h5" fontWeight="bold" color="primary" mb={1}>
              {usuario.nombre}
            </Typography>
            <Typography variant="body2" color="#455a64" mb={0.5}>
              {usuario.email}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Rol:
            </Typography>
            <Chip
              label={usuario.rol || 'Sin rol'}
              color={usuario.rol === 'admin' ? 'primary' : 'default'}
              size="small"
            />

            <Box sx={{ mt: 3 }}>
              {!editando ? (
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<EditIcon />}
                  sx={{ px: 4, borderRadius: 20, fontWeight: 600 }}
                  onClick={() => setEditando(true)}
                >
                  Editar perfil
                </Button>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<SaveIcon />}
                    sx={{ px: 3, borderRadius: 20, fontWeight: 600 }}
                    onClick={handleGuardar}
                  >
                    Guardar
                  </Button>
                  <Button
                    variant="text"
                    color="inherit"
                    startIcon={<CancelIcon />}
                    sx={{ px: 3, borderRadius: 20 }}
                    onClick={handleCancelar}
                  >
                    Cancelar
                  </Button>
                </Box>
              )}
            </Box>
          </Box>

          {/* Columna derecha: datos detallados / formulario */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Información de la cuenta
            </Typography>

            {!editando ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Nombre completo
                  </Typography>
                  <Typography variant="body1">
                    {usuario.nombre || '—'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Correo electrónico
                  </Typography>
                  <Typography variant="body1">
                    {usuario.email || '—'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Teléfono
                  </Typography>
                  <Typography variant="body1">
                    {usuario.telefono || '—'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Rol en el sistema
                  </Typography>
                  <Typography variant="body1">
                    {usuario.rol || '—'}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nombre completo"
                    fullWidth
                    size="small"
                    value={form.nombre}
                    onChange={handleChange('nombre')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Correo electrónico"
                    fullWidth
                    size="small"
                    value={form.email}
                    onChange={handleChange('email')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Teléfono"
                    fullWidth
                    size="small"
                    value={form.telefono}
                    onChange={handleChange('telefono')}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mt: 1, mb: 0.5 }}>
                    Cambiar contraseña
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nueva contraseña"
                    type="password"
                    fullWidth
                    size="small"
                    value={form.nuevoPassword}
                    onChange={handleChange('nuevoPassword')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Confirmar contraseña"
                    type="password"
                    fullWidth
                    size="small"
                    value={form.confirmarPassword}
                    onChange={handleChange('confirmarPassword')}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Perfil;
