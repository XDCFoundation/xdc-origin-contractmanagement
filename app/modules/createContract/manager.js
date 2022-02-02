import {Op} from "sequelize";

const db = require('../../../database/models/index');
// const solc = require('solc');
const XRC20Token = db.XRC20Token;
import solc from 'solc';
import fileReader from "../fileReader/index"
import ejs from "ejs";
import {apiFailureMessage, contractConstants, httpConstants} from '../../common/constants'
import Utils from "../../utils";
import HttpService from "../../service/http-service";
const axios = require("axios");
import WebSocketService from '../../service/WebsocketService';
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
            for (let index = 0; index < requestData.tokenDecimals; index++) { //for (let index = 0; index < req.body.token_decimals; index++) {
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
                // let ERC20Capped = await fileReader.readEjsFile(__dirname + '/ERC20contracts/ERC20Capped.sol');
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
                //data from form
                totalSupply: requestData.tokenInitialSupply, //req.body.token_supply 1000,
                name: requestData.tokenName, //req.body.token_name,
                symbol: requestData.tokenSymbol, //req.body.token_symbol,
                decimal: requestData.tokenDecimals, //req.body.token_decimals,
                decimalInZero: decimalInZero, //"000000000000000000",
                ERC20CappedSign: ERC20CappedSign
            },  (err, data) => {
                if (err) {
                    console.log("errrrrror -=-=-=-=-=-=-=", err);
                }
                let input_json = {
                    language: "Solidity",
                    sources:
                        {file: {"content": data}},
                    settings: {
                        outputSelection: {
                            "*": {
                                "*": ["*"]
                            }
                        }
                    }
                }
                tokenContractCode = data;

                let output = solc.compile(data).contracts[':Coin']; //await solc.compile(JSON.stringify(input_json)); // the reason for the contract not being verified might lie here. Here, the bytecode we're sending comes from the 'coin' field inside the copiled output of the 'data', but for verification we're only sending the 'data' and its not processing the right coin key.


                // let output = JSON.parse(solc.compile(JSON.stringify(input_json)));

                // console.log("output -=-=-=-=-=-=-=-=-=", output.metadata);


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
                    burnable: requestData.isBurnable ? requestData.isBurnable : existingToken.isBurnable,
                    mintable: requestData.isMintable ? requestData.isMintable : existingToken.isMintable,
                    pausable: requestData.isPausable ? requestData.isPausable : existingToken.isPausable,
                    contractAbiString: (contractAbi.length !== 0) ? JSON.stringify(contractAbi) : JSON.stringify(contractConstants.DUMMY_CONTRACT_ABI),
                    network: requestData.network ? requestData.network : existingToken.network,
                    tokenContractCode: tokenContractCode,
                    byteCode: byteCode
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
                    contractAbiString: (contractAbi.length !== 0) ? JSON.stringify(contractAbi) : JSON.stringify(contractConstants.DUMMY_CONTRACT_ABI),
                    network: requestData.network,
                    tokenContractCode: tokenContractCode,
                    byteCode: byteCode
                }

                return XRC20Token.create(newXRCToken);
            }
        }
        catch(err){
            console.log("ERROR in saveXrc20TokenAsDraft =-=-=-=-=-=-=-=-=", err)
        }



    }

    checkTokensWithSameTokenName = async (requestData) => {
        if(requestData.id){ //if the client is trying to update existing token
            // console.log("216 else =-=-=-=-=-=-=-=-=")
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

            // console.log("tokensWithSameSymbol =-=-=-=-=-=-=-", tokensWithSameSymbol.length);

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
                // console.log("248 else =-=-=-=-=-=-=-=-=")
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
            const token = tokenDetails[0];
            await XRC20Token.update(
                { smartContractAddress: requestData.smartContractAddress, status: requestData.status},
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

    getDraftXRC20Token = async (requestData) => {
        const tokens = await XRC20Token.findAll({
            where: {
                "tokenOwner": requestData.tokenOwner, //need to add or operation here for 'FAILED' status
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
            console.log("requestData =-=-=-=-=-=-=-=-=-", requestData);
            const token = await XRC20Token.findAll({
                where: {
                    "id": requestData.tokenId,
                    "isDeleted": false
                }
            });

            return await this.verifyXrc20TokenManager(requestData.contractAddress, token[0].tokenContractCode, token[0].network, token[0].contractAbiString, token[0].tokenName);

        }
        catch(err){
            console.log("err=-=-=-=-=-=-=", err);
        }

    }

    verifyXrc20TokenManager = async (address, code, network, abi, tokenName) => {
        console.log("address -=-=-=-==", address);
        // console.log("code -=-=-=-==", code);
        // console.log("network -=-=-=-==", network);
        // console.log("abi -=-=-=-==", JSON.parse(abi));
        console.log("tokenName -=-=-=-==", tokenName);

        try{
            let url = 'https://explorer.apothem.network/compile';
            //
            // let data = {
            //     address: address,
            //     optimization: false,
            //     name: tokenName,
            //     version: "v0.4.24+commit.e67f0147",
            //     action: "compile",
            //     code: code,
            //     abi: "",
            // }

            // let response = await HttpService.executeHTTPRequest(httpConstants.METHOD_TYPE.POST, url, '/compile', data)

            // const resp = await axios.post(url, {
            //     address: address,
            //     optimization: false,
            //     name: tokenName,
            //     version: "v0.4.24+commit.e67f0147",
            //     action: "compile",
            //     code: code,
            //     abi: "",
            // });

            let code2 = "pragma solidity ^0.4.24;contract SimpleStorage {string storedData;uint256 count = 0;mapping(uint256 => string) public tweets;function createTweet(uint256 tweetId, string tweet) public {storedData = tweet;tweets[tweetId] = tweet;count+=1;}function getTweetByTweetId(uint256 tweetId) public view returns (string) {return tweets[tweetId];}function getCount() public view returns (uint256) {return count;}}"

            console.log("response =-=-=-=-=-=-=-=", code2);

            // if (!response || !response.responseData || !response.success)
            //     throw Utils.error({}, response.message || apiFailureMessage.USER_CREATE_AUTH0, httpConstants.RESPONSE_CODES.FORBIDDEN);

            return code2;
        }
        catch(err){
            console.log("ERRRRRRRR -=-=---=-=-=-=-=-====-=-", err);
        }
    }

    getDeployedXRC20Token = async (requestData) => {
        const tokens = await XRC20Token.findAll({
            where: {
                "tokenOwner": requestData.tokenOwner, //need to add or operation here for 'FAILED' status
                "status": "DEPLOYED",
                "network": requestData.network,
                "isDeleted": false
            }
        });

        return tokens;
    }

    verifyXrc20 = async (settings, provider) => {
        let web3 =  await WebSocketService.webSocketConnection(provider);
        let solc_version = settings['solc_version'];
        let file_name = settings['file_name'];
        let contract_name = settings['contract_name'];
        let contract_address = settings['contract_address'];
        let is_optimized = settings['is_optimized'];
        let source_code = settings['source_code'];
        const responseStatus = []
        let input = sourse_code;
        let bytecode_from_compiler;
        let bytecode_from_blockchain;
        let output;
        let bytecode;

        let input_json = {
            language: "Solidity",
            sources:
                {file: {"content": input} },
            settings: {
                optimizer: {
                    // disabled by default
                    enabled: is_optimized,
                    runs: 200
                },
                outputSelection: {
                    "*": {
                        "*": [ "*" ]
                    }
                }
            }
        }
    }
}
