import React from 'react';
import { Paper, Typography, Box, Avatar, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const Perfil = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};

  return (
    <Box sx={{
      height: '440px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      background: '#f4f6fc',
      pt: 15,
      overflow: 'hidden'
    }}>
      <Paper elevation={6} sx={{
        px: 4, py: 4, minWidth: 340, borderRadius: 3,
        display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        <Avatar sx={{
          bgcolor: '#4F8AD8',
          width: 100,
          height: 100,
          mb: 3,
          fontSize: 46
        }}>
          {usuario.nombre ? usuario.nombre[0].toUpperCase() : ''}
        </Avatar>
        <Typography variant="h5" fontWeight="bold" color="primary" mb={2}>
          {usuario.nombre}
        </Typography>
        <Typography variant="body1" color="#455a64" mb={1} fontWeight={500}>
          {usuario.email}
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Rol: {usuario.rol}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<EditIcon />}
          sx={{ mt: 2, px: 4, py: 1, borderRadius: 20, fontWeight: "bold", fontSize: 16 }}
          // onClick={...} // Aquí puedes poner la función que abre la edición
        >
          Editar perfil
        </Button>
      </Paper>
    </Box>
  );
};

export default Perfil;
