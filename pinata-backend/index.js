require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const FormData = require('form-data');
const mongoose = require('mongoose');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());

mongoose.connect('mongodb://localhost:27017/criptounam', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

const Evento = require('./models/Eventos');
const Curso = require('./models/Curso');

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      maxBodyLength: Infinity,
      headers: {
        ...formData.getHeaders(),
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_API_SECRET
      }
    });

    res.json({ ipfsUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}` });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Endpoint para guardar un evento
app.post('/evento', express.json(), async (req, res) => {
  try {
    const evento = new Evento(req.body);
    await evento.save();
    res.json(evento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener todos los eventos
app.get('/eventos', async (req, res) => {
  const eventos = await Evento.find().sort({ creadoEn: -1 });
  res.json(eventos);
});

// Endpoint para guardar un curso
app.post('/curso', express.json(), async (req, res) => {
  try {
    const curso = new Curso(req.body);
    await curso.save();
    res.json(curso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener todos los cursos
app.get('/cursos', async (req, res) => {
  const cursos = await Curso.find().sort({ creadoEn: -1 });
  res.json(cursos);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend escuchando en puerto ${PORT}`));