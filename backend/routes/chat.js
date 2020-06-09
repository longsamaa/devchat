const express = require('express');

const {createRoom} = require('../controllers/chat');
const { userById } = require('../controllers/user');
const { requireSignin } = require('../controllers/auth');

const router = express.Router();


router.post('/chat/:userId', requireSignin, createRoom);



// any route containing :userId, our app will first execute userById()
router.param('userId', userById);


module.exports = router;