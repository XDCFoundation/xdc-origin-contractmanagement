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

  validateSaveXrc20TokenAsDraft: async (req, res, next) => {
    const schema = yup.object().shape({
      tokenOwner: yup.string().min(8).required(),
      tokenInitialSupply: yup.number().required(),
      tokenName: yup.string().required(),
      tokenSymbol: yup.string().required(),
      tokenImage: yup.string().required(),
      tokenDecimals: yup.number().required(),
      tokenDescription: yup.string().required(),
    })
    await validate(schema, req.body, res, next)
  },

  validateGetDraftXrc20Token: async (req, res, next) => {
    const schema = yup.object().shape({
      tokenOwner: yup.string().required(),
    })
    await validate(schema, req.body, res, next)
  },

  validateUpdateXrc20Token: async (req, res, next) => {
    const schema = yup.object().shape({
      tokenOwner: yup.string().min(8).required(),
      tokenId: yup.number().required(),
    })
    await validate(schema, req.body, res, next)
  },

  validateDeleteXrc20Token: async (req, res, next) => {
    const schema = yup.object().shape({
      id: yup.number().required(),
    })
    await validate(schema, req.params, res, next)
  },
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
