import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

function Ia({ usuario }) {
  // Esto previene el error si usuario no existe
  if (!usuario) usuario = { rol: "admin" };
    
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);

  // Esta función manda el mensaje al backend y actualiza el chat
  const handleSend = async () => {
    if (!input.trim()) return;
    setChat(c => [...c, { from: 'user', text: input }]);
    try {
      const response = await fetch('http://localhost:3001/api/ia/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          rol: usuario.rol,
          nombre: usuario.nombre,
          email: usuario.email,
          token: localStorage.getItem('token')
        })
      });
      const data = await response.json();
      setChat(c => [...c, { from: 'ia', text: data.answer }]);
    } catch (error) {
      setChat(c => [...c, { from: 'ia', text: 'No se pudo contactar con la IA.' }]);
    }
    setInput('');
  };


  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Chat IA GEMPROTEC</Typography>
        <Box sx={{ minHeight: 240, mb: 2 }}>
          {chat.map((msg, idx) => (
            <Typography key={idx}
                        align={msg.from === 'user' ? 'right' : 'left'}
                        sx={{
                          my: 1,
                          fontWeight: msg.from === 'ia' ? 'bold' : 'normal',
                          bgcolor: msg.from === 'ia' ? "#f0f3fc" : "#e5e7eb",
                          p: 1,
                          borderRadius: 2
                        }}>
              {msg.text}
            </Typography>
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            value={input}
            onChange={e => setInput(e.target.value)}
            label="Escribe tu consulta..."
          />
          <Button variant="contained" onClick={handleSend}>Enviar</Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Ia;
