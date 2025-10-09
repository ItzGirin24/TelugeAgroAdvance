const fetch = require('node-fetch');
require('dotenv').config();

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const transactionData = req.body;

    const response = await fetch('https://app.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':').toString('base64')
      },
      body: JSON.stringify(transactionData)
    });

    const result = await response.json();

    if (result.token) {
      res.status(200).json({ token: result.token });
    } else {
      res.status(400).json({ error: 'Failed to get snap token' });
    }
  } catch (error) {
    console.error('Error getting snap token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
