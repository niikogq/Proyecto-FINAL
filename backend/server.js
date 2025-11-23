const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://ngalloquinchen_db_user:yFxczgvDPMpDZ5Qm@gemprotec.bqxbwht.mongodb.net/?appName=GEMPROTEC';
const app = express();
const mainRoutes = require('./src/routes/mainRoutes');  // Este path debe ser correcto
const workorder = require('./src/routes/workorders'); // Este path debe ser correcto
const assetRoutes = require('./src/routes/mainRoutes'); // Nuevo path para las rutas de activos
const usersRouter = require('./src/routes/users'); // Rutas de usuarios
const reportesRouter = require('./src/routes/reportes'); // Rutas de reportes
const Notification = require('./src/models/Notification');

app.use(cors());
app.use(express.json());

app.use('/api', mainRoutes);
app.use('/api/workorders', workorder);
app.use('/api/users', usersRouter);
app.use('/api', require('./src/routes/reportes')); // Rutas de reportes
app.use('/api/notifications', require('./src/routes/notifications'));

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(err => console.error('Error conectando a MongoDB:', err));


app.listen(3001, () => {
  console.log('Servidor backend escuchando en puerto 3001');
});