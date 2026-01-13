/**
 * Middleware de validaciones tipo Laravel para Express
 */

const validations = {
  // Valida que el parámetro contenga solo letras
  alpha: (paramName) => {
    return (req, res, next) => {
      const value = req.params[paramName];
      if (value && !/^[A-Za-z]+$/.test(value)) {
        return res.status(400).send(`El parámetro '${paramName}' debe contener solo letras`);
      }
      next();
    };
  },

  // Valida que el parámetro contenga solo letras y números
  alphaNumeric: (paramName) => {
    return (req, res, next) => {
      const value = req.params[paramName];
      if (value && !/^[A-Za-z0-9]+$/.test(value)) {
        return res.status(400).send(`El parámetro '${paramName}' debe ser alfanumérico`);
      }
      next();
    };
  },

  // Valida que el parámetro contenga solo números
  numeric: (paramName) => {
    return (req, res, next) => {
      const value = req.params[paramName];
      if (value && !/^[0-9]+$/.test(value)) {
        return res.status(400).send(`El parámetro '${paramName}' debe ser numérico`);
      }
      next();
    };
  },

  // Valida que el parámetro esté dentro de un array de valores permitidos
  whereIn: (paramName, allowedValues) => {
    return (req, res, next) => {
      const value = req.params[paramName];
      if (value && !allowedValues.includes(value)) {
        return res.status(400).send(
          `El parámetro '${paramName}' debe ser uno de: ${allowedValues.join(', ')}`
        );
      }
      next();
    };
  }
};

module.exports = { validations };