import Utils from '../../utils'
import { apiSuccessMessage, httpConstants } from '../../common/constants'
import BLManager from './manager'

export default class Index {
    async createNftCollection (request, response) {
        console.log('Inside createNftCollection', request.body, 'createToken', 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().createNftCollection(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.SAVED_AS_DRAFT, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async findToken (request, response) {
        console.log('Inside createNftCollection', request.body, 'createToken', 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().findToken(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.SAVED_AS_DRAFT, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async updateToken721 (request, response) {
        console.log('Inside createNftCollection', request.body, 'createToken', 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().updateToken721(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.SAVED_AS_DRAFT, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async createrNFT (request, response) {
        console.log('Inside createNftCollection', request.body, 'createToken', 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().createrNFT(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.SAVED_AS_DRAFT, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }
    async updateNft (request, response) {
        console.log('Inside createNftCollection', request.body, 'createToken', 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().updateNft(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.SAVED_AS_DRAFT, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

}
