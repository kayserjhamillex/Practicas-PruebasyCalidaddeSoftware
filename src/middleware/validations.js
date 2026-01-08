const validations = {
  alpha: (paramName) => (req, res, next) => {
    const value = req.params[paramName];
    if (!/^[a-zA-Z]+$/.test(value)) return res.status(404).send('404 NOT FOUND');
    next();
  },

  alphaNumeric: (paramName) => (req, res, next) => {
    const value = req.params[paramName];
    if (!/^[a-zA-Z0-9]+$/.test(value)) return res.status(404).send('404 NOT FOUND');
    next();
  },

  numeric: (paramName) => (req, res, next) => {
    const value = req.params[paramName];
    if (!/^[0-9]+$/.test(value)) return res.status(404).send('404 NOT FOUND');
    next();
  },

  whereIn: (paramName, allowedValues) => (req, res, next) => {
    const value = req.params[paramName];
    if (!allowedValues.includes(value)) return res.status(404).send('404 NOT FOUND');
    next();
  }
};

module.exports = { validations };