const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User } = require('../Models');

router.post('/', async (req, res) => {
  const saltRounds = 10;
  const body = req.body;
  const hashedPassword = await bcrypt.hash(body.password, saltRounds);

  const user = await User.create({ ...body, password: hashedPassword });
  res.status(200).json(user);
});

router.get('/', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

module.exports = router;