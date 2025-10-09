require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML files explicitly
app.get(/\.html$/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', req.path));
});

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for Midtrans snap token
app.post('/api/get-snap-token', async (req, res) => {
  console.log('📦 Transaction Data Diterima:', req.body);
  console.log('MIDTRANS SERVER KEY:', process.env.MIDTRANS_SERVER_KEY ? 'Loaded' : 'Missing');

  try {
    const response = await fetch('https://app.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':').toString('base64')
      },
      body: JSON.stringify(req.body)
    });

    const result = await response.json();
    console.log('📩 Midtrans Raw Response:', result);

    if (result.token) {
      res.json({ token: result.token });
    } else {
      res.status(400).json({ error: result });
    }
  } catch (error) {
    console.error('Error getting snap token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Local dev server running on http://localhost:${PORT}`);
});
