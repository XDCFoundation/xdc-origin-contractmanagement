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
      isPausable: yup.boolean().required(),
      isBurnable: yup.boolean().required(),
      isMintable: yup.boolean().required(),
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

  validateGetXrc20TokenById: async (req, res, next) => {
    const schema = yup.object().shape({
      id: yup.number().required(),
    })
    await validate(schema, req.body, res, next)
  },

  validateVerifyXrc20Token: async (req, res, next) => {
    const schema = yup.object().shape({
      tokenId: yup.number().required(),
      contractAddress: yup.string().required(),
    })
    await validate(schema, req.body, res, next)
  },

  validateMintBurnXrc20Token: async (req, res, next) => {
    const schema = yup.object().shape({
      tokenOwner: yup.string().required(),
      tokenId: yup.number().required(),
      operation: yup.string().required(),
      mintedTokens: yup.number().required(),
      burntTokens: yup.number().required(),
      network: yup.string().required(),
    })
    await validate(schema, req.body, res, next)
  },

  validatePauseResumeXrc20Token: async (req, res, next) => {
    const schema = yup.object().shape({
      tokenOwner: yup.string().required(),
      tokenId: yup.number().required(),
      smartContractAddress: yup.string().required(),
      pause: yup.boolean().required(),
      network: yup.string().required()
    })
    await validate(schema, req.body, res, next)
  },

  validateTransferOwnershipXrc20Token: async (req, res, next) => {
    const schema = yup.object().shape({
      tokenOwner: yup.string().required(),
      tokenId: yup.number().required(),
      smartContractAddress: yup.string().required(),
      newTokenOwner: yup.string().required(),
      network: yup.string().required()
    })
    await validate(schema, req.body, res, next)
  },

  validateUpdateSocialMediaUrls: async (req, res, next) => {
    const schema = yup.object().shape({
      tokenOwner: yup.string().required(),
      tokenId: yup.number().required(),
      smartContractAddress: yup.string().required(),
      network: yup.string().required()
    })
    await validate(schema, req.body, res, next)
  },


  validateCreateNftCollection: async (req, res, next) => {
    const schema = yup.object().shape({
      tokenName: yup.string().required(),
      tokenImage: yup.string().required(),
      tokenSymbol: yup.string().required(),
      tokenOwner: yup.string().required(),
      tokenDescription: yup.string().required(),
      network: yup.string().required()
    })
    await validate(schema, req.body, res, next)
  }, 

  validateUpdateToken721: async (req, res, next) => {
    const schema = yup.object().shape({
      smartContractAddress: yup.string().required(),
      tokenOwner: yup.string().required(),
      id: yup.number().required(),
      status:yup.string().required(),
    })
    await validate(schema, req.body, res, next)
  },

  validateCreaterNFT: async (req, res, next) => {
    const schema = yup.object().shape({
      collectionId:yup.number().required(),
      nftDescription: yup.string().required(),
      nftOwner: yup.string().required(),
      nftName: yup.string().required(),
      ipfsUrl: yup.string().required(),
      network: yup.string().required()
    })
    await validate(schema, req.body, res, next)
  },

  validateUpdateNft: async (req, res, next) => {
    const schema = yup.object().shape({
      nftTokenId: yup.string().required(),
      nftOwner: yup.string().required(),
      status:yup.string().required(),
      collectionId: yup.number().required(),
      id:yup.number().required()
    })
    await validate(schema, req.body, res, next)
  },

  validateFind721TokenAndNft: async (req, res, next) => {
    const schema = yup.object().shape({
      id: yup.number().required() 
    })
    await validate(schema, req.body, res, next)
  },

  validateFindNft: async (req, res, next) => {
    const schema = yup.object().shape({
      nftTokenId: yup.string().required(), 
      collectionId:yup.number().required() ,
      id:yup.number().required() 
    })
    await validate(schema, req.body, res, next)
  },

  validateDeletingNft: async (req, res, next) => {
    const schema = yup.object().shape({
      nftTokenId: yup.string().required(), 
      id:yup.number().required()
    })
    await validate(schema, req.body, res, next)
  },


  validateNftTransfer: async (req, res, next) => {
    const schema = yup.object().shape({
      nftTokenId: yup.string().required(),
      id:yup.number().required(),
      to:yup.string().required(),
      from:yup.string().required(),
      when:yup.string().required(),
      nftTokenId:yup.number().required(),
    })
    await validate(schema, req.body, res, next)
  },

  validateXrcTokenByOwner: async (req, res, next) => {
    const schema = yup.object().shape({
      tokenOwner: yup.string().required(),
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
