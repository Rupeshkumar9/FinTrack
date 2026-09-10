const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);
  if (err.code === 'P2002') {
    return res.status(400).json({ message: 'A record with that value already exists' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ message: 'Record not found' });
  }
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
