const express = require('express');
const cors = require('cors');
require('dotenv').config();
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Serve file statis dari folder "public"
app.use(express.static('public'));

// ✅ Routing ke file utama (index.html atau cart.html)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/cart.html', (req, res) => {
    res.sendFile(__dirname + '/public/cart.html');
});

app.post('/get-snap-token', async (req, res) => {
    console.log('📦 Transaction Data Diterima:', req.body);
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
            res.status(400).json({ error: 'Failed to get snap token' });
        }
    } catch (error) {
        console.error('Error getting snap token:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
