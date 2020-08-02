'use strict';

const fs = require('fs'),
	Ajv = require('ajv'),
	basename = require('path').basename(__filename);
const validator = Ajv({allErrors: true, removeAdditional: "all", $data: true});



fs.
readdirSync('./config/validation').
filter(file => {
	return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-7) === '.v.json');
}).
forEach(file => {
	const schema_name = file.slice(0, -7);
	validator.addSchema(require('../../config/validation/'+file), schema_name);
});

/**
 * Format error responses
 * @param  {Object} schema_errors - array of json-schema errors, describing each validation failure
 * @return {Object} formatted api response
 */
const error_response = (schema_errors) => {
	const errors = schema_errors.map(error => {
		return {
			name: 'ValidationError',
			message: error.dataPath + ' ' + error.message
		}
	});
	return {
		errors: errors
	}
};

/**
 * Validates incoming request bodies against the given schema,
 * providing an error response when validation fails
 * @param  {String} schemaName - name of the schema to validate
 * @return {Object} response
 */
module.exports = schemaName => async (req, res, next) => {
	const schema = validator.getSchema(schemaName);
	const validationData = {
		body: req.body,
		query: req.query,
		params: req.params
	}
	if (schema.$async) {
    try {
			if (res.locals.userId) validationData.userId = res.locals.userId;
      await validator.validate(schemaName, validationData)
    } catch (err) {
      if (!(err instanceof Ajv.ValidationError)) throw err;
      return res.status(400).json(error_response(err.errors)).end();
    }
  } else {
    const valid = validator.validate(schemaName, validationData);
		if (!valid) return res.status(400).json(error_response(validator.errors)).end();
  }
  return next();
};
