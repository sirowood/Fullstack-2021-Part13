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

module.exports = router;