const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');

const errorHandler = async (error, req, res, next) => {
  console.log(error.message);
  const status = error.status || 400;
  
  if (error.name === 'SequelizeValidationError') {
    return res.status(status).json({ error: error.errors.map(e => e.message) });
  };
  res.status(status).send(error.message);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
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
