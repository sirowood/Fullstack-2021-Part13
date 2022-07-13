const router = require('express').Router();

const { ReadingList } = require('../models');

router.post('/', async (req, res) => {
  await ReadingList.create({ ...req.body });
  res.status(200).end();
});

module.exports = router;
