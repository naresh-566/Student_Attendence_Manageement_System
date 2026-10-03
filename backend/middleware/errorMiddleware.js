/**
 * AttendEase - Centralized Error Handling Middleware
 * Demonstrates: Node.js / Express Error Middleware Pattern
 */

// 404 Route Not Found Handler
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: [${req.method}] ${req.originalUrl}`
  });
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Server Error:', err);

  // Handle SQLite / MySQL duplicate key errors nicely
  if (err.code === 'ER_DUP_ENTRY' || (err.message && err.message.includes('UNIQUE constraint failed'))) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry detected. A record with identical unique details already exists.'
    });
  }

  // Handle foreign key constraint failure
  if (err.code === 'ER_NO_REFERENCED_ROW_2' || (err.message && err.message.includes('FOREIGN KEY constraint failed'))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid foreign reference. Associated record does not exist.'
    });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server processing error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
