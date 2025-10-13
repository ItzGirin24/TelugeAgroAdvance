const express = require('express');
const cors = require('cors');
require('dotenv').config();
const fetch = require('node-fetch');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Firebase Admin using environment variables
let db = null;
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://telugeagro2025.firebaseio.com'
  });
  db = admin.firestore();
} else {
  console.warn('Firebase environment variables not set. Firebase features will not work.');
}

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

app.get('/api/welcome', (req, res) => {
    console.log(`Request received: ${req.method} ${req.path}`);
    res.json({
        message: 'Welcome to the API Service!',
        method: req.method,
        path: req.path
    });
});

app.get('/api/status', (req, res) => {
    console.log(`Request received: ${req.method} ${req.path}`);
    res.json({
        status: 'API is running',
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path
    });
});

app.get('/api/midtrans-transactions', async (req, res) => {
    if (!db) {
        return res.status(500).json({ error: 'Firebase not initialized. Please set Firebase environment variables.' });
    }
    try {
        // Get recent orders from Firestore (last 10)
        const ordersQuery = db.collection('orders').orderBy('timestamp', 'desc').limit(10);
        const ordersSnapshot = await ordersQuery.get();

        const transactions = [];

        // Prepare promises for parallel fetching
        const fetchPromises = ordersSnapshot.docs.map(async (doc) => {
            const order = doc.data();
            const orderId = doc.id;

            try {
                // Fetch transaction status from Midtrans
                const midtransResponse = await fetch(`https://api.midtrans.com/v2/${orderId}/status`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Basic ' + Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':').toString('base64')
                    }
                });

                const midtransData = await midtransResponse.json();

                return {
                    orderId: orderId,
                    customerName: order.customerName || order.name || 'N/A',
                    email: order.email || 'N/A',
                    total: order.total || 0,
                    status: midtransData.transaction_status || 'unknown',
                    paymentType: midtransData.payment_type || 'N/A',
                    transactionTime: midtransData.transaction_time || order.timestamp?.toDate()?.toISOString() || 'N/A',
                    fraudStatus: midtransData.fraud_status || 'N/A'
                };
            } catch (err) {
                console.error(`Error fetching Midtrans data for order ${orderId}:`, err);
                // Return partial data on error
                return {
                    orderId: orderId,
                    customerName: order.customerName || order.name || 'N/A',
                    email: order.email || 'N/A',
                    total: order.total || 0,
                    status: 'error',
                    paymentType: 'N/A',
                    transactionTime: order.timestamp?.toDate()?.toISOString() || 'N/A',
                    fraudStatus: 'N/A'
                };
            }
        });

        // Execute all fetches in parallel
        const results = await Promise.all(fetchPromises);
        transactions.push(...results);

        res.json(transactions);
    } catch (error) {
        console.error('Error fetching Midtrans transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

app.post('/api/get-snap-token', async (req, res) => {
    console.log('📦 Transaction Data Diterima:', JSON.stringify(req.body, null, 2));
    console.log('MIDTRANS SERVER KEY:', process.env.MIDTRANS_SERVER_KEY ? 'Loaded' : 'Missing');
    console.log('MIDTRANS SERVER KEY Value:', process.env.MIDTRANS_SERVER_KEY);

    // Use sandbox URL if MIDTRANS_SANDBOX is set to true
    const baseUrl = process.env.MIDTRANS_SANDBOX === 'true' ? 'https://app.sandbox.midtrans.com' : 'https://app.midtrans.com';
    const url = `${baseUrl}/snap/v1/transactions`;

    console.log('Using Midtrans URL:', url);

    // Create authorization header
    const authString = process.env.MIDTRANS_SERVER_KEY + ':';
    const authBase64 = Buffer.from(authString).toString('base64');
    console.log('Authorization Header:', 'Basic ' + authBase64);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + authBase64
            },
            body: JSON.stringify(req.body)
        });

        const result = await response.json();
        console.log('📩 Midtrans Response Status:', response.status);
        console.log('📩 Midtrans Raw Response:', JSON.stringify(result, null, 2));

        if (response.ok && result.token) {
            res.json({ token: result.token });
        } else {
            console.error('❌ Midtrans API Error:', result);
            console.error('❌ Response Status:', response.status);
            console.error('❌ Error Messages:', result.error_messages);

            // Return user-friendly error message
            const errorMessage = result.error_messages ? result.error_messages.join(', ') : 'Failed to get snap token';
            res.status(response.status).json({
                error: 'Failed to get snap token',
                details: errorMessage,
                status: response.status
            });
        }
    } catch (error) {
        console.error('Error getting snap token:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
