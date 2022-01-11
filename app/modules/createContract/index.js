import Utils from '../../utils'
import { apiSuccessMessage, httpConstants } from '../../common/constants'
import BLManager from './manager'

export default class Index {
    async saveXrc20TokenAsDraft (request, response) {
        console.log('Inside saveXrc20TokenAsDraft', request.body, 'createToken', 0, '')
        const [error, getMetersRes] = await Utils.parseResponse(new BLManager().saveXrc20TokenAsDraft(request.body))
        console.log("getMetersRes ====", getMetersRes);
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
}
