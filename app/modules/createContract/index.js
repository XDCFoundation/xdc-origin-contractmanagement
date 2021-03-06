import Utils from '../../utils'
import { apiSuccessMessage, httpConstants } from '../../common/constants'
import BLManager from './manager'

export default class Index {
    async saveXrc20TokenAsDraft (request, response) {
        console.log('Inside saveXrc20TokenAsDraft', request.body, 'createToken', 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().checkExistingTokens(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.SAVED_AS_DRAFT, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async updateXRC20Token (request, response) {
        console.log('Inside updateXRC20Token', request.body, 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().updateXRC20Token(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.TOKEN_DETAILS_UPDATED, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async getDraftXRC20Token (request, response) {
        console.log('Inside getDraftXRC20Token', request.body, 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().getDraftXRC20Token(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.TOKEN_DETAILS_FETCHED, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async deleteXrc20Token (request, response) {
        console.log('Inside deleteXrc20Token', request.params, 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().deleteXrc20Token(request.params))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.TOKEN_DELETED, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async getXrc20TokenById (request, response) {
        console.log('Inside getXrc20TokenById', request.body, 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().getXrc20TokenById(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async verifyXrc20Token (request, response) {
        console.log('Inside verifyXrc20Token', request.body, 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().verifyXrc20Token(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async getDeployedXRC20Token (request, response) {
        console.log('Inside getDeployedXRC20Token', request.body, 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().getDeployedXRC20Token(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.TOKEN_DETAILS_FETCHED, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async mintBurnXrc20Token (request, response) {
        console.log('Inside mintBurnXrc20Token', request.body, 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().mintBurnXrc20Token(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.DETAILS_SAVED_SUCCESSFULLY, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async pauseResumeXrc20Token(request, response) {
        console.log('Inside pauseResumeXrc20Token', request.body, 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().pauseResumeXrc20Token(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.DETAILS_SAVED_SUCCESSFULLY, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async transferOwnershipXrc20Token(request, response) {
        console.log('Inside transferOwnershipXrc20Token', request.body, 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().transferOwnershipXrc20Token(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.DETAILS_SAVED_SUCCESSFULLY, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async updateSocialMediaUrls(request, response) {
        console.log('Inside updateSocialMediaUrls', request.body, 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().updateSocialMediaUrls(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.DETAILS_SAVED_SUCCESSFULLY, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async createNftCollection (request, response) {
        console.log('Inside createNftCollection', request.body, 'createToken', 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().createNftCollection(request.body))
        if (!getMetersRes) { return Utils.handleError(error, request, response) }
        return Utils.response(response, getMetersRes, apiSuccessMessage.SAVED_AS_DRAFT, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }
}
