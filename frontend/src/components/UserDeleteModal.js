import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

function UserDeleteModal({ open, onClose, onDelete, user }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>¿Eliminar usuario?</DialogTitle>
      <DialogContent>
        <Typography>
          {user
            ? <>¿Confirma eliminar el usuario <strong>{user.nombre}</strong> (<em>{user.email}</em>)?</>
            : '¿Confirma eliminar este usuario?'}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancelar
        </Button>
        <Button onClick={onDelete} color="error" variant="contained">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserDeleteModal;
