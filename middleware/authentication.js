import {apiFailureMessage, contractConstants, httpConstants} from '../app/common/constants'
import HttpService from "../app/service/http-service"
import Utils from "../app/utils";


const validatingUser=async function (requestData, res, next)  {
    console.log(requestData.body,"hello")

    let [error, contractServiceResponse] = await Utils.parseResponse(
        HttpService.executeHTTPRequest(httpConstants.METHOD_TYPE.POST, "http://localhost:3000/authentication-verification", '', requestData.body)
      );

    if(!error){
            if(contractServiceResponse.responseData===httpConstants.JWT_RESPONSE.INVALID_TOKEN){
                res.send(401, "Invalid User");
            }else if(contractServiceResponse.responseData=== httpConstants.JWT_RESPONSE.TOKEN_EXPIRED){
                res.send(401,"Token Expired")
            }else if(contractServiceResponse.responseData=== httpConstants.JWT_RESPONSE.NO_USER_FOUND){
                res.send(401, "Invalid User");
            }else if(contractServiceResponse.responseData==="User Verified"){
                next()
            }      
    }
    

}

module.exports = {
    validatingUser
};