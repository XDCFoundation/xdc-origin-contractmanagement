import Utils from '../app/utils'
import * as yup from 'yup'

module.exports = {
  validateUserLogin: async (req, res, next) => {
    const schema = yup.object().shape({
      email: yup.string().email(),
      password: yup.string().min(8).required()
    })
    await validate(schema, req.body, res, next)
  },

  validateCreateXrc20Token: async (req, res, next) => {
    const schema = yup.object().shape({
      xdcPayAddress: yup.string().min(8).required(),
      gasPrice: yup.string().min(8).required(),
      gas: yup.number().required(),
      tokenName: yup.string().required(),
      tokenSymbol: yup.string().required(),
      tokenImage: yup.string().required(),
      decimals: yup.number().required(),
      description: yup.string().required(),
    })
    await validate(schema, req.body, res, next)
  }
}

const validate = async (schema, reqData, res, next) => {
  try {
    await schema.validate(reqData, { abortEarly: false })
    next()
  } catch (e) {
    const errors = e.inner.map(({ path, message, value }) => ({ path, message, value }))
    Utils.responseForValidation(res, errors)
  }
}
