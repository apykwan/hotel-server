import express from 'express';

import { 
    createConnectAccount, 
    getAccountStatus, 
    getAccountBalance,
    payoutSetting,
    stripeSession,
    stripeSuccess 
} from '../controllers/stripe';
import { requireSignin } from '../middlewares';

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