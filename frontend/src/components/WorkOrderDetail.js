import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';
import axios from 'axios';

function WorkOrderDetail({ open, onClose, order, usuario, onStatusChange }) {
  if (!order) return null;

  const isAsignado = usuario?.rol === 'tecnico' && usuario.email === order.assignedTo;

  // Handler para "Comenzar Orden"
  const handleComenzar = async () => {
    try {
      await axios.put(`/api/workorders/${order._id}/comenzar`, {}, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      onStatusChange && onStatusChange(); // refresh padres
      onClose();
    } catch (err) {
      alert('No se pudo comenzar la orden: ' + (err?.response?.data?.error || err.message));
    }
  };

  // Handler para "Finalizar Orden"
  const handleFinalizar = async () => {
    try {
      await axios.put(`/api/workorders/${order._id}/finalizar`, {}, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      onStatusChange && onStatusChange(); // refresh padres
      onClose();
    } catch (err) {
      alert('No se pudo finalizar la orden: ' + (err?.response?.data?.error || err.message));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Detalles de la orden de trabajo</DialogTitle>
      <DialogContent dividers>
        <Typography sx={{ mb: 2 }}><strong>Título:</strong> {order.title}</Typography>
        <Typography sx={{ mb: 2 }}><strong>Activo:</strong> {order.asset ? order.asset.nombre : '-'}</Typography>
        <Typography sx={{ mb: 2 }}><strong>Responsable:</strong> {order.assignedTo || '-'}</Typography>
        <Typography sx={{ mb: 2 }}><strong>Estado:</strong> {order.status}</Typography>
        <Typography sx={{ mb: 2 }}><strong>Fecha de inicio:</strong> {order.startDate ? order.startDate.split('T')[0] : '-'}</Typography>
        <Typography sx={{ mb: 2 }}><strong>Fecha de cierre:</strong> {order.endDate ? order.endDate.split('T')[0] : '-'}</Typography>
        <Typography sx={{ mb: 2 }}><strong>Descripción:</strong> {order.description || '-'}</Typography>
      </DialogContent>
      <DialogActions>
        {/* Solo mostrar botón si es técnico asignado y la orden lo permite */}
        {isAsignado && order.status === "Pendiente" && (
          <Button onClick={handleComenzar} color="warning" variant="contained">
            Comenzar Orden
          </Button>
        )}
        {isAsignado && order.status === "En Progreso" && (
          <Button onClick={handleFinalizar} color="success" variant="contained">
            Finalizar Orden
          </Button>
        )}
        <Button onClick={onClose} variant="outlined" color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default WorkOrderDetail;
