const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User, Blog } = require('../Models');

router.post('/', async (req, res, next) => {
  const saltRounds = 10;
  const body = req.body;
  const hashedPassword = await bcrypt.hash(body.password, saltRounds);

  try {
  const user = await User.create({ ...body, password: hashedPassword });
  res.status(200).json(user);
  } catch (error) {
    next(error);
  };
});

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: {
        exclude: ['userId']
      }
    }
  });
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: ['name', 'username'],
    include:{
      model: Blog,
      as: 'readings',
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId'],
      },
      through: {
        attributes: ['read', 'id'],
      },
    },
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  };
});

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    },
  });

  user.username = req.body.username;
  await user.save();

  res.json(user);
});

module.exports = router;