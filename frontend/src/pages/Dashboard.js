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
    <Box sx={{ 
      width: '100%',
      overflow: 'hidden'
    }}>
      {/* Indicadores grandes - SIN CAMBIOS */}
      <Indicadores datos={datos} />

      {/* ✅ NUEVO: Contenedor para los gráficos con flexbox */}
      <Box sx={{ maxWidth: '91%' }}>
        {/* Los 2 primeros gráficos lado a lado con Flexbox */}
        <Box sx={{ 
          display: 'flex', 
          gap: 7,
          flexWrap: 'wrap',
          mt: 1,
          mb: 2.5
        }}>
          {/* Estado de Activos - 50% */}
          <Box sx={{ 
            flex: '1 1 calc(50% - 28px)', 
            minWidth: { xs: '100%', md: 'calc(50% - 28px)' } 
          }}>
            <EstadoActivosGrafico activos={datos.activos} />
          </Box>
          
          {/* Órdenes de Trabajo - 50% */}
          <Box sx={{ 
            flex: '1 1 calc(50% - 28px)', 
            minWidth: { xs: '100%', md: 'calc(50% - 28px)' } 
          }}>
            <OrdenesGrafico workordersPorPeriodo={datos.workordersPorPeriodo} />
          </Box>
        </Box>

        {/* Actividad Reciente - 100% ancho */}
        <Box sx={{ mb: 2.5 }}>
          <ActividadReciente actividades={datos.actividadReciente} />
        </Box>
      </Box>

      {/* Técnicos y usuarios - SIN CAMBIOS */}
      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        <Grid item xs={12} lg={8}>
          <TecnicosDisponibles
            tecnicos={datos.tecnicosDisponibles}
            tecnicosOcupados={datos.tecnicosOcupados}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <UsuariosPorRol usuarios={datos.usuariosPorRol} />
        </Grid>
      </Grid>
    </Box>
  );
}
