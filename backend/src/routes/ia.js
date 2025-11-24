const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/chat', async (req, res) => {
  const { message, rol } = req.body;
  console.log("Mensaje recibido en /chat:", { message, rol });
  try {
    const response = await axios.post('http://localhost:5000/api/ia', { message, rol });
    console.log("Respuesta de Flask:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error llamando a Python IA:", error.message);
    if (error.response) {
      console.error("Detalles:", error.response.data || error.response.status);
    }
    res.status(500).json({ error: 'Error en IA Python' });
  }
});

module.exports = router;
