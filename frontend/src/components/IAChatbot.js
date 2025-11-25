import React, { useState } from 'react';
import { Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

const IAChatbot = ({ usuario }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setChat([...chat, { from: 'user', text: input }]);
    setLoading(true);
    try {
      const response = await fetch('/api/ia', {
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
      setChat([...chat, { from: 'user', text: input }, { from: 'ia', text: data.answer }]);
    } catch (error) {
      setChat([...chat, { from: 'user', text: input }, { from: 'ia', text: 'Error llamando a la IA.' }]);
    }
    setInput('');
    setLoading(false);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chatbot"
        onClick={() => setOpen(true)}
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 2000 }}
      >
        <ChatIcon />
      </Fab>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Asistente Virtual IA GEMPROTEC</DialogTitle>
        <DialogContent>
          <div style={{ minHeight: 220, maxHeight: 400, overflowY: 'auto' }}>
            {chat.map((line, idx) => (
              <div key={idx} style={{
                textAlign: line.from === 'user' ? 'right' : 'left',
                margin: '6px 0', fontSize: 16
              }}>
                <b>{line.from === 'user' ? usuario.nombre || "Tú" : "GEMPROTEC IA"}:</b> {line.text}
              </div>
            ))}
            {loading && <CircularProgress size={24} color="primary" />}
          </div>
        </DialogContent>
        <DialogActions>
          <TextField
            variant="outlined"
            fullWidth
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Escribe tu consulta..."
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            disabled={loading}
          />
          <Button variant="contained" color="primary" onClick={handleSend} disabled={!input.trim() || loading}>
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IAChatbot;
