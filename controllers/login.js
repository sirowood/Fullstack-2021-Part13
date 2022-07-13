const router = require('express').Router();

const { SECRET } = require('../util/config');
const { User, Session } = require('../Models');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
  const body = req.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    }
  });

  const passwordCorrect = await bcrypt.compare(body.password, user.password);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    });
  };

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  await Session.create({ token });

  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = router;