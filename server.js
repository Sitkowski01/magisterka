// server.js
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

// Połączenie do MongoDB (adres i baza)
const url = 'mongodb://localhost:27017';
const dbName = 'Szpital';

let db;

// 1) Łączymy się z MongoDB i startujemy serwer
MongoClient.connect(url)
  .then(client => {
    db = client.db(dbName);
    console.log('Połączono z MongoDB, baza:', dbName);

    // Uruchamiamy serwer na porcie 3000
    app.listen(3000, () => {
      console.log('Serwer działa na http://localhost:3000');
    });
  })
  .catch(err => console.error('Błąd połączenia z MongoDB:', err));

// 2) Endpoint z chorobami (kolekcja "choroby")
app.get('/api/diseases', async (req, res) => {
  try {
    const data = await db.collection('choroby').find().toArray();
    res.json(data);
  } catch (err) {
    console.error('Błąd /api/diseases:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 3) Endpoint z danymi treningowymi (kolekcja "pacjenci2")
app.get('/api/trainingData', async (req, res) => {
  try {
    const data = await db.collection('pacjenci2').find().toArray();
    res.json(data);
  } catch (err) {
    console.error('Błąd /api/trainingData:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
