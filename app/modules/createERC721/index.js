import Utils from '../../utils'
import { apiSuccessMessage, httpConstants } from '../../common/constants'
import BLManager from './manager'

export default class Index {
    async createNftCollection (request, response) {
        console.log('Inside createNftCollection', request.body, 'createToken', 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().checkExistingTokens(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.SAVED_AS_DRAFT, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async find721TokenAndNft (request, response) {
        console.log('Inside find721TokenAndNft', request.body, 'createToken', 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().find721TokenAndNft(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async updateToken721 (request, response) {
        console.log('Inside updateToken721', request.body, 'createToken', 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().updateToken721(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.DETAILS_SAVED_SUCCESSFULLY, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async createrNFT (request, response) {
        console.log('Inside createrNFT', request.body, 'createToken', 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().createrNFT(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.SAVED_AS_DRAFT, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }
    async updateNft (request, response) {
        console.log('Inside updateNft', request.body, 'createToken', 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().updateNft(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.DETAILS_SAVED_SUCCESSFULLY, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async findNft (request, response) {
        console.log('Inside findNft', request.body, 'createToken', 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().findNft(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async deletingNft (request, response) {
        console.log('Inside deletingNft', request.body, 'createToken', 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().deletingNft(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.TOKEN_DELETED, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async nftTransfer (request, response) {
        console.log('Inside nftTransfer', request.body, 'createToken', 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().nftTransfer(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.DETAILS_SAVED_SUCCESSFULLY, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async xrcTokenByOwner (request, response) {
        console.log('Inside xrcTokenByOwner', request.body, 'createToken', 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().xrcTokenByOwner(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.DETAILS_SAVED_SUCCESSFULLY, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async getDraftedAndFailedTokens (request, response) {
        console.log('Inside getDraftedAndFailedTokens', request.body, 'createToken', 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().getDraftedAndFailedTokens(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.DETAILS_SAVED_SUCCESSFULLY, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }


    async getXRC721AndXRC20TokensByNetwork (request, response) {
        console.log('Inside getXRC721AndXRC20TokensByNetwork', request.body, 'createToken', 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().getXRC721AndXRC20TokensByNetwork(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.DETAILS_SAVED_SUCCESSFULLY, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }


    async getDeployedTokens (request, response) {
        console.log('Inside getDeployedTokens', request.body, 'createToken', 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().getDeployedTokens(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.DETAILS_SAVED_SUCCESSFULLY, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async getIpfsUrl(request, response) {
        try {
          const [error, getIpfsUrlRes] = await Utils.parseResponse(new BLManager().getIpfsUrl(request.file, request.body))
          if (!getIpfsUrlRes) {
            return Utils.handleError(error, request, response)
          }
          return Utils.response(response, getIpfsUrlRes, apiSuccessMessage.ADD_CONTENT_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
        } catch (error) {
          return Utils.handleError(error, request, response)
        }
      }


      async deleteCollection(request, response) {
          console.log('Inside deleteCollection', request.body, 'deleteCollection', 0, '')
          const [error, deleteCollectionRes] = await Utils.parseResponse(new BLManager().deleteCollection(request.body))
          if (!deleteCollectionRes) {
            return Utils.handleError(error, request, response)
          }
          return Utils.response(response, deleteCollectionRes, apiSuccessMessage.TOKEN_DELETED, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
        
      }


    
    

    
}
