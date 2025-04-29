const { z } = require("zod")

// User validation schema
const userValidationSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  email: z.string().email(),
  role: z.enum(["admin", "user"]).optional(),
})

// Order validation schema
const orderValidationSchema = z.object({
  school_id: z.string(),
  amount: z.number().positive(),
})


// Validation middleware
const validateRequest =
  (schema, property = "body") =>
  (req, res, next) => {
    try {
      // Validate request data based on the specified property (body, query, params)
      const result = schema.parse(req[property])

      // If validation is for query or params, update the request object with parsed values
      if (property === "query" || property === "params") {
        req[property] = result
      }

      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors,
        })
      }
      next(error)
    }
  }

module.exports = {
  userValidationSchema,
  orderValidationSchema,
  validateRequest,
}
