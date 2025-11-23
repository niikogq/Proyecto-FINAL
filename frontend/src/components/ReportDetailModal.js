import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const ReportDetailModal = ({ open, onClose, reporte }) => {
  if (!reporte) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Detalle del reporte</DialogTitle>
      <DialogContent dividers sx={{ pt: 3 }}>
        <Typography variant="h6" gutterBottom>{reporte.titulo}</Typography>
        <Typography><b>Tipo:</b> {reporte.tipo}</Typography>
        <Typography><b>Periodo:</b> {reporte.fecha_inicio?.slice(0,10)} — {reporte.fecha_fin?.slice(0,10)}</Typography>
        <Typography><b>Creado:</b> {new Date(reporte.fecha_creacion).toLocaleDateString()}</Typography>
        <Typography><b>Observaciones:</b> {reporte.observaciones_finales}</Typography>
        <Typography sx={{ mt: 2, mb: 1 }}><b>Totales:</b></Typography>
        <ul>
          <li>Total activos: {reporte.totales?.total_activos ?? '-'}</li>
          <li>Total intervenciones: {reporte.totales?.total_intervenciones ?? '-'}</li>
          <li>Tiempo promedio cierre: {reporte.totales?.tiempo_promedio_cierre ?? '-'}</li>
          <li>Incidencias abiertas: {reporte.totales?.incidencias_abiertas ?? '-'}</li>
          <li>Incidencias cerradas: {reporte.totales?.incidencias_cerradas ?? '-'}</li>
        </ul>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Resultados/intervenciones:</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Activo</TableCell>
              <TableCell>Acción</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Responsable</TableCell>
              <TableCell>Observaciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reporte.resultados && reporte.resultados.length > 0 ? reporte.resultados.map((r, i) => (
              <TableRow key={i}>
                <TableCell>{r.nombre_activo}</TableCell>
                <TableCell>{r.accion}</TableCell>
                <TableCell>{r.fecha ? r.fecha.slice(0,10) : '-'}</TableCell>
                <TableCell>{r.estado}</TableCell>
                <TableCell>{r.responsable}</TableCell>
                <TableCell>{r.observaciones}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6}>No hay intervenciones asociadas.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportDetailModal;
