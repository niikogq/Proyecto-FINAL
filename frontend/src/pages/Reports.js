import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, Typography, Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import ReportModal from '../components/ReportModal';
import ReportDetailModal from '../components/ReportDetailModal';

// Usa variable para la URL (cambia a tu dominio si lo llevas a producción)
const API_URL = 'http://localhost:3001/api/reportes';

function Reports({ usuario }) {
  const [form, setForm] = useState({
    titulo: '', tipo: '', fecha_inicio: '', fecha_fin: '', observaciones_finales: '',
  });
  const [reportes, setReportes] = useState([]);
  const [search, setSearch] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const [editReporte, setEditReporte] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openDetail, setOpenDetail] = useState(false);
  const [detalleReporte, setDetalleReporte] = useState(null);

  const getAuthHeader = () => ({
    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
  });

  const fetchReportes = useCallback(() => {
    axios.get(API_URL, getAuthHeader())
      .then(res => setReportes(res.data))
      .catch(() => setReportes([]));
  }, []);

  useEffect(() => {
    fetchReportes();
  }, [fetchReportes]);

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleOpenEdit = (reporte = null) => {
    if (reporte) {
      setEditReporte(reporte);
      setForm({
        titulo: reporte.titulo || '',
        tipo: reporte.tipo || '',
        fecha_inicio: reporte.fecha_inicio?.slice(0, 10) || '',
        fecha_fin: reporte.fecha_fin?.slice(0, 10) || '',
        observaciones_finales: reporte.observaciones_finales || '',
      });
    } else {
      setEditReporte(null);
      setForm({
        titulo: '', tipo: '', fecha_inicio: '', fecha_fin: '', observaciones_finales: ''
      });
    }
    setOpenEdit(true);
  };

  const handleCloseEdit = () => setOpenEdit(false);

  const handleSubmit = e => {
    e.preventDefault();
    if (editReporte) {
      axios.put(`${API_URL}/${editReporte._id}`, form, getAuthHeader())
        .then(() => {
          setSnackbar({ open: true, message: 'Reporte actualizado', severity: 'success' });
          fetchReportes();
          handleCloseEdit();
        })
        .catch((err) => {
          setSnackbar({ open: true, message: 'Error al editar reporte', severity: 'error' });
        });
    } else {
      axios.post(API_URL, form, getAuthHeader())
        .then(() => {
          setSnackbar({ open: true, message: 'Reporte creado', severity: 'success' });
          fetchReportes();
          handleCloseEdit();
        })
        .catch((err) => {
          setSnackbar({ open: true, message: 'Error al crear reporte', severity: 'error' });
        });
    }
  };

  const filtered = reportes.filter(r =>
    r.titulo?.toLowerCase().includes(search.toLowerCase()) ||
    r.tipo?.toLowerCase().includes(search.toLowerCase())
  );

  // 🔒 Solo admin y supervisor pueden acceder
  if (!usuario || (usuario.rol !== 'admin' && usuario.rol !== 'supervisor')) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Acceso denegado: solo admins y supervisores pueden acceder a Reportes.</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{
      p: 4,
      maxWidth: 1450,
      margin: '32px auto',
      borderRadius: 2,
      boxShadow: '0px 2px 16px rgba(40,68,89,.06)',
      background: '#fff'
    }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Reportes
      </Typography>
      <TextField
        label="Buscar por título o tipo"
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
        + NUEVO REPORTE
      </Button>
      <TableContainer component={Paper} elevation={0} sx={{ boxShadow: 'none', borderRadius: 2, border: '1px solid #eee' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: '#fafafa' }}>
              <TableCell sx={{ fontWeight: 600 }}>Título</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Periodo</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Fecha creación</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Observaciones</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  No hay reportes registrados para este filtro.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(reporte => (
                <TableRow key={reporte._id} hover>
                  <TableCell>{reporte.titulo}</TableCell>
                  <TableCell>{reporte.tipo}</TableCell>
                  <TableCell>{reporte.fecha_inicio?.slice(0, 10)} — {reporte.fecha_fin?.slice(0, 10)}</TableCell>
                  <TableCell>
                    {reporte.fecha_creacion
                      ? new Date(reporte.fecha_creacion).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell>{reporte.observaciones_finales}</TableCell>
                  <TableCell>
                    <Button
                      color="info"
                      variant="outlined"
                      size="small"
                      onClick={() => { setDetalleReporte(reporte); setOpenDetail(true); }}
                      sx={{ mr: 1 }}
                    >
                      Ver detalle
                    </Button>
                    <Button
                      color="primary"
                      variant="contained"
                      size="small"
                      onClick={() => handleOpenEdit(reporte)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ReportModal
        open={openEdit}
        onClose={handleCloseEdit}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        editReporte={editReporte}
      />
      <ReportDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        reporte={detalleReporte}
      />
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
export default Reports;
