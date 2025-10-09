const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

console.log('MIDTRANS SERVER KEY:', process.env.MIDTRANS_SERVER_KEY ? 'Loaded' : 'Missing');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.path}`);
    next();
});
app.use(express.static('.')); // Serve static files from current directory

// Serve HTML files explicitly
app.get(/\.html$/, (req, res) => {
    const filePath = req.path.slice(1); // remove leading /
    res.sendFile(filePath, { root: __dirname });
});

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

// Endpoint to get Snap token
app.post('/get-snap-token', async (req, res) => {
    console.log('📦 Transaction Data Diterima:', req.body);

    try {
        const response = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':').toString('base64'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        console.log('📩 Midtrans Raw Response:', data);

        if (data.token) {
            res.json({ token: data.token });
        } else {
            res.status(400).json({ error: data.message || 'Failed to get snap token' });
        }
    } catch (err) {
        console.error('❌ Error getting snap token:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
