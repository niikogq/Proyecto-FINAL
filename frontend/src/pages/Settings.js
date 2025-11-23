import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button, Snackbar, TextField, FormControl, InputLabel, Select, MenuItem, Pagination, Stack } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import UserTable from '../components/UserTable';
import UserFormModal from '../components/UserFormModal';
import UserDeleteModal from '../components/UserDeleteModal';

function Settings({ usuario }) {
  const [users, setUsers] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Para editar/eliminar
  const [formMode, setFormMode] = useState('create'); // 'create' o 'edit'
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // FILTROS Y PAGINACIÓN
  const [search, setSearch] = useState('');
  const [rolFiltro, setRolFiltro] = useState('Todos');
  const [page, setPage] = useState(1);
  const rowsPerPage = 5; // Cambia este valor si quieres más o menos usuarios por página

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      setUsers(res.data);
    } catch (error) {
      setUsers([]);
      setSnackbar({ open: true, message: 'Error al cargar usuarios', severity: 'error' });
    }
  };

  // Modal para crear usuario
  const handleOpenCreate = () => {
    setFormMode('create');
    setSelectedUser(null);
    setOpenForm(true);
  };

  // Modal para editar usuario (recibe usuario)
  const handleOpenEdit = (user) => {
    setFormMode('edit');
    setSelectedUser(user);
    setOpenForm(true);
  };

  // Modal para eliminar usuario
  const handleOpenDelete = (user) => {
    setSelectedUser(user);
    setOpenDelete(true);
  };

  const handleCloseForm = () => setOpenForm(false);
  const handleCloseDelete = () => setOpenDelete(false);
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  // Crear o editar usuario (llamada a API)
  const handleSubmitUser = async (form) => {
    try {
      if (formMode === 'create') {
        await axios.post('/api/users', form, {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        });
        setSnackbar({ open: true, message: 'Usuario creado correctamente', severity: 'success' });
      } else {
        await axios.put(`/api/users/${selectedUser._id}`, form, {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        });
        setSnackbar({ open: true, message: 'Usuario actualizado correctamente', severity: 'success' });
      }
      handleCloseForm();
      fetchUsers();
    } catch (error) {
      setSnackbar({ open: true, message: `Error: ${error.response?.data?.error || error.message}`, severity: 'error' });
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async () => {
    try {
      await axios.delete(`/api/users/${selectedUser._id}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      setSnackbar({ open: true, message: 'Usuario eliminado', severity: 'success' });
      handleCloseDelete();
      fetchUsers();
    } catch (error) {
      setSnackbar({ open: true, message: `Error: ${error.response?.data?.error || error.message}`, severity: 'error' });
    }
  };

  // FILTRADO
  const filteredUsers = users.filter(u =>
    (rolFiltro === 'Todos' || u.rol === rolFiltro) && (
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.rol.toLowerCase().includes(search.toLowerCase())
    )
  );

  // PAGINACIÓN
  const pageCount = Math.ceil(filteredUsers.length / rowsPerPage);
  const paginatedUsers = filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Si cambias filtros o búsqueda, regresa a página 1
  useEffect(() => { setPage(1); }, [search, rolFiltro]);

  // Sólo admin puede ver el panel
  if (!usuario || usuario.rol !== 'admin') {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Acceso denegado: solo admins pueden acceder a Configuración.</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 900, margin: '32px auto', borderRadius: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Usuarios registrados
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Buscar usuario"
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Nombre, Email o Rol"
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="rol-filtro-label">Filtrar por Rol</InputLabel>
          <Select
            labelId="rol-filtro-label"
            value={rolFiltro}
            label="Filtrar por Rol"
            onChange={e => setRolFiltro(e.target.value)}
          >
            <MenuItem value="Todos">Todos</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="supervisor">Supervisor</MenuItem>
            <MenuItem value="tecnico">Técnico</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleOpenCreate}
          sx={{
            minWidth: 120,      // Puedes ajustar este valor o usar px: 2 para ancho automático
            height: 40,
            fontSize: '0.55rem',
            fontWeight: 550,
            textTransform: 'none'
          }}
        >
          + CREAR USUARIO
        </Button>
      </Stack>

      <UserTable
        users={paginatedUsers}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Paginación */}
      {pageCount > 1 &&
        <Stack alignItems="center" sx={{ mt: 2 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Stack>
      }

      <UserFormModal
        open={openForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmitUser}
        user={formMode === 'edit' ? selectedUser : null}
        mode={formMode}
      />
      <UserDeleteModal
        open={openDelete}
        onClose={handleCloseDelete}
        onDelete={handleDeleteUser}
        user={selectedUser}
      />
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <MuiAlert severity={snackbar.severity} elevation={6} variant="filled" onClose={handleSnackbarClose}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Paper>
  );
}

export default Settings;
