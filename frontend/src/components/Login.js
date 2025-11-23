import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, TextField, Button, Avatar, CircularProgress, Alert
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.user));
        onLogin(data.user);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login incorrecto');
      }
    } catch {
      setLoading(false);
      setError('Error conectando con el servidor');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#e5e7eb 0,#6DC9E2 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Typography
        variant="h3"
        fontWeight="bold"
        color="#000000ff"
        mb={4}
        sx={{
          textShadow: '0 2px 10px #378bc020',
          letterSpacing: 2,
        }}
      >
        ¡Bienvenido a GEMPROTEC!
      </Typography>
      <Paper elevation={6} sx={{
        px: 4, py: 5, minWidth: 340, maxWidth: '90%', borderRadius: 3,
        display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        <Avatar sx={{ bgcolor: '#4F8AD8', mb: 2 }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5" fontWeight="bold" color="#333" mb={3}>Iniciar sesión</Typography>
        <form style={{ width: '100%' }} onSubmit={handleSubmit}>
          <TextField
            label="Correo electrónico"
            type="email"
            value={email}
            fullWidth
            required
            variant="outlined"
            margin="normal"
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            fullWidth
            required
            variant="outlined"
            margin="normal"
            onChange={e => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2, py: 1.5, fontWeight: 'bold', letterSpacing: 1 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
          </Button>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </form>
      </Paper>
    </Box>
  );
}

export default Login;
