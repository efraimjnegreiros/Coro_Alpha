// server.js
const express = require('express');
const app = express();
const cors = require('cors');
const sequelize = require('./config/database');
const ensaioRoutes = require('./routes/ensaio.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const presencasRouter = require('./routes/presenca.routes');

app.use(cors());
app.use(express.json());
app.use('/api/ensaios', ensaioRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/presencas', presencasRouter);


// Sincronizar banco e iniciar servidor
sequelize.sync({ alter: true, force: true })
  .then(() => {
    console.log('Banco sincronizado');
    app.listen(3000, () => {
      console.log('Servidor rodando na porta 3000');
    });
  })
  .catch((err) => console.error('Erro ao sincronizar banco:', err));
