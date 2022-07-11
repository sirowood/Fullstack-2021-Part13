const router = require('express').Router();

const { Blog, User } = require('../Models');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');
const { Op } = require('sequelize');

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      res.status(401).json({ error: 'token invalid' });
    }
  } else {
    res.status(401).json({ error: 'token missing' });
  };

  next();
};

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get('/', async (req, res) => {
  const where = {};

  if (req.query.search) {
    where.title = {
      [Op.iLike]: `%${req.query.search}%`,
    };
  };
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    },
    where
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