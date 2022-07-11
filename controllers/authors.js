const router = require('express').Router();
const { Blog } = require('../Models');
const { sequelize } = require('../Models/blog');

router.get('/', async (req, res) => {
  const results = await Blog.findAll({
    group: 'author',
    attributes:[
        'author',
        [sequelize.fn('COUNT', sequelize.col('author')), 'articles'],
        [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
      ],
    order: [
      [sequelize.fn('SUM', sequelize.col('likes')), 'DESC']
    ],
  });

  res.json(results);
});

module.exports = router;