const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../Controllers/ContactController');

router.post('/send', sendContactEmail);

module.exports = router;
