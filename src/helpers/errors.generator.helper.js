export const generateResponseError = (res , status, message, details) => {
  return res.status(status).json({
    type: status<500 ? 'ERROR' : 'FATAL',
    message,
    details
  });
}