const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllTrains,
  searchTrains,
  getCrowdLevel,
  getLiveTrains 
} = require('../controllers/trainController');

router.get('/', authMiddleware, getAllTrains);
router.get('/search', authMiddleware, searchTrains);
router.get('/live', authMiddleware, getLiveTrains);
router.get('/crowd', getCrowdLevel);

module.exports = router;