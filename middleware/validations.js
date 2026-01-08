const validations = {
    alpha: (paramName) => {
        return (req, res, next) => {
            const value = req.params[paramName];
            if (!/^[a-zA-Z]+$/.test(value)) {
                return res.status(404).send('404 NOT FOUND - Solo letras permitidas');
            }
            next();
        };
    },
    
    alphaNumeric: (paramName) => {
        return (req, res, next) => {
            const value = req.params[paramName];
            if (!/^[a-zA-Z0-9]+$/.test(value)) {
                return res.status(404).send('404 NOT FOUND - Solo letras y números');
            }
            next();
        };
    },
    
    numeric: (paramName) => {
        return (req, res, next) => {
            const value = req.params[paramName];
            if (!/^[0-9]+$/.test(value)) {
                return res.status(404).send('404 NOT FOUND - Solo números');
            }
            next();
        };
    },
    
    whereIn: (paramName, allowedValues) => {
        return (req, res, next) => {
            const value = req.params[paramName];
            if (!allowedValues.includes(value)) {
                return res.status(404).send(`404 NOT FOUND - Valores: ${allowedValues.join(', ')}`);
            }
            next();
        };
    }
};

module.exports = { validations };