const express = require('express');

const messageController = require('../controllers/message');
const userAuth = require('../middleware/auth');

const router = express.Router();

router.get('/', userAuth.authenticate, messageController.getMessage);

router.post('/', userAuth.authenticate,  messageController.postMessage);

module.exports=router;