const router = require('express').Router();

const { Session } = require('../models');

router.delete('/', async (req, res) => {
  const token = req.get('authorization')?.substring(7);
  
  const session = await Session.findOne({
    where: {
      token: token,
    },
  });

  if (session) {
    await session.destroy();
    res.status(200).end();
  } else {
    res.status(404).end();
  };
});

module.exports = router;