import React from 'react';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import BuildIcon from '@mui/icons-material/Build';
import PeopleIcon from '@mui/icons-material/People';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// --- Tarjetas de indicadores grandes
export function Indicadores({ datos }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 3, gap: 3 }}>
      <IndicadorCard
        color="#44b979"
        icon={<AssignmentIcon />}
        titulo="Activos"
        valor={datos.activos?.total ?? 0}
        subtitulo="Total de activos registrados"
      />
      <IndicadorCard
        color="#1e88e5"
        icon={<AssignmentIcon />}
        titulo="Órdenes de Trabajo"
        valor={datos.workorders?.['En Progreso'] ?? 0}
        subtitulo="Ordenes de progreso"
      />
      <IndicadorCard
        color="#ffa726"
        icon={<ReportProblemIcon />}
        titulo=""
        valor={datos.fallosHoy ?? 0}
        subtitulo=""
        variacion=""
      />
    </Box>
  );
}

function IndicadorCard({ color, icon, titulo, valor, subtitulo, variacion }) {
  return (
    <Card sx={{ bgcolor: color, color: '#fff', minWidth: 250, flex: 1 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h6">{titulo}</Typography>
          {icon}
        </Box>
        <Typography variant="h3">{valor}</Typography>
        {subtitulo && <Typography sx={{ opacity: 0.85 }}>{subtitulo}</Typography>}
        {variacion && <Typography fontSize={14} sx={{ opacity: 0.7 }}>{variacion}</Typography>}
      </CardContent>
    </Card>
  );
}

// --- Estado de Activos (Donut)
export function EstadoActivosGrafico({ activos, cardProps = {} }) {
  const labels = Object.keys(activos.porEstado);
  const data = Object.values(activos.porEstado);
  const colors = ['#44b979', '#ffc107', '#e53935', '#8884d8'];
  return (
    <Card {...cardProps} sx={{ mb: 3, p: 2, minHeight: 200, maxHeight: 300, width: 482, ...cardProps.sx }}>
      <Typography variant="h6" gutterBottom>Estado de Activos</Typography>
      <Box
        sx={{
          width: '90%',
          height: 150,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Doughnut
          data={{
            labels,
            datasets: [{
              data,
              backgroundColor: colors.slice(0, labels.length),
              borderWidth: 1
            }]
          }}
          options={{
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
              legend: { display: true, position: 'right' }
            }
          }}
          width={260}
          height={200}
        />
      </Box>
    </Card>
  );
}
// --- Gráfico de Órdenes de Trabajo (Bar)
export function OrdenesGrafico({ workordersPorPeriodo, cardProps = {} }) {
  if (!workordersPorPeriodo || !workordersPorPeriodo.labels) {
    return (
      <Card {...cardProps} sx={{ mb: 3, p: 2, minHeight: 350, maxHeight: 420, ...cardProps.sx }}>
        <Typography variant="h6" gutterBottom>Órdenes de Trabajo</Typography>
        <Typography sx={{ mt: 2 }}>No hay datos de órdenes de trabajo.</Typography>
      </Card>
    );
  }
  const data = {
    labels: workordersPorPeriodo.labels,
    datasets: [
      { label: 'Pendientes', backgroundColor: '#e53935', data: workordersPorPeriodo.pendientes },
      { label: 'En Progreso', backgroundColor: '#1e88e5', data: workordersPorPeriodo.enProgreso },
      { label: 'Completadas', backgroundColor: '#44b979', data: workordersPorPeriodo.completadas }
    ]
  };
  return (
    <Card {...cardProps} sx={{ mb: 3, p: 2, minHeight: 200, maxHeight: 300, width: 485, ...cardProps.sx }}>
      <Typography variant="h6" gutterBottom>Órdenes de Trabajo</Typography>
      <Box
        sx={{
          width: '100%',
          height: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Bar
          data={data}
          options={{
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } },
            responsive: true,
          }}
          width={260}
          height={220}
        />
      </Box>
    </Card>
  );
}

// --- Actividad Reciente (scroll, tamaño idéntico)
export function ActividadReciente({ actividades, cardProps = {} }) {
  return (
    <Card {...cardProps} sx={{ p: 1.5, mb: 2, height: 210, width: 490, display: 'flex', flexDirection: 'column', ...cardProps.sx }}>
      <Typography variant="h6" gutterBottom>Actividad Reciente</Typography>
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <List>
          {actividades && actividades.length
            ? actividades.map((act, idx) => (
                <ListItem key={idx}>
                  <ListItemIcon>
                    <AssignmentTurnedInIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={act.message}
                    secondary={
                      `Por ${act.usuario || 'Sistema'} — ${act.tipoActividad || ''}` +
                      (act.createdAt ? ' — ' + new Date(act.createdAt).toLocaleString() : '')
                    }
                  />
                </ListItem>
              ))
            : <ListItem><ListItemText primary="No hay actividad reciente." /></ListItem>
          }
        </List>
      </Box>
    </Card>
  );
}

// --- Técnicos disponibles/ocupados
export function TecnicosDisponibles({ tecnicos = [], tecnicosOcupados = [] }) {
  return (
    <Card sx={{ p: 2, mb: 2, width: 482 }}>
      <Typography variant="h6" gutterBottom>Técnicos Disponibles</Typography>
      {tecnicos.length > 0 ? (
        <Table size="small" sx={{ mb: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tecnicos.map((tecnico, idx) => (
              <TableRow key={tecnico._id || idx}>
                <TableCell>{tecnico.nombre}</TableCell>
                <TableCell>{tecnico.email}</TableCell>
                <TableCell>
                  <Typography color="green">Disponible</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography sx={{ mt: 1, mb: 2 }}>No hay técnicos disponibles.</Typography>
      )}

      <Typography variant="h6" gutterBottom>Técnicos Ocupados</Typography>
      {tecnicosOcupados.length > 0 ? (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tecnicosOcupados.map((tecnico, idx) => (
              <TableRow key={`o${tecnico._id || idx}`}>
                <TableCell>{tecnico.nombre}</TableCell>
                <TableCell>{tecnico.email}</TableCell>
                <TableCell>
                  <Typography color="orange">Ocupado</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography sx={{ mt: 1 }}>No hay técnicos ocupados.</Typography>
      )}
    </Card>
  );
}
  // --- Cantidad de usuarios
  export function UsuariosPorRol({ usuarios }) {
    return (
      <Card sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Cantidad de Usuarios</Typography>
        <List>
          <ListItem>
            <ListItemIcon><BuildIcon color="info" /></ListItemIcon>
            <ListItemText primary={`Supervisores: ${usuarios.supervisor ?? 0}`} />
          </ListItem>
          <ListItem>
            <ListItemIcon><PeopleIcon color="success" /></ListItemIcon>
            <ListItemText primary={`Técnicos: ${usuarios.tecnico ?? 0}`} />
          </ListItem>
        </List>
      </Card>
    );
  }
  