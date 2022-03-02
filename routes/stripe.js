const express = require('express');

const { 
    createConnectAccount, 
    getAccountStatus, 
    getAccountBalance,
    payoutSetting,
    stripeSession,
    stripeSuccess 
} = require('../controllers/stripe');
const { requireSignin } = require('../middlewares');

const router = express.Router();

// route middelware
router.use(requireSignin);
router.post('/create-connect-account', createConnectAccount);
router.post('/get-account-status', getAccountStatus);
router.post('/get-account-balance', getAccountBalance);
router.post('/payout-setting', payoutSetting);
router.post('/stripe-session-id', stripeSession);
// order
router.post('/stripe-success', stripeSuccess);

module.exports = router;