const express = require('express');
const router = express.Router();

const trade = require('../models/trade.js');

router.post('/funds',
    (req, res, next) => trade.checkToken(req, res, next),
    (req, res) => trade.getFunds(res, req.body)
);

router.put('/deposit',
    (req, res, next) => trade.checkToken(req, res, next),
    (req, res) => trade.addMoney(res, req.body)
);

router.post('/buy',
    (req, res, next) => trade.checkToken(req, res, next),
    (req, res) => trade.buyMetals(res, req.body)
);

router.post('/buyhistory',
    (req, res, next) => trade.checkToken(req, res, next),
    (req, res) => trade.getBuyHistory(res, req.body)
);

router.post('/sell',
    (req, res, next) => trade.checkToken(req, res, next),
    (req, res) => trade.sellMetals(res, req.body)
);

router.post('/sellhistory',
    (req, res, next) => trade.checkToken(req, res, next),
    (req, res) => trade.getSellHistory(res, req.body)
);

router.post('/mymetals',
    (req, res, next) => trade.checkToken(req, res, next),
    (req, res) => trade.getComSum(res, req.body)
);

// router.get('/sellhistory', (req, res) => trade.getSellHistory(res, req.body));

// router.post('/sell', (req, res) => res.send('FITTTA'));

module.exports = router;
