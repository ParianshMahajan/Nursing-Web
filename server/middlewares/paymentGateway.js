const checksum = require('./checksum'); // You need to implement checksum.js

app.post('/initiatePayment', (req, res) => {
  // Implement logic to initiate payment and generate order id
  const orderId = 'YOUR_ORDER_ID';
  const params = {
    MID: 'YOUR_MERCHANT_ID',
    WEBSITE: 'YOUR_WEBSITE',
    CHANNEL_ID: 'WEB',
    INDUSTRY_TYPE_ID: 'Retail',
    ORDER_ID: orderId,
    CUST_ID: 'customer123',
    TXN_AMOUNT: '1.00',
    CALLBACK_URL: 'http://your-callback-url.com/callback',
  };

  const checksumHash = checksum.generateChecksum(params, 'YOUR_MERCHANT_KEY');
  params.CHECKSUMHASH = checksumHash;

  res.json(params);
});

app.post('/callback', (req, res) => {
  // Implement logic to handle payment callback
  const responseData = req.body;
  const isValidChecksum = checksum.verifyChecksum(responseData, 'YOUR_MERCHANT_KEY');

  if (isValidChecksum) {
    // Payment successful, handle accordingly
    console.log('Payment successful');
  } else {
    // Payment failed, handle accordingly
    console.log('Payment failed');
  }

  res.send('Callback received');
});
