const fetch = require('node-fetch');
require('dotenv').config();
const admin = require('firebase-admin');

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  const serviceAccount = require('../firebase-service-account.json'); // Adjust path if needed
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://telugeagro2025.firebaseio.com'
  });
}
const db = admin.firestore();

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
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

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching Midtrans transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
}
