import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

const opciones = [
  { value: 'analizar_descripcion', label: 'Análisis de falla/diagnóstico' },
  { value: 'sugerir_mantenimiento', label: 'Sugerencia de mantenimiento' },
  { value: 'resumir_reporte', label: 'Resumen de reporte/actividad' },
];

export default function IAModule() {
  const [funcion, setFuncion] = useState('analizar_descripcion');
  const [entrada, setEntrada] = useState('');
  const [historial, setHistorial] = useState(''); // solo se usa para mantenimiento
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setResult(null);
    setLoading(true);
    let body;
    if (funcion === 'analizar_descripcion') {
      body = { funcion, descripcion: entrada };
    } else if (funcion === 'sugerir_mantenimiento') {
      // Debe recibir un arreglo [{desc, tipo, estado}], para demo se puede pegar texto y parsear
      try {
        body = { funcion, historial: JSON.parse(historial) };
      } catch {
        setResult({ error: 'Historial debe estar en formato JSON válido.' });
        setLoading(false);
        return;
      }
    } else if (funcion === 'resumir_reporte') {
      body = { funcion, resumen: entrada };
    }
    try {
      const res = await axios.post('http://localhost:3001/api/ia/consultar', body, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setResult(res.data);
    } catch (err) {
      setResult({ error: 'Error de conexión con la IA.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 650, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" mb={2}>Módulo Inteligente GEMPROTEC (IA)</Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Función IA</InputLabel>
          <Select
            value={funcion}
            label="Función IA"
            onChange={e => { setFuncion(e.target.value); setResult(null); }}
          >
            {opciones.map(opt => (
              <MenuItem value={opt.value} key={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {funcion === 'analizar_descripcion' && (
          <TextField
            label="Describe el fallo o solicitud"
            value={entrada}
            onChange={e => setEntrada(e.target.value)}
            multiline minRows={3} fullWidth sx={{ mb: 2 }}
          />
        )}
        {funcion === 'resumir_reporte' && (
          <TextField
            label="Pega o redacta el resumen del reporte"
            value={entrada}
            onChange={e => setEntrada(e.target.value)}
            multiline minRows={3} fullWidth sx={{ mb: 2 }}
          />
        )}
        {funcion === 'sugerir_mantenimiento' && (
          <TextField
            label='Historial (formato [{"desc": "...", "tipo": "...", "estado": "..."}])'
            value={historial}
            onChange={e => setHistorial(e.target.value)}
            multiline minRows={4} fullWidth sx={{ mb: 2 }}
            placeholder='Ejemplo: [{"desc": "Fuga en válvula", "tipo": "Correctivo", "estado": "Cerrado"}]'
          />
        )}
        <Box mt={1}>
          <Button variant="contained" disabled={loading} onClick={handleSubmit}>
            Analizar IA
          </Button>
        </Box>
        {result && (
          <Box mt={3}>
            <Typography variant="subtitle1">Resultado IA:</Typography>
            {result.error && <Typography color="error.main">{result.error}</Typography>}
            {result.tipo_sugerido && <Typography>Tipo sugerido: {result.tipo_sugerido}</Typography>}
            {result.prioridad && <Typography>Prioridad: {result.prioridad}</Typography>}
            {result.sugerencia && <Typography color="info.main">{result.sugerencia}</Typography>}
            {result.recomendacion && <Typography>{result.recomendacion}</Typography>}
            {result.resumen && <Typography>{result.resumen}</Typography>}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
