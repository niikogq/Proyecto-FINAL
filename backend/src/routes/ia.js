const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/roles');

// Modular: puedes llamar distintas funciones con funcion: 'analizar_descripcion', etc.
router.post('/consultar', auth, allowRoles('admin', 'supervisor'), async (req, res) => {
  const { funcion, ...params } = req.body;
  const py = spawn('python', ['./src/ia/ia_agent.py']);
  let output = '';
  py.stdin.write(JSON.stringify({ funcion, ...params }));
  py.stdin.end();
  py.stdout.on('data', data => output += data.toString());
  py.stderr.on('data', data => console.error(data.toString()));
  py.on('close', () => {
    try {
      const result = JSON.parse(output);
      res.json(result);
    } catch {
      res.status(500).json({ error: 'Error procesando la IA', details: output });
    }
  });
});

module.exports = router;

