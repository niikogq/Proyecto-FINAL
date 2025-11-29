import React from 'react';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import BuildIcon from '@mui/icons-material/Build';
import PeopleIcon from '@mui/icons-material/People';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// Indicadores grandes (responsive)
export function Indicadores({ datos }) {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexWrap: 'wrap',
      mt: { xs: 2, md: 10 },
      mb: { xs: 2, md: 3 }, 
      gap: { xs: 2, md: 3 },
      width: '100%'  // <-- AGREGADO
    }}>
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
        subtitulo="Ordenes en progreso"
      />
      <IndicadorCard
        color="#ffa726"
        icon={<ReportProblemIcon />}
        titulo="Fallos Hoy"
        valor={datos.fallosHoy ?? 0}
        subtitulo="Reportados hoy"
      />
    </Box>
  );
}

function IndicadorCard({ color, icon, titulo, valor, subtitulo }) {
  return (
    <Card sx={{ 
      bgcolor: color, 
      color: '#fff', 
      minWidth: { xs: '100%', sm: 220, md: 250 },  // <-- AJUSTADO
      flex: '1 1 auto',  // <-- CAMBIADO para mejor distribución
      maxWidth: { sm: '48%', md: '32%' }  // <-- NUEVO: limita crecimiento
    }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h6">{titulo}</Typography>
          {icon}
        </Box>
        <Typography variant="h3">{valor}</Typography>
        {subtitulo && <Typography sx={{ opacity: 0.85 }}>{subtitulo}</Typography>}
      </CardContent>
    </Card>
  );
}

// Estado de Activos - CON ALTURA FIJA
export function EstadoActivosGrafico({ activos, cardProps = {} }) {
  const labels = Object.keys(activos.porEstado);
  const data = Object.values(activos.porEstado);
  const colors = ['#44b979', '#ffc107', '#e53935', '#8884d8'];
  
  return (
    <Card {...cardProps} sx={{ 
      p: 2, 
      height: 350,  // ✅ ALTURA FIJA (antes era '100%')
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      ...cardProps.sx 
    }}>
      <Typography variant="h6" gutterBottom>Estado de Activos</Typography>
      <Box sx={{ 
        flex: 1,
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        px: 1
      }}>
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
            responsive: true,
            cutout: '60%',
            plugins: { 
              legend: { 
                display: true, 
                position: 'bottom',
                labels: { boxWidth: 12, padding: 8 }
              } 
            }
          }}
        />
      </Box>
    </Card>
  );
}

// Gráfico de Órdenes - CON ALTURA FIJA
export function OrdenesGrafico({ workordersPorPeriodo, cardProps = {} }) {
  if (!workordersPorPeriodo || !workordersPorPeriodo.labels) {
    return (
      <Card {...cardProps} sx={{ 
        p: 2, 
        height: 350,  // ✅ ALTURA FIJA
        width: '100%',
        ...cardProps.sx 
      }}>
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
    <Card {...cardProps} sx={{ 
      p: 2, 
      height: 350,  // ✅ ALTURA FIJA
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      ...cardProps.sx 
    }}>
      <Typography variant="h6" gutterBottom>Órdenes de Trabajo</Typography>
      <Box sx={{ 
        flex: 1,
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        px: 1
      }}>
        <Bar
          data={data}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            plugins: { 
              legend: { 
                position: 'top',
                labels: { boxWidth: 12, padding: 8 }
              } 
            },
            scales: {
              x: { grid: { display: false } },
              y: { beginAtZero: true }
            }
          }}
        />
      </Box>
    </Card>
  );
}

// Actividad Reciente - CON ALTURA FIJA
export function ActividadReciente({ actividades, cardProps = {} }) {
  return (
    <Card {...cardProps} sx={{ 
      p: 2, 
      height: 350,  // ✅ ALTURA FIJA
      width: '100%',
      display: 'flex', 
      flexDirection: 'column', 
      ...cardProps.sx 
    }}>
      <Typography variant="h6" gutterBottom>Actividad Reciente</Typography>
      <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
        <List dense>
          {actividades && actividades.length ? (
            actividades.map((act, idx) => (
              <ListItem key={idx} sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <AssignmentTurnedInIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={act.message}
                  secondary={
                    `Por ${act.usuario || 'Sistema'} — ${act.tipoActividad || ''}` +
                    (act.createdAt ? ' — ' + new Date(act.createdAt).toLocaleString('es-CL', { 
                      day: '2-digit', 
                      month: 'short', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : '')
                  }
                  primaryTypographyProps={{ fontSize: '0.9rem' }}
                  secondaryTypographyProps={{ fontSize: '0.75rem' }}
                />
              </ListItem>
            ))
          ) : (
            <ListItem><ListItemText primary="No hay actividad reciente." /></ListItem>
          )}
        </List>
      </Box>
    </Card>
  );
}

// Técnicos - SIN ANCHO FIJO
export function TecnicosDisponibles({ tecnicos = [], tecnicosOcupados = [] }) {
  return (
    <Card sx={{ p: 2, width: '100%', height: '100%' }}>
      <Typography variant="h6" gutterBottom>Técnicos Disponibles</Typography>
      {tecnicos.length > 0 ? (
        <Box sx={{ overflowX: 'auto', mb: 2 }}>
          <Table size="small" sx={{ minWidth: 400 }}>
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
                  <TableCell><Typography color="green" fontSize="0.875rem">Disponible</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      ) : (
        <Typography sx={{ mt: 1, mb: 2 }}>No hay técnicos disponibles.</Typography>
      )}

      <Typography variant="h6" gutterBottom>Técnicos Ocupados</Typography>
      {tecnicosOcupados.length > 0 ? (
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 400 }}>
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
                  <TableCell><Typography color="orange" fontSize="0.875rem">Ocupado</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      ) : (
        <Typography sx={{ mt: 1 }}>No hay técnicos ocupados.</Typography>
      )}
    </Card>
  );
}

// Usuarios por rol
export function UsuariosPorRol({ usuarios }) {
  return (
    <Card sx={{ p: 2, width: '100%', height: '100%' }}>
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