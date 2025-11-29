import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, Typography, Snackbar, FormControl, InputLabel, Select, MenuItem, Tooltip
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import AssetModal from '../components/AssetModal';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

function Assets({ usuario }) {
  // Todos los hooks y funciones arriba
  const [form, setForm] = useState({
    nombre: '', tipo: '', ubicacion: '', fecha_adquisicion: '', estado: '', numero_serie: '',
    fabricante: '', modelo: '', anio_fabricacion: '', garantia_hasta: '', descripcion: '',
  });

  const [activos, setActivos] = useState([]);
  const [search, setSearch] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const [editActivo, setEditActivo] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [activoAEliminar, setActivoAEliminar] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  const getAuthHeader = () => ({
    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
  });

  const activosFiltrados = activos.filter(activo => {
    const match =
      activo.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      activo.descripcion?.toLowerCase().includes(search.toLowerCase());
    const estadoMatch = filtroEstado === 'Todos' || activo.estado === filtroEstado;
    return match && estadoMatch;
  });

  const fetchActivos = useCallback(() => {
    axios.get('/api/assets', getAuthHeader())
      .then(res => setActivos(res.data))
      .catch(() => setActivos([]));
  }, []);
  useEffect(() => { fetchActivos(); }, [fetchActivos]);

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleOpenEdit = (activo = null) => {
    if (activo) {
      setEditActivo({ ...activo, fecha_adquisicion: activo.fecha_adquisicion?.slice(0, 10) || '' });
      setForm({
        nombre: activo.nombre || '',
        tipo: activo.tipo || '',
        ubicacion: activo.ubicacion || '',
        fecha_adquisicion: activo.fecha_adquisicion?.slice(0, 10) || '',
        estado: activo.estado || '',
        numero_serie: activo.numero_serie || '',
        fabricante: activo.fabricante || '',
        modelo: activo.modelo || '',
        anio_fabricacion: activo.anio_fabricacion || '',
        garantia_hasta: activo.garantia_hasta || '',
        descripcion: activo.descripcion || '',
      });
    } else {
      setEditActivo(null);
      setForm({
        nombre: '', tipo: '', ubicacion: '', fecha_adquisicion: '', estado: '', numero_serie: '',
        fabricante: '', modelo: '', anio_fabricacion: '', garantia_hasta: '', descripcion: ''
      });
    }
    setOpenEdit(true);
  };
  const handleCloseEdit = () => setOpenEdit(false);

  const handleOpenDelete = activo => {
    setActivoAEliminar(activo);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => setOpenDelete(false);

  const handleSubmit = e => {
    e.preventDefault();
    if (editActivo) {
      axios.put(`/api/assets/${editActivo._id}`, form, getAuthHeader())
        .then(() => {
          setSnackbar({ open: true, message: 'Activo actualizado', severity: 'success' });
          fetchActivos();
          handleCloseEdit();
        })
        .catch(() => setSnackbar({ open: true, message: 'Error al editar activo', severity: 'error' }));
    } else {
      axios.post('/api/assets', form, getAuthHeader())
        .then(() => {
          setSnackbar({ open: true, message: 'Activo creado', severity: 'success' });
          fetchActivos();
          handleCloseEdit();
        })
        .catch(() => setSnackbar({ open: true, message: 'Error al crear activo', severity: 'error' }));
    }
  };

  const handleDelete = () => {
    axios.delete(`/api/assets/${activoAEliminar._id}`, getAuthHeader())
      .then(() => {
        setSnackbar({ open: true, message: 'Activo eliminado', severity: 'success' });
        fetchActivos();
        handleCloseDelete();
      })
      .catch(() => setSnackbar({ open: true, message: 'Error al eliminar activo', severity: 'error' }));
  };

  // 🔒 SOLO admins pueden acceder
  if (!usuario || usuario.rol !== 'admin') {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Acceso denegado: solo admins pueden acceder a Activos.</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{
      p: 4,
      maxWidth: 1650,
      margin: '32px auto',
      borderRadius: 2,
      boxShadow: '0px 2px 16px rgba(40,68,89,.06)',
      background: '#fff'
    }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Gestión de Activos
      </Typography>
      <TextField
        label="Buscar por nombre o descripción"
        value={search}
        onChange={e => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenEdit(null)}
        sx={{ mb: 2, textTransform: 'none', fontWeight: 500 }}
      >
        + AGREGAR ACTIVO
      </Button>
      <TableContainer component={Paper} elevation={0} sx={{
        boxShadow: 'none',
        borderRadius: 2,
        border: '1px solid #eee',
        overflowX: 'auto' // <-- AGREGADO para scroll horizontal en móvil
      }}>
        <Table sx={{ minWidth: 650 }}> {/* minWidth asegura scroll en pantallas pequeñas */}
          <TableHead>
            <TableRow sx={{ background: '#fafafa' }}>
              <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Descripción</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Fecha Adq.</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 190 }}>
                <FormControl variant="standard" sx={{ minWidth: 92 }}>
                  <InputLabel id="filtro-estado-label">Estado</InputLabel>
                  <Select
                    labelId="filtro-estado-label"
                    value={filtroEstado}
                    onChange={e => setFiltroEstado(e.target.value)}
                    label="Estado"
                  >
                    <MenuItem value="Todos">Todos</MenuItem>
                    <MenuItem value="Activo">Activo</MenuItem>
                    <MenuItem value="Inactivo">Inactivo</MenuItem>
                    <MenuItem value="En mantenimiento">En mantenimiento</MenuItem>
                    <MenuItem value="Fuera de servicio">Fuera de servicio</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, width: 110 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  No hay activos registrados para este filtro.
                </TableCell>
              </TableRow>
            ) : (
              activosFiltrados.map(activo => (
                <TableRow key={activo._id}>
                  <TableCell>{activo.nombre}</TableCell>
                  <TableCell>{activo.descripcion}</TableCell>
                  <TableCell>
                    {activo.fecha_adquisicion
                      ? activo.fecha_adquisicion.slice(0, 10)
                      : '-'}
                  </TableCell>
                  <TableCell>{activo.estado}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Editar activo" placement="top">
                      <Button
                        color="primary"
                        size="small"
                        sx={{ p: 0, minWidth: 0, mr: 1 }}
                        onClick={() => handleOpenEdit(activo)}
                      >
                        <EditIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Eliminar activo" placement="top">
                      <Button
                        color="error"
                        size="small"
                        sx={{ p: 0, minWidth: 0 }}
                        onClick={() => handleOpenDelete(activo)}
                      >
                        <DeleteIcon />
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AssetModal
        open={openEdit}
        onClose={handleCloseEdit}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        editActivo={editActivo}
      />

      <Dialog open={openDelete} onClose={handleCloseDelete} maxWidth="xs">
        <DialogTitle>¿Eliminar activo?</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Confirma eliminar el activo <strong>{activoAEliminar?.nombre}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="secondary" variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Paper>
  );
}
export default Assets;
