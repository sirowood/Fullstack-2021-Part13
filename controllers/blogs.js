const router = require('express').Router();

const { Blog, User } = require('../Models');
const { Op } = require('sequelize');
const { tokenExtractor } = require('../util/middlewares');

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get('/', async (req, res) => {
  let where = {};

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: { [Op.iLike]: `%${req.query.search}%` },
        },
        {
          author: { [Op.iLike]: `%${req.query.search}%` },
        },
      ],
    };
  };
  const blogs = await Blog.findAll({
    order: [
      ['likes', 'DESC']
    ],
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    },
    where,
  });
  res.json(blogs);
});

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.create({ ...req.body, userId: user.id });
    res.json(blog);
  } catch (error) {
    next(error)
  }
});

router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.json(req.blog);
  } catch (error) {
    next(error)
  };
});

router.delete('/:id', tokenExtractor, blogFinder, async (req, res, next) => {
  try {
    if (req.decodedToken.id !== req.blog.userId) {
      return res.status(403).json({ error: 'action not allowed' });
    };
    await req.blog.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  };
});

module.exports = router;