import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, CircularProgress, Grid } from '@mui/material';
import {
  Indicadores,
  EstadoActivosGrafico,
  ActividadReciente,
  UsuariosPorRol,
  TecnicosDisponibles,
  OrdenesGrafico
} from '../components/dashboard';

export default function Dashboard() {
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3001/api/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setDatos(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !datos)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 1700, margin: '32px auto', px: 2 }}>
      <Indicadores datos={datos} />
      <Grid container columns={12} spacing={3}>
        <Grid gridColumn="span 6">
          <EstadoActivosGrafico activos={datos.activos} />
        </Grid>
        <Grid gridColumn="span 6">
          <OrdenesGrafico workordersPorPeriodo={datos.workordersPorPeriodo} />
        </Grid>
      </Grid>
      <Grid container columns={12} spacing={3}>
        <Grid gridColumn="span 6">
          <ActividadReciente actividades={datos.actividadReciente} />
        </Grid>
        <Grid gridColumn="span 3">
          <UsuariosPorRol usuarios={datos.usuariosPorRol} />
        </Grid>
        <Grid gridColumn="span 3">
        <TecnicosDisponibles
          tecnicos={datos.tecnicosDisponibles}
          tecnicosOcupados={datos.tecnicosOcupados}
        />
        </Grid>
      </Grid>
    </Box>
  );
}
