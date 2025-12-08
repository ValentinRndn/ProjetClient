import Joi from "joi";

/**
 * validate(schema, location = 'body')
 * - schema : Joi schema object OR an object with keys { body, params, query, headers } (Joi schemas)
 * - location : when passing a single schema, choose 'body'|'params'|'query'|'headers'
 *
 * Usage:
 *  - app.post('/x', validate(myJoiSchema), handler)                // validates body
 *  - app.get('/x/:id', validate(myJoiSchema, 'params'), handler)  // validates params
 *  - app.get('/x', validate({ query: qSchema, params: pSchema }), handler)
 */
export default function validate(schema, location = "body") {
  // if schema is an object of schemas (body/params/query/headers)
  const isMulti =
    schema &&
    typeof schema === "object" &&
    (schema.body || schema.params || schema.query || schema.headers);

  return (req, res, next) => {
    try {
      if (isMulti) {
        // validate each present part
        const parts = ["params", "query", "body", "headers"];
        for (const part of parts) {
          if (schema[part]) {
            const { error, value } = schema[part].validate(req[part], {
              abortEarly: false,
              stripUnknown: true,
            });
            if (error) {
              const details = error.details.map((d) => ({
                message: d.message,
                path: d.path,
              }));
              return res
                .status(400)
                .json({
                  success: false,
                  message: "Validation error",
                  errors: details,
                });
            }
            // Dans Express 5, req.query est en lecture seule, on doit utiliser Object.assign ou créer un nouvel objet
            if (part === "query") {
              Object.assign(req.query, value);
            } else {
              req[part] = value;
            }
          }
        }
        return next();
      }

      // single-location mode
      if (!["body", "params", "query", "headers"].includes(location)) {
        throw new Error("validate: unknown location " + location);
      }

      const target = req[location];
      const { error, value } = schema.validate(target, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const details = error.details.map((d) => ({
          message: d.message,
          path: d.path,
        }));
        return res
          .status(400)
          .json({
            success: false,
            message: "Validation error",
            errors: details,
          });
      }

      // Dans Express 5, req.query est en lecture seule, on doit utiliser Object.assign
      if (location === "query") {
        Object.assign(req.query, value);
      } else {
        req[location] = value;
      }
      return next();
    } catch (err) {
      // Unexpected error in validator
      return next(err);
    }
  };
}
