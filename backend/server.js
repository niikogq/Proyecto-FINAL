const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://ngalloquinchen_db_user:yFxczgvDPMpDZ5Qm@gemprotec.bqxbwht.mongodb.net/?appName=GEMPROTEC';
const app = express();

// Rutas principales (asegúrate que las rutas son correctas)
const mainRoutes = require('./src/routes/mainRoutes');
const workorderRoutes = require('./src/routes/workorders');
const usersRouter = require('./src/routes/users');
const reportesRouter = require('./src/routes/reportes');
const dashboardRouter = require('./src/routes/dashboard');


const allowedOrigins = ['http://localhost:3000'];
app.use(cors({ origin: allowedOrigins, credentials: true}));

app.use(express.json());

app.use('/api', mainRoutes);
app.use('/api/workorders', workorderRoutes);
app.use('/api/users', usersRouter);
app.use('/api', reportesRouter);
app.use('/api/notifications', require('./src/routes/notifications'));
app.use('/api/dashboard', dashboardRouter);
app.use('/api/ia', require('./src/routes/ia'));
app.use('/api/user', require('./src/routes/user'));


mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(err => console.error('Error conectando a MongoDB:', err));

app.listen(3001, () => {
  console.log('Servidor backend escuchando en puerto 3001');
});

