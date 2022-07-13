const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');

const { Session } = require('../models');

const errorHandler = async (error, req, res, next) => {
  console.log(error.message);
  const status = error.status || 400;
  
  if (error.name === 'SequelizeValidationError') {
    return res.status(status).json({ error: error.errors.map(e => e.message) });
  };
  res.status(status).send(error.message);
};

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);
    const session = await Session.findOne({
      where: {
        token: token
      },
    });

    if (!session) {
      return res.status(401).json({ error: 'token expired' });
    };

    try {
      req.decodedToken = jwt.verify(token, SECRET);
    } catch {
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  };

  next();
};

module.exports = {
  errorHandler,
  tokenExtractor
};
