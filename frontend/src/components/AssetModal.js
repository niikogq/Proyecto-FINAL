import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';

const tipos = ['Equipo', 'Herramienta', 'Vehículo'];
const estados = ['Activo', 'Inactivo', 'En mantenimiento', 'Fuera de servicio'];

const AssetModal = ({ open, onClose, onSubmit, form, setForm, editActivo }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>{editActivo ? 'Editar activo' : 'Registro de activo'}</DialogTitle>
    <form onSubmit={onSubmit}>
      <DialogContent>
        {/* ----- INFORMACIÓN DEL ACTIVO: Tabla HTML (2 columnas x 3 filas) ----- */}
        <table style={{ width: '100%', borderSpacing: '16px 12px' }}>
          <thead>
            <tr>
              <th colSpan="2" style={{ textAlign: 'left', fontSize: 20, paddingBottom: 8 }}>
                Información del activo
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <TextField
                  label="Nombre del activo *"
                  name="nombre"
                  value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })}
                  required fullWidth
                  placeholder="Ej: Compresor Principal"
                />
              </td>
              <td>
                <FormControl fullWidth required>
                  <InputLabel>Tipo *</InputLabel>
                  <Select
                    name="tipo"
                    value={form.tipo || ''}
                    label="Tipo *"
                    onChange={e => setForm({ ...form, tipo: e.target.value })}
                  >
                    <MenuItem value="">Seleccione un tipo</MenuItem>
                    {tipos.map(tipo => <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>)}
                  </Select>
                </FormControl>
              </td>
            </tr>
            <tr>
              <td>
                <TextField
                  label="Ubicación *"
                  name="ubicacion"
                  value={form.ubicacion || ''}
                  onChange={e => setForm({ ...form, ubicacion: e.target.value })}
                  required fullWidth
                  placeholder="Ej: Planta Principal - Sector A"
                />
              </td>
              <td>
                <TextField
                  label="Fecha de ingreso *"
                  name="fecha_adquisicion"
                  type="date"
                  value={form.fecha_adquisicion || ''}
                  onChange={e => setForm({ ...form, fecha_adquisicion: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required fullWidth
                />
              </td>
            </tr>
            <tr>
              <td>
                <FormControl fullWidth required>
                  <InputLabel>Estado *</InputLabel>
                  <Select
                    name="estado"
                    value={form.estado || ''}
                    label="Estado *"
                    onChange={e => setForm({ ...form, estado: e.target.value })}
                  >
                    <MenuItem value="">Seleccione un estado</MenuItem>
                    {estados.map(estado => <MenuItem key={estado} value={estado}>{estado}</MenuItem>)}
                  </Select>
                </FormControl>
              </td>
              <td>
                <TextField
                  label="Número de serie"
                  name="numero_serie"
                  value={form.numero_serie || ''}
                  onChange={e => setForm({ ...form, numero_serie: e.target.value })}
                  fullWidth
                  placeholder="Ej: SN-12345678"
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* ----- INFORMACIÓN ADICIONAL: Tabla HTML (2 columnas x 2 filas) ----- */}
        <table style={{ width: '100%', borderSpacing: '16px 12px', marginTop: '32px' }}>
          <thead>
            <tr>
              <th colSpan="2" style={{ textAlign: 'left', fontSize: 18, paddingBottom: 8 }}>
                Información adicional
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <TextField
                  label="Fabricante"
                  name="fabricante"
                  value={form.fabricante || ''}
                  onChange={e => setForm({ ...form, fabricante: e.target.value })}
                  fullWidth
                  placeholder="Ej: Siemens"
                />
              </td>
              <td>
                <TextField
                  label="Modelo"
                  name="modelo"
                  value={form.modelo || ''}
                  onChange={e => setForm({ ...form, modelo: e.target.value })}
                  fullWidth
                  placeholder="Ej: XC-2000"
                />
              </td>
            </tr>
            <tr>
              <td>
                <TextField
                  label="Año de fabricación"
                  name="anio_fabricacion"
                  value={form.anio_fabricacion || ''}
                  onChange={e => setForm({ ...form, anio_fabricacion: e.target.value })}
                  fullWidth
                  placeholder="Ej: 2020"
                />
              </td>
              <td>
                <TextField
                  label="Garantía hasta"
                  name="garantia_hasta"
                  type="date"
                  value={form.garantia_hasta || ''}
                  onChange={e => setForm({ ...form, garantia_hasta: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* ----- DESCRIPCIÓN: input ancho ----- */}
        <table style={{ width: '100%', borderSpacing: '16px 12px', marginTop: '32px' }}>
            <tbody>
                <tr>
                <td colSpan={2}>
                    <TextField
                    label="Descripción"
                    name="descripcion"
                    value={form.descripcion || ''}
                    onChange={e => setForm({ ...form, descripcion: e.target.value })}
                    fullWidth
                    multiline
                    minRows={2}
                    placeholder="Ingrese una descripción detallada del activo..."
                    />
                </td>
                </tr>
            </tbody>
        </table>

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button type="submit" variant="contained">
          {editActivo ? 'Guardar cambios' : 'Guardar'}
        </Button>
      </DialogActions>
    </form>
  </Dialog>
);

export default AssetModal;