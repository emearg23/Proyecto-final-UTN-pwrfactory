// Crea un error con código HTTP para que el controlador sepa qué responder
const createError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

module.exports = createError;
