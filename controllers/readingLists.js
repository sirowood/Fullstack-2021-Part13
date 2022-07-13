const router = require('express').Router();
const { tokenExtractor } = require('../util/middlewares');
const { ReadingList } = require('../models');

router.post('/', async (req, res) => {
  await ReadingList.create({ ...req.body });
  res.status(200).end();
});

router.put('/:id', tokenExtractor, async (req, res) => {
  const userId = req.decodedToken.id;
  const readingListItem = await ReadingList.findByPk(req.params.id);

  if (!readingListItem) {
    return res.status(404).end();
  } else if (userId !== readingListItem.userId) {
    return res.status(403).end({ error: 'You can only update reading list of your own.'});
  };

  readingListItem.read = req.body.read;
  await readingListItem.save();

  res.json(readingListItem);
});

module.exports = router;
