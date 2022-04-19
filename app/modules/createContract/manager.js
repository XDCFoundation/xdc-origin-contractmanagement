import {Op} from "sequelize";

const db = require('../../../database/models/index');
const XRC20Token = db.XRC20Token;
import solc from 'solc';
import fileReader from "../fileReader/index"
import ejs from "ejs";
import {apiFailureMessage, contractConstants, httpConstants} from '../../common/constants'
import Utils from "../../utils";
import HttpService from "../../service/http-service";
import * as UploadFileManager from "../../../middleware/uploadFiles"
// import WebSocketService from '../../service/WebsocketService';
import Config from "../../../config"
import AWS from 'aws-sdk'
import fs from 'fs';
const path = require('path')

export default class Manager {
    saveXrc20TokenAsDraft = async (requestData) => {
        // API business logic

        try {
            let Roles = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/Roles.sol');
            let ERC20 = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/ERC20.sol');
            let ERC20Detailed = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/ERC20Detailed.sol');
            let IERC20 = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/IERC20.sol');
            let Ownable = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/Ownable.sol');
            let SafeERC20 = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/SafeERC20.sol');
            let SafeMath = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/SafeMath.sol');
            let SignerRole = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/SignerRole.sol');
            let isPausable = requestData.isPausable;
            let isBurnable = requestData.isBurnable;
            let isMintable = requestData.isMintable;
            let isUpgradeable = false;
            let ERC20CappedSign = "";

            let ERC20Burnable;
            let Pausable;
            let PauserRole;
            let ERC20Pausable;
            let MinterRole;
            let ERC20Capped;
            let ERC20Mintable;
            let CapperRole;
            let Upgradable;

            let contractAbi = [];

            let inherits = "";

            let decimalInZero = "";

            let byteCode = "";

            let tokenContractCode = '';
            for (let index = 0; index < requestData.tokenDecimals; index++) {
                decimalInZero += '0';
            }

            if (isBurnable) {
                ERC20Burnable = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/ERC20Burnable.sol');
                inherits += ", ERC20Burnable";
            }
            if (isPausable) {
                Pausable = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/Pausable.sol');
                PauserRole = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/PauserRole.sol');
                ERC20Pausable = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/ERC20Pausable.sol');
                inherits += " , ERC20Pausable";
            }
            if (isMintable) {
                MinterRole = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/MinterRole.sol');
                ERC20Capped = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/ERC20Capped.sol');
                ERC20Mintable = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/ERC20Mintable.sol');
                CapperRole = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/CapperRole.sol');
                const amnt_cap = requestData.tokenInitialSupply * 10; //1000 * 10; //parseFloat(parseFloat(req.body.token_supply)  * 10);
                ERC20CappedSign = "ERC20Capped(" + amnt_cap + "000000000000000000)"
                inherits += ", ERC20Mintable,ERC20Capped";
            }
            if (isUpgradeable) {
                Upgradable = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/Upgradable.sol');
                inherits += " , Upgradeable";
            }

            ejs.renderFile(__dirname + '/contracts/ERC20contracts/Coin.sol', {
                "SafeERC20": SafeERC20,
                "SafeMath": SafeMath,
                "IERC20": IERC20,
                "ERC20": ERC20,
                "ERC20Capped": ERC20Capped,
                "ERC20Detailed": ERC20Detailed,
                "MinterRole": MinterRole,
                "Ownable": Ownable,
                "Pausable": Pausable,
                "PauserRole": PauserRole,
                "Roles": Roles,
                "CapperRole": CapperRole,
                "SignerRole": SignerRole,
                "ERC20Burnable": ERC20Burnable,
                "ERC20Pausable": ERC20Pausable,
                "Upgradable": Upgradable,
                "ERC20Mintable": ERC20Mintable,
                "inherits": inherits,
                "addAsMinter": isMintable ? "addMinter(_newOwner);" : "",
                "addAsPauser": isPausable ? "addPauser(_newOwner);" : "",
                //data from form
                totalSupply: requestData.tokenInitialSupply,
                name: requestData.tokenName,
                symbol: requestData.tokenSymbol,
                decimal: requestData.tokenDecimals,
                decimalInZero: decimalInZero,
                ERC20CappedSign: ERC20CappedSign
            },  (err, data) => {
                if (err) {
                    console.log("ejs.renderFile ERROR =======>", err);
                }

                tokenContractCode = data;


                let output = solc.compile(data).contracts[':Coin'];

                contractAbi = output.interface;

                byteCode = output.bytecode;
           });

            if(requestData.id){ //logic for updating the existing token as draft again with new details
                const existingTokens = await XRC20Token.findAll({
                    where: {
                        "id": requestData.id,
                        "isDeleted": false
                    }
                });

                let existingToken = existingTokens[0];


                let xRCToken = {
                    tokenOwner: requestData.tokenOwner ? requestData.tokenOwner : existingToken.tokenOwner,
                    tokenName: requestData.tokenName ? requestData.tokenName : existingToken.tokenName,
                    tokenSymbol: requestData.tokenSymbol ? requestData.tokenSymbol : existingToken.tokenSymbol,
                    tokenImage: requestData.tokenImage ? requestData.tokenImage : existingToken.tokenImage,
                    tokenInitialSupply: requestData.tokenInitialSupply ? requestData.tokenInitialSupply : existingToken.tokenInitialSupply,
                    website: requestData.website ? requestData.website : existingToken.website,
                    twitter: requestData.twitter ? requestData.twitter : existingToken.twitter,
                    telegram: requestData.telegram ? requestData.telegram : existingToken.telegram,
                    tokenDecimals: requestData.tokenDecimals ? requestData.tokenDecimals : existingToken.tokenDecimals,
                    tokenDescription: requestData.tokenDescription ? requestData.tokenDescription : existingToken.tokenDescription,
                    burnable: requestData.isBurnable,
                    mintable: requestData.isMintable,
                    pausable: requestData.isPausable,
                    contractAbiString: (contractAbi.length !== 0) ? contractAbi : JSON.stringify(contractConstants.DUMMY_CONTRACT_ABI),
                    network: requestData.network ? requestData.network : existingToken.network,
                    tokenContractCode: tokenContractCode,
                    byteCode: byteCode,
                    tokenCurrentSupply: requestData.tokenInitialSupply ? requestData.tokenInitialSupply : existingToken.tokenInitialSupply,
                }


                await XRC20Token.update(
                    xRCToken,
                    { where: { tokenOwner: requestData.tokenOwner,  id: requestData.id, isDeleted: false} },
                )

                return XRC20Token.findAll({
                    where: {
                        "id": requestData.id
                    }
                });

            }
            else{
                const newXRCToken = {
                    tokenOwner: requestData.tokenOwner,
                    tokenName: requestData.tokenName,
                    tokenSymbol: requestData.tokenSymbol,
                    tokenImage: requestData.tokenImage,
                    tokenInitialSupply: requestData.tokenInitialSupply,
                    website: requestData.website ? requestData.website : "",
                    twitter: requestData.twitter ? requestData.twitter : "",
                    telegram: requestData.telegram ? requestData.telegram : "",
                    tokenDecimals: requestData.tokenDecimals,
                    tokenDescription: requestData.tokenDescription,
                    burnable: requestData.isBurnable,
                    mintable: requestData.isMintable,
                    pausable: requestData.isPausable,
                    contractAbiString: (contractAbi.length !== 0) ? contractAbi : JSON.stringify(contractConstants.DUMMY_CONTRACT_ABI),
                    network: requestData.network,
                    tokenContractCode: tokenContractCode,
                    byteCode: byteCode,
                    tokenCurrentSupply: requestData.tokenInitialSupply,
                }

                return XRC20Token.create(newXRCToken);
            }
        }
        catch(err){
            console.log("ERROR in saveXrc20TokenAsDraft =======>", err)
        }



    }

    checkTokensWithSameTokenName = async (requestData) => {
        if(requestData.id){ //if the client is trying to update existing token
            return await this.checkExistingTokens(requestData);
        }
        else{ //if the client is trying to create a new token
            const tokensWithSameName = await XRC20Token.findAll({
                where: {
                    "tokenName": requestData.tokenName,
                    "isDeleted": false
                }
            });

            const tokensWithSameSymbol = await XRC20Token.findAll({
                where: {
                    "tokenSymbol": requestData.tokenSymbol,
                    "isDeleted": false
                }
            });

            if(tokensWithSameName.length > 0){
                throw Utils.error(
                    {},
                    apiFailureMessage.TOKEN_NAME_EXISTS,
                    httpConstants.RESPONSE_CODES.FORBIDDEN
                )
            }
            else if(tokensWithSameSymbol.length > 0){
                throw Utils.error(
                    {},
                    apiFailureMessage.TOKEN_SYMBOL_EXISTS,
                    httpConstants.RESPONSE_CODES.FORBIDDEN
                )
            }
            else{
                return await this.checkExistingTokens(requestData);
            }
        }

    }

    checkExistingTokens = async (requestData) => {
        if(requestData.id){
            const tokens = await XRC20Token.findAll({
                where: {
                    "id": requestData.id,
                    "isDeleted": false
                }
            });

            if(tokens.length > 0){
                return await this.saveXrc20TokenAsDraft(requestData);
            }
            else{
                throw Utils.error(
                    {},
                    apiFailureMessage.NO_SUCH_TOKEN,
                    httpConstants.RESPONSE_CODES.NOT_FOUND
                );
            }
        }
        else{
            return await this.saveXrc20TokenAsDraft(requestData);
        }
    }

    updateXRC20Token = async (requestData) => {

        const tokenDetails = await XRC20Token.findAll({
            where: {
                "tokenOwner": requestData.tokenOwner,
                "id": requestData.tokenId
            }
        });

        if(tokenDetails.length !== 0){

            if(requestData.smartContractAddress !== ""){
                const [errorSocialMediaUpdate, getSocialMediaUpdateRes] = await Utils.parseResponse(this.saveSocialMediaUrlsInObservatory(requestData.smartContractAddress, tokenDetails[0], {}))

                if(!getSocialMediaUpdateRes){
                    console.log("updateXRC20Token =======> ERROR WHILE UPDATING SOCIAL MEDIA URLS!")
                }
                else{
                    console.log("updateXRC20Token =======> SOCIAL MEDIA URLS FOR THE TOKEN UPDATED!")
                }
            }

            let verifyRequest = {
                tokenId: requestData.tokenId,
                contractAddress: requestData.smartContractAddress
            }

            const [error, getVerificationRes] = await Utils.parseResponse(this.verifyXrc20Token(verifyRequest))


            let updateObj = {};

            if(!getVerificationRes){
                updateObj = {
                    smartContractAddress: requestData.smartContractAddress,
                    status: requestData.status,
                    isVerified: false
                }
            }
            else{
                updateObj = {
                    smartContractAddress: requestData.smartContractAddress,
                    status: requestData.status,
                    isVerified: true
                }
            }

            await XRC20Token.update(
                updateObj,
                { where: { tokenOwner: requestData.tokenOwner,  id: requestData.tokenId, isDeleted: false} },
            )
            return XRC20Token.findAll({
                where: {
                    "id": requestData.tokenId
                }
            });
        }
        else{
            return "No such token exists!"
        }
    }

    saveSocialMediaUrlsInObservatory = async (contractAddress, tokenDetails, updateObj) => {
        let url = Config.OBSERVATORY_BASE_URL + "/update-contracts/" + contractAddress;

        let data;

        if(Object.keys(updateObj).length === 0){
            data = {
                contractAddress: contractAddress,
                website: tokenDetails.website,
                telegram: tokenDetails.telegram,
                twitter: tokenDetails.twitter,
                description: tokenDetails.tokenDescription,
                // email: tokenDetails.email,
                // linkedIn: tokenDetails.linkedIn,
                // reddit: tokenDetails.reddit,
                // coinGecko: tokenDetails.coinGecko,
                symbolUrl: tokenDetails.tokenImage
            }
        }
        else{
            data = updateObj;
        }

        let response = await HttpService.executeHTTPRequest(httpConstants.METHOD_TYPE.POST, url, '', data)

        console.log("saveSocialMediaUrlsInObservatory response =======>", url, contractAddress, response);

        if (!response || !response.success)
            throw Utils.error({}, apiFailureMessage.COULD_NOT_UPDATE_TOKEN_SOCIAL_MEDIA_URLS, httpConstants.RESPONSE_CODES.FORBIDDEN);

        return response;

    }

    updateSocialMediaUrls = async (requestData) => {
        const tokens = await XRC20Token.findAll({
            where: {
                "tokenOwner": requestData.tokenOwner,
                "id": requestData.tokenId,
                "network": requestData.network,
                "smartContractAddress": requestData.smartContractAddress,
                "isDeleted": false
            }
        });

        if(tokens.length > 0){


            let updateObj = {
                contractAddress: requestData.smartContractAddress
            };

            if(requestData.hasOwnProperty('website')){
                updateObj.website = requestData.website;
            }
            if(requestData.hasOwnProperty('twitter')){
                updateObj.twitter = requestData.twitter;
            }
            if(requestData.hasOwnProperty('telegram')){
                updateObj.telegram = requestData.telegram;
            }
            if(requestData.hasOwnProperty('email')){
                updateObj.email = requestData.email;
            }
            if(requestData.hasOwnProperty('linkedIn')){
                updateObj.linkedIn = requestData.linkedIn;
            }
            if(requestData.hasOwnProperty('reddit')){
                updateObj.reddit = requestData.reddit;
            }
            if(requestData.hasOwnProperty('coinGecko')){
                updateObj.coinGecko = requestData.coinGecko;
            }
            if(requestData.hasOwnProperty('symbolUrl')){
                updateObj.symbolUrl = requestData.symbolUrl;
            }
            if(requestData.hasOwnProperty('facebook')){
                updateObj.facebook = requestData.facebook;
            }



            if(requestData.network === "XDC Mainnet"){
                await this.saveSocialMediaUrlsInObservatory(requestData.smartContractAddress, tokens[0], updateObj)
                console.log("========= SUCCESS IN UPDATING URLS FOR MAINNET IN OBSERVER =========")
            }


                let xrc20TokenUpdateObj = {};

                if(requestData.hasOwnProperty('website')){
                    xrc20TokenUpdateObj.website = requestData.website;
                }
                if(requestData.hasOwnProperty('twitter')){
                    xrc20TokenUpdateObj.twitter = requestData.twitter;
                }
                if(requestData.hasOwnProperty('telegram')){
                    xrc20TokenUpdateObj.telegram = requestData.telegram;
                }
                if(requestData.hasOwnProperty('email')){
                    xrc20TokenUpdateObj.email = requestData.email;
                }
                if(requestData.hasOwnProperty('linkedIn')){
                    xrc20TokenUpdateObj.linkedIn = requestData.linkedIn;
                }
                if(requestData.hasOwnProperty('reddit')){
                    xrc20TokenUpdateObj.reddit = requestData.reddit;
                }
                if(requestData.hasOwnProperty('coinGecko')){
                    xrc20TokenUpdateObj.coinGecko = requestData.coinGecko;
                }
                if(requestData.hasOwnProperty('symbolUrl')){
                    xrc20TokenUpdateObj.tokenImage = requestData.symbolUrl;
                }
                if(requestData.hasOwnProperty('facebook')){
                    xrc20TokenUpdateObj.facebook = requestData.facebook;
                }

                await XRC20Token.update(
                    xrc20TokenUpdateObj,
                    { where: { tokenOwner: requestData.tokenOwner, id: requestData.tokenId, smartContractAddress: requestData.smartContractAddress, isDeleted: false} },
                )
                return XRC20Token.findAll({
                    where: {
                        "id": requestData.tokenId
                    }
                });

        }
        else{
            throw Utils.error({}, apiFailureMessage.NO_SUCH_TOKEN, httpConstants.RESPONSE_CODES.NOT_FOUND);
        }
    }

    getDraftXRC20Token = async (requestData) => {
        const tokens = await XRC20Token.findAll({
            where: {
                "tokenOwner": requestData.tokenOwner,
                "status": {
                    [Op.or]: ["DRAFT", "FAILED"]
                },
                "network": requestData.network,
                "isDeleted": false
            }
        });

        return tokens;
    }

    deleteXrc20Token = async (requestData) => {
        const tokenDetails = await XRC20Token.findAll({
            where: {
                "id": requestData.id,
                "status": {
                    [Op.or]: ["DRAFT", "FAILED"]
                },
            }
        });

        if(tokenDetails.length !== 0){
            await XRC20Token.update(
                { isDeleted: true},
                { where: { id: requestData.id} },
            )

            return "XRC20 Token deleted successfully";
        }
        else{
            return "Couldn't delete the token";
        }


    }

    getXrc20TokenById = async (requestData) => {
        const token = await XRC20Token.findAll({
            where: {
                "id": requestData.id,
                "isDeleted": false
            }
        });

        return token;
    }

    verifyXrc20Token = async (requestData) => {
        try{
            console.log("verifyXrc20Token requestData =======>", requestData);
            const token = await XRC20Token.findAll({
                where: {
                    "id": requestData.tokenId,
                    "isDeleted": false
                }
            });

            const [error, getRes] = await Utils.parseResponse(this.verifyXrc20TokenManager(requestData.contractAddress, token[0].tokenContractCode, token[0].network, token[0].contractAbiString, token[0].tokenName));
            if (!getRes) {
                throw error;
            }
            else{
                return getRes;
            }
        }
        catch(err){
            console.log("ERROR IN verifyXrc20Token =======>", err);
        }

    }

    verifyXrc20TokenManager = async (address, code, network, abi, tokenName) => {
        try{
            let url = Config.OBSERVATORY_BASE_URL + '/verify-contract';
            //
            let editedAdr = "0x" + address.slice(3);

            console.log("editedAdr editedAdr editedAdr editedAdr =-=-=-=", editedAdr);

            let data = {
                addr: editedAdr,
                argument: "",
                optimise: false,
                contractname: "Coin",
                version: "v0.4.24+commit.e67f0147",
                code: code,
                // isVersionEnable: false
            }

            const headers = {"content-type": "application/json", "X-API-KEY": Config.OBSERVATORY_X_API_KEY};


            let response = await HttpService.executeHTTPRequest(httpConstants.METHOD_TYPE.POST, url, '', data, headers)

            console.log("verification response in verifyXrc20TokenManager =======>", response);

            if (!response || !response.responseData || !response.success)
                throw Utils.error({}, apiFailureMessage.COULD_NOT_VERIFY_TOKEN, httpConstants.RESPONSE_CODES.FORBIDDEN);

            return response;
        }
        catch(err){
            console.log("ERROR IN verifyXrc20TokenManager =======>", err);
        }
    }

    getDeployedXRC20Token = async (requestData) => {
        const tokens = await XRC20Token.findAll({
            where: {
                "tokenOwner": requestData.tokenOwner,
                "status": "DEPLOYED",
                "network": requestData.network,
                "isDeleted": false
            }
        });

        return tokens;
    }

    mintBurnXrc20Token = async (requestData) => {
        const tokens = await XRC20Token.findAll({
            where: {
                "tokenOwner": requestData.tokenOwner,
                "id": requestData.tokenId,
                "network": requestData.network,
                "smartContractAddress": requestData.smartContractAddress,
                "isDeleted": false
            }
        });

        if(tokens.length > 0){
            let tokenFetched = tokens[0];
            let updateObj = {};
            let currentTime = (new Date).toISOString();
            console.log("mintBurnXrc20Token currentTime in UTC =======>", currentTime);
            if(requestData.operation === "mint"){
                updateObj = {
                    mintedTokens: parseInt(tokenFetched.mintedTokens) + parseInt(requestData.mintedTokens),
                    lastMinted: currentTime,
                    tokenCurrentSupply: parseInt(tokenFetched.tokenCurrentSupply) + parseInt(requestData.mintedTokens)
                }
            }
            else if(requestData.operation === "burn"){
                updateObj = {
                    burntTokens: parseInt(tokenFetched.burntTokens) + parseInt(requestData.burntTokens),
                    lastBurnt: currentTime,
                    tokenCurrentSupply: parseInt(tokenFetched.tokenCurrentSupply) - parseInt(requestData.burntTokens)
                }
            }

            await XRC20Token.update(
                updateObj,
                { where: { tokenOwner: requestData.tokenOwner, id: requestData.tokenId, smartContractAddress: requestData.smartContractAddress, isDeleted: false} },
            )
            return XRC20Token.findAll({
                where: {
                    "id": requestData.tokenId
                }
            });



        }
        else{
            throw Utils.error({}, apiFailureMessage.NO_SUCH_TOKEN, httpConstants.RESPONSE_CODES.NOT_FOUND);
        }
    }

    pauseResumeXrc20Token = async (requestData) => {
        const tokens = await XRC20Token.findAll({
            where: {
                "tokenOwner": requestData.tokenOwner,
                "id": requestData.tokenId,
                "network": requestData.network,
                "smartContractAddress": requestData.smartContractAddress,
                "isDeleted": false
            }
        });

        if(tokens.length > 0){
            let updateObj = {
                isPaused: requestData.pause
            }

            await XRC20Token.update(
                updateObj,
                { where: { tokenOwner: requestData.tokenOwner, id: requestData.tokenId, smartContractAddress: requestData.smartContractAddress, isDeleted: false} },
            )
            return XRC20Token.findAll({
                where: {
                    "id": requestData.tokenId
                }
            });
        }
        else{
            throw Utils.error({}, apiFailureMessage.NO_SUCH_TOKEN, httpConstants.RESPONSE_CODES.NOT_FOUND);
        }
    }

    transferOwnershipXrc20Token = async (requestData) => {
        const tokens = await XRC20Token.findAll({
            where: {
                "tokenOwner": requestData.tokenOwner,
                "id": requestData.tokenId,
                "network": requestData.network,
                "smartContractAddress": requestData.smartContractAddress,
                "isDeleted": false
            }
        });

        if(tokens.length > 0){
            let updateObj = {
                tokenOwner: requestData.newTokenOwner
            }

            await XRC20Token.update(
                updateObj,
                { where: { tokenOwner: requestData.tokenOwner, id: requestData.tokenId, smartContractAddress: requestData.smartContractAddress, isDeleted: false} },
            )
            return XRC20Token.findAll({
                where: {
                    "id": requestData.tokenId
                }
            });
        }
        else{
            throw Utils.error({}, apiFailureMessage.NO_SUCH_TOKEN, httpConstants.RESPONSE_CODES.NOT_FOUND);
        }
    }

    uploadFileToS3 = async (request) => {

        //need to retrieve the image file details from the request body and the new 'uploads' folder inside which the file will be stored.
        //Also, make sure to delete that file from the uploads folder once the file is successfully uploaded to S3
        

        const config = {
            accessKeyId: Config.S3_ACCESS_KEY,
            secretAccessKey: Config.S3_SECRET_KEY
        }

        AWS.config.update(config);
        
        let s3 = new AWS.S3();

        let newpath=path.dirname(__dirname)
        let newpath1=path.dirname(newpath)
        let newpath2=path.dirname(newpath1)
        

        const filename = (request.filename).replace(/\s/g, '')

        let fileContent=fs.readFileSync(newpath2+`/uploads/`+`${request.filename}`)
        let params = { //need to pass the image file's key and body appropriately to the Key and Body keys
            Bucket: Config.S3_BUCKET_NAME,
            Key: filename,
            Body: fileContent
        }

         let response1=new Promise(function (resolve, reject) {
            s3.upload(params, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    let responseObj = {
                        sourceFileName: res.Key,
                    };
                    resolve(res);
                }
            });
        });
        fs.unlinkSync(newpath2+`/uploads/`+`${request.filename}`)
        return response1


    }

    // verifyXrc20 = async (settings, provider) => {
    //     let web3 =  await WebSocketService.webSocketConnection(provider);
    //     let solc_version = settings['solc_version'];
    //     let file_name = settings['file_name'];
    //     let contract_name = settings['contract_name'];
    //     let contract_address = settings['contract_address'];
    //     let is_optimized = settings['is_optimized'];
    //     let source_code = settings['source_code'];
    //     const responseStatus = []
    //     let input = sourse_code;
    //     let bytecode_from_compiler;
    //     let bytecode_from_blockchain;
    //     let output;
    //     let bytecode;
    //
    //     let input_json = {
    //         language: "Solidity",
    //         sources:
    //             {file: {"content": input} },
    //         settings: {
    //             optimizer: {
    //                 // disabled by default
    //                 enabled: is_optimized,
    //                 runs: 200
    //             },
    //             outputSelection: {
    //                 "*": {
    //                     "*": [ "*" ]
    //                 }
    //             }
    //         }
    //     }
    // }
}
