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
  console.log('📦 Transaction Data Diterima:', JSON.stringify(req.body, null, 2));
  console.log('MIDTRANS SERVER KEY:', process.env.MIDTRANS_SERVER_KEY ? 'Loaded' : 'Missing');

  // Use sandbox URL if MIDTRANS_SANDBOX is set to true
  const baseUrl = process.env.MIDTRANS_SANDBOX === 'true' ? 'https://app.sandbox.midtrans.com' : 'https://app.midtrans.com';
  const url = `${baseUrl}/snap/v1/transactions`;

  console.log('Using Midtrans URL:', url);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':').toString('base64')
      },
      body: JSON.stringify(req.body)
    });

    const result = await response.json();
    console.log('📩 Midtrans Response Status:', response.status);
    console.log('📩 Midtrans Raw Response:', JSON.stringify(result, null, 2));

    if (response.ok && result.token) {
      res.json({ token: result.token });
    } else {
      console.error('Midtrans Error:', result);
      res.status(response.status).json({ error: result });
    }
  } catch (error) {
    console.error('Error getting snap token:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Local dev server running on http://localhost:${PORT}`);
});
