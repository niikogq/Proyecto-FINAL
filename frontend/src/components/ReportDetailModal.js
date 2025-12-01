import React, { useRef } from 'react';
import { Dialog,DialogTitle,DialogContent,DialogActions,Button,Typography,Table,TableBody,TableCell,TableHead,TableRow,Box,Divider } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ReportDetailModal = ({ open, onClose, reporte }) => {
  const contenidoRef = useRef(null);

  if (!reporte) return null;

  const handleDownloadPDF = async () => {
    if (!contenidoRef.current) return;

    try {
      const element = contenidoRef.current;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`reporte-${reporte._id || 'gemprotec'}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Detalle del reporte</DialogTitle>

      <DialogContent dividers sx={{ pt: 3 }} ref={contenidoRef}>
        
        {/* ENCABEZADO DEL REPORTE */}
        <Box sx={{ mb: 3, pb: 2, borderBottom: '2px solid #1f2937' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937' }}>
            GEMPROTEC
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            Gestión de Mantenimiento
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 600, color: '#111827' }}>
            {reporte.titulo}
          </Typography>
        </Box>

        {/* INFORMACIÓN GENERAL */}
        <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '12px' }}>
              <b>Tipo:</b>
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {reporte.tipo}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '12px' }}>
              <b>Creado:</b>
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {new Date(reporte.fecha_creacion).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '12px' }}>
              <b>Período:</b>
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {reporte.fecha_inicio?.slice(0,10)} — {reporte.fecha_fin?.slice(0,10)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '12px' }}>
              <b>Observaciones:</b>
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {reporte.observaciones_finales}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* TOTALES */}
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          <b>Resumen de Totales</b>
        </Typography>
        <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2 }}>
          <Box sx={{ p: 1.5, background: '#f0fdf4', borderRadius: 1, border: '1px solid #86efac' }}>
            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '11px' }}>
              Total Activos
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#16a34a' }}>
              {reporte.totales?.total_activos ?? '-'}
            </Typography>
          </Box>
          <Box sx={{ p: 1.5, background: '#fef3c7', borderRadius: 1, border: '1px solid #fcd34d' }}>
            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '11px' }}>
              Total Intervenciones
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#f59e0b' }}>
              {reporte.totales?.total_intervenciones ?? '-'}
            </Typography>
          </Box>
          <Box sx={{ p: 1.5, background: '#dbeafe', borderRadius: 1, border: '1px solid #93c5fd' }}>
            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '11px' }}>
              Incidencias Abiertas
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#3b82f6' }}>
              {reporte.totales?.incidencias_abiertas ?? '-'}
            </Typography>
          </Box>
          <Box sx={{ p: 1.5, background: '#dcfce7', borderRadius: 1, border: '1px solid #bbf7d0' }}>
            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '11px' }}>
              Incidencias Cerradas
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#22c55e' }}>
              {reporte.totales?.incidencias_cerradas ?? '-'}
            </Typography>
          </Box>
          <Box sx={{ p: 1.5, background: '#f3e8ff', borderRadius: 1, border: '1px solid #e9d5ff' }}>
            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '11px' }}>
              Tiempo Promedio Cierre
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#9333ea' }}>
              {reporte.totales?.tiempo_promedio_cierre ?? '-'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* TABLA DE INTERVENCIONES */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          <b>Detalle de Intervenciones</b>
        </Typography>
        <Table size="small" sx={{ mb: 2 }}>
          <TableHead>
            <TableRow sx={{ background: '#f3f4f6' }}>
              <TableCell sx={{ fontWeight: 700, fontSize: '12px' }}>Activo</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '12px' }}>Acción</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '12px' }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '12px' }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '12px' }}>Responsable</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '12px' }}>Observaciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reporte.resultados && reporte.resultados.length > 0 ? (
              reporte.resultados.map((r, i) => (
                <TableRow key={i}>
                  <TableCell sx={{ fontSize: '12px' }}>{r.nombre_activo}</TableCell>
                  <TableCell sx={{ fontSize: '12px' }}>{r.accion}</TableCell>
                  <TableCell sx={{ fontSize: '12px' }}>{r.fecha ? r.fecha.slice(0,10) : '-'}</TableCell>
                  <TableCell sx={{ fontSize: '12px' }}>{r.estado}</TableCell>
                  <TableCell sx={{ fontSize: '12px' }}>{r.responsable}</TableCell>
                  <TableCell sx={{ fontSize: '12px' }}>{r.observaciones}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', color: '#9ca3af' }}>
                  No hay intervenciones asociadas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* PIE DE PÁGINA */}
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#9ca3af' }}>
            Reporte generado por GEMPROTEC — {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleDownloadPDF} color="success" variant="contained">
          📥 Descargar PDF
        </Button>
        <Button onClick={onClose} color="inherit">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportDetailModal;
