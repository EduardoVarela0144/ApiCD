const express = require('express');
const router = express.Router();
const nodemailer = require('./Nodemailer'); 

router.post('/send-email', nodemailer.sendEmail); 

module.exports = router;
