const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const SECRET = 'mi_secreto_super_seguro'; // ideal en variable de entorno
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/roles');

router.get('/', auth, allowRoles('admin', 'supervisor'), async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Crear usuario (ejemplo simple sin JWT)
router.post('/', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const hashed = await bcrypt.hash(password, 12);
    const user = new User({ nombre, email, password: hashed, rol });
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar todos
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Editar usuario
router.put('/:id', async (req, res) => {
  const { nombre, email, estado, rol } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { nombre, email, estado, rol }, { new: true });
  res.json(user);
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// Login y generación de JWT
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

  // Crear el JWT
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      rol: user.rol
    },
    SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      id: user._id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol
    }
  });
});


router.delete('/:id', auth, allowRoles('admin'), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// Listar todos los usuarios (solo admin y supervisor)



module.exports = router;