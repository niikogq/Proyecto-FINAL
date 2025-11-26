import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, CircularProgress, Grid } from '@mui/material';
import { Indicadores, EstadoActivosGrafico, ActividadReciente, UsuariosPorRol, TecnicosDisponibles, OrdenesGrafico } from '../components/dashboard';

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
    <Box sx={{ maxWidth: 1700, margin: '8px auto 32px auto', px: 2 }}>
      <Indicadores datos={datos} />
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Estado de Activos */}
        <Grid item xs={12} md={4}>
          <EstadoActivosGrafico activos={datos.activos} />
        </Grid>
        {/* Gráfico de Órdenes de trabajo */}
        <Grid item xs={12} md={4}>
          <OrdenesGrafico workordersPorPeriodo={datos.workordersPorPeriodo} />
        </Grid>
        {/* Actividad Reciente con scroll */}
        <Grid item xs={12} md={4}>
          <ActividadReciente actividades={datos.actividadReciente} />
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mt: 0.5 }}>

        <Grid item xs={12} md={6} lg={8}>
          <TecnicosDisponibles
            tecnicos={datos.tecnicosDisponibles}
            tecnicosOcupados={datos.tecnicosOcupados}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <UsuariosPorRol usuarios={datos.usuariosPorRol} />
        </Grid>
      </Grid>
    </Box>
  );
}
