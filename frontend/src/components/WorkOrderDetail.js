import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';

function WorkOrderDetail({ open, onClose, order }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Detalles de la orden de trabajo</DialogTitle>
      <DialogContent dividers>
        {order ? (
          <>
            <Typography sx={{ mb: 2 }}><strong>Título:</strong> {order.title}</Typography>
            <Typography sx={{ mb: 2 }}><strong>Activo:</strong> {order.asset ? order.asset.nombre : '-'}</Typography>
            <Typography sx={{ mb: 2 }}><strong>Responsable:</strong> {order.assignedTo || '-'}</Typography>
            <Typography sx={{ mb: 2 }}><strong>Estado:</strong> {order.status}</Typography>
            <Typography sx={{ mb: 2 }}><strong>Fecha de inicio:</strong> {order.startDate ? order.startDate.split('T')[0] : '-'}</Typography>
            <Typography sx={{ mb: 2 }}><strong>Fecha de cierre:</strong> {order.endDate ? order.endDate.split('T')[0] : '-'}</Typography>
            <Typography sx={{ mb: 2 }}><strong>Descripción:</strong> {order.description || '-'}</Typography>
            {/* Agrega aquí más campos si lo necesitas */}
          </>
        ) : (
          <Typography>No se encontraron datos para esta orden.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default WorkOrderDetail;
