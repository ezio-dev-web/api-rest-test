import axios from "axios"
import { validationResult, body, param } from "express-validator"

export const validationResultExpress = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  next()
}

export const paramLinkValidator = [
  param("id", "Formato no valido (expressValidator)")
    .trim()
    .notEmpty()
    .escape() // Cambia los caracteres del code JS injectado
    ,validationResultExpress
]

export const bodyLinkValidator = [
  body("longLink", "formato link incorrecto")
    .trim()
    .notEmpty()
    .custom(async value => {
        try {
            if(!value.startsWith("https://")) {
              value = "https://" + value;
            }

            await axios.get(value)
            return value
        } catch (error) {
            //console.log(error)
            throw new Error('Not found longlink 404')
        }
    })
  ,validationResultExpress
]

export const bodyRegisterValidator = [
  body('email', 'Formato de email incorrecto')
    .trim()
    .isEmail()
    .normalizeEmail(),

  body('password', 'Minimo 6 caracteres')
    .trim()
    .isLength({min: 6}),

  body('password', 'Formato de password incorrecto')
    .custom((value, { req }) => {
        if (value !== req.body.repassword) {
              throw new Error('No coinciden las password')
        }
        return value
    }),
    validationResultExpress
]

export const bodyLoginValidator = [
  body('email', 'Formato de email incorrecto')
    .trim()
    .isEmail()
    .normalizeEmail(),

  body('password', 'Minimo 6 caracteres')
    .trim()
    .isLength({min: 6}),

    validationResultExpress
]