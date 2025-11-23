import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Tooltip, Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Capitalizar primer letra
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function UserTable({ users, onEdit, onDelete }) {
  if (!users || users.length === 0) {
    return (
      <Typography sx={{ mt: 2 }}>
        No hay usuarios registrados.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0} sx={{
      boxShadow: 'none',
      borderRadius: 2,
      border: '1px solid #eee',
      mb: 2
    }}>
      <Table>
        <TableHead>
          <TableRow sx={{ background: '#fafafa' }}>
            <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Rol</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Creado</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600, width: 140 }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user._id} hover>
              <TableCell>{user.nombre}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{capitalize(user.rol)}</TableCell>
              <TableCell>{capitalize(user.estado)}</TableCell>
              <TableCell>
                {user.creado
                  ? new Date(user.creado).toLocaleDateString()
                  : '-'}
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Editar usuario" placement="top">
                  <Button
                    color="primary"
                    size="small"
                    sx={{ p: 0, minWidth: 0, mr: 1 }}
                    onClick={() => onEdit(user)}
                  >
                    <EditIcon />
                  </Button>
                </Tooltip>
                <Tooltip title="Eliminar usuario" placement="top">
                  <Button
                    color="error"
                    size="small"
                    sx={{ p: 0, minWidth: 0 }}
                    onClick={() => onDelete(user)}
                  >
                    <DeleteIcon />
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default UserTable;
