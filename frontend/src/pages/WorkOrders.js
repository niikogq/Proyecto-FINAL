import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Typography, Button, TextField, Snackbar, Box } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import WorkOrderTable from '../components/WorkOrderTable';
import WorkOrderForm from '../components/WorkOrderForm';
import WorkOrderDelete from '../components/WorkOrderDelete';
import WorkOrderDetail from '../components/WorkOrderDetail';

const WorkOrders = ({ usuario }) => {
  const [orders, setOrders] = useState([]);
  const [assets, setAssets] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [search, setSearch] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openDetail, setOpenDetail] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);

  const getAuthHeader = () => ({
    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
  });

  useEffect(() => {
    axios.get('/api/workorders', getAuthHeader())
      .then(res => setOrders(res.data))
      .catch(err => setSnackbar({ open: true, message: `Error: ${err.message}`, severity: 'error' }));
  }, []);

  useEffect(() => {
    if (openEdit) {
      axios.get('/api/assets', getAuthHeader())
        .then(res => setAssets(res.data))
        .catch(err => setSnackbar({ open: true, message: `Error: ${err.message}`, severity: 'error' }));
    }
  }, [openEdit]);

  const handleOpenEdit = (order = null) => {
    setOrderToEdit(order);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => setOpenEdit(false);
  const handleOpenDelete = (order) => {
    setOrderToDelete(order);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => setOpenDelete(false);
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleSubmit = async (form) => {
    const dataToSend = { ...form };
    try {
      let res;
      if (orderToEdit) {
        res = await axios.put(`/api/workorders/${orderToEdit._id}`, dataToSend, getAuthHeader());
        setOrders(orders.map(o => o._id === orderToEdit._id ? res.data : o));
        setSnackbar({ open: true, message: 'Orden actualizada', severity: 'success' });
      } else {
        res = await axios.post('/api/workorders', dataToSend, getAuthHeader());
        setOrders([...orders, res.data]);
        setSnackbar({ open: true, message: 'Orden creada', severity: 'success' });
      }
      handleCloseEdit();
    } catch (error) {
      setSnackbar({ open: true, message: `Error: ${error.message}`, severity: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/workorders/${orderToDelete._id}`, getAuthHeader());
      setOrders(orders.filter(o => o._id !== orderToDelete._id));
      setSnackbar({ open: true, message: 'Orden eliminada', severity: 'success' });
      handleCloseDelete();
    } catch (error) {
      setSnackbar({ open: true, message: `Error: ${error.message}`, severity: 'error' });
    }
  };

  const handleOpenDetail = (order) => {
    setOrderDetail(order);
    setOpenDetail(true);
  };

  const filteredOrders = orders.filter(order => {
    const txt = search.toLowerCase();
    return (
      order.title.toLowerCase().includes(txt) ||
      (order.asset && order.asset.nombre && order.asset.nombre.toLowerCase().includes(txt)) ||
      (order.assignedTo && order.assignedTo.toLowerCase().includes(txt))
    );
  });

  const isAdminOrSupervisor = usuario && (usuario.rol === 'admin' || usuario.rol === 'supervisor');

  return (
    <Paper sx={{
      p: 3,
      maxWidth: 980,
      margin: '12px',
      borderRadius: 2,
      mt: {md: 1},
      boxShadow: '0px 2px 16px rgba(40,68,89,.06)',
      background: '#fff'
    }}>      
    <Typography variant="h5" gutterBottom>Órdenes de Trabajo</Typography>
      <TextField
        label="Buscar por título, activo o responsable"
        value={search}
        onChange={e => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      {isAdminOrSupervisor && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenEdit(null)}
          sx={{ mb: 2 }}
        >
          + Nueva Orden
        </Button>
      )}

      {/* Wrapper con scroll horizontal para la tabla */}
      <Box sx={{ overflowX: 'auto' }}>
        <WorkOrderTable
          orders={filteredOrders}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onDetail={handleOpenDetail}
          usuario={usuario}
        />
      </Box>

      <WorkOrderForm
        open={openEdit}
        onClose={handleCloseEdit}
        order={orderToEdit}
        assets={assets}
        onSubmit={handleSubmit}
      />
      <WorkOrderDelete
        open={openDelete}
        onClose={handleCloseDelete}
        order={orderToDelete}
        onDelete={handleDelete}
      />
      <WorkOrderDetail
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        order={orderDetail}
        usuario={usuario}
        onStatusChange={() => {
          axios.get('/api/workorders', getAuthHeader())
            .then(res => setOrders(res.data));
        }}
      />

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <MuiAlert severity={snackbar.severity} onClose={handleSnackbarClose} elevation={6} variant="filled">
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Paper>
  );
};

export default WorkOrders;
