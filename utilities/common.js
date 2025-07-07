export const generateError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = 404;

  return error
}