const express = require('express');
const router = express.Router();

const foosApi = require('./foos.api');
router.use('/foos', foosApi);

const usersApi = require('./users.api');
router.use('/users', usersApi);

const petitionsApi = require('./petitions.api');
router.use('/petitions', petitionsApi);

const participantsApi = require('./participants.api');
router.use('/participants', participantsApi);

/* Donation request endpoint */
const donationRequestApi = require('./request.api');
router.use('/donation_requests', donationRequestApi);

const itemsApi = require('./items.api');
router.use('/items', itemsApi);

const authApi = require('./auth.api');
router.use('/auth', authApi);

const blogApi = require('./blog.api');
router.use('/blog', blogApi);

module.exports = router;
