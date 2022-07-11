const errorHandler = async (error, req, res, next) => {
  console.log(error.message);
  const status = error.status || 400;
  
  if (error.name === 'SequelizeValidationError') {
    return res.status(status).json({ error: error.errors.map(e => e.message) });
  };
  res.status(status).send(error.message);
};

module.exports = errorHandler;
