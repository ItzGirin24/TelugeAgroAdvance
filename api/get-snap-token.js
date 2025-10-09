console.log('📦 Transaction Data Diterima:', req.body);

const response = await fetch('https://app.midtrans.com/snap/v1/transactions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':').toString('base64')}`
  },
  body: JSON.stringify({
    transaction_details,
    customer_details,
    item_details
  })
});

const result = await response.json();
console.log('📩 Midtrans Raw Response:', result);

if (result.token) {
  res.status(200).json({ token: result.token });
} else {
  res.status(400).json({ error: result });
}
