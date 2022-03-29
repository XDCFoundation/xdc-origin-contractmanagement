import {Op} from "sequelize";

const db = require('../../../database/models/index');
const XRC20Token = db.XRC20Token;
const XRC721Token = db.XRC721Token;
const NFT=db.NFT;
import solc from 'solc';
import fileReader from "../fileReader/index"
import ejs from "ejs";
import {apiFailureMessage, contractConstants, httpConstants} from '../../common/constants'
import Utils from "../../utils";
import HttpService from "../../service/http-service";
// import WebSocketService from '../../service/WebsocketService';
import Config from "../../../config";
//import contract from "../createContract/contracts"
//import Config from "../"

export default class Manager {

    createNftCollection = async (requestData) => {

        let SafeMath = await fileReader.readEjsFile(__dirname + '/../createContract/contracts/ERC721contracts/SafeMath.sol');
        let Roles = await fileReader.readEjsFile(__dirname + '/../createContract/contracts/ERC721contracts/Roles.sol');
        let ERC721Holder = await fileReader.readEjsFile(__dirname + '/../createContract/contracts/ERC721contracts/ERC721Holder.sol');
        let Address = await fileReader.readEjsFile(__dirname + '/../createContract/contracts/ERC721contracts/Address.sol');
        let ERC165 = await fileReader.readEjsFile(__dirname + '/../createContract/contracts/ERC721contracts/ERC165.sol');
        let ERC721Mintable = await fileReader.readEjsFile(__dirname + '/../createContract/contracts/ERC721contracts/ERC721Mintable.sol');
        let ERC721Enumerable = await fileReader.readEjsFile(__dirname + '/../createContract/contracts/ERC721contracts/ERC721Enumerable.sol');
        let ERC721Metadata = await fileReader.readEjsFile(__dirname + '/../createContract/contracts/ERC721contracts/ERC721Metadata.sol');
        let isPausable = false;
        let isBurnable = false;
        let isOwnable = false;
        let ERC721Burnable, ERC721Pausable, Ownable, inherits = "";

        
        if (isBurnable) {
            ERC721Burnable = await fileReader.readEjsFile(__dirname + '/../createContract/contracts/ERC721contracts/ERC721Burnable.sol');
            inherits += ", Burnable";
        }
    
        if (isPausable) {
            ERC721Pausable = await fileReader.readEjsFile(__dirname + '/../createContract/contracts/ERC721contracts/ERC721Pausable.sol');
            inherits += ", Pausable";
        }
        if (isOwnable) {
            Ownable = await fileReader.readEjsFile(__dirname + '/../createContract/contracts/ERC721contracts/Ownable.sol');
            inherits += ", Ownable";
        }

        let output = {};
        //let oData = {};
        let contractAbi = [];
        let tokenContractCode = '';
        let byteCode = "";
        console.log(Address,"addres--")

        ejs.renderFile(__dirname + '/../createContract/contracts/ERC721contracts/Coin.sol', {
            'SafeMath': SafeMath,
            'Roles': Roles,
            'ERC721Holder': ERC721Holder,
            'Address': Address,
            'ERC165': ERC165,
            'ERC721Enumerable': ERC721Enumerable,
            'ERC721Metadata': ERC721Metadata,
            'ERC721Burnable': ERC721Burnable,
            'ERC721Mintable': ERC721Mintable,
            'ERC721Pausable': ERC721Pausable,
            'Ownable': Ownable,
            // 'tokenName': "NFT Collection 4",
            // 'tokenSymbol': "NFTC4",
            tokenName: requestData.tokenName,
            tokenSymbol: requestData.tokenSymbol,
            'inherits': inherits
        }, (err, data) => {

            if (err)
                console.log(err,"error");
            
            tokenContractCode = data;
            // oData = data;
              output = solc.compile(data).contracts[':Coin'];
            
              contractAbi = output.interface;
            
              byteCode = output.bytecode;
            


        });
    
        const newXRC721Token = {
            tokenOwner: requestData.tokenOwner ? requestData.tokenOwner : existingToken.tokenOwner,
             tokenName: requestData.tokenName ? requestData.tokenName : existingToken.tokenName,
             tokenSymbol: requestData.tokenSymbol ? requestData.tokenSymbol : existingToken.tokenSymbol,
             tokenImage: requestData.tokenImage ? requestData.tokenImage : existingToken.tokenImage,
             website: requestData.website ? requestData.website : existingToken.website,
             twitter: requestData.twitter ? requestData.twitter : existingToken.twitter,
             telegram: requestData.telegram ? requestData.telegram : existingToken.telegram,
             tokenDescription: requestData.tokenDescription ? requestData.tokenDescription : existingToken.tokenDescription,
             network: requestData.network ? requestData.network : existingToken.network,
             contractAbiString: (contractAbi.length !== 0) ? contractAbi : JSON.stringify(contractConstants.DUMMY_CONTRACT_ABI),
             tokenContractCode: tokenContractCode,
             byteCode: byteCode,
        }

        return XRC721Token.create(newXRC721Token);
    
        // return {"code": oData, "abi": contractAbi, "byteCode": byteCode};
    
    }

    

    findToken = async (requestData) => {
        const tokensFromDB = await XRC721Token.findAll({
            where:{
                id:2

            },
            limit:10
            
        });
        return tokensFromDB;

    }

    createrNFT = async(requestData)=>{
        const newNFT = {
            collectionId:requestData.collectionId,
            nftOwner:requestData.nftOwner,
            nftName:requestData.nftName,
            nftDescription:requestData.nftDescription,
            ipfsUrl:requestData.ipfsUrl,
            network:requestData.network,

        }

        return NFT.create(newNFT);


    }

    updateToken721 =async(requestData) =>{
        const tokenDetails = await XRC721Token.findAll({
            where:{
                "tokenOwner": requestData.tokenOwner,
                "id": requestData.tokenId
            }
        })

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

            await XRC721Token.update(
                updateObj,
                { where: { tokenOwner: requestData.tokenOwner,  id: requestData.tokenId, isDeleted: false} },
            )
            return XRC721Token.findAll({
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

    updateNft =async(requestData) =>{
        const tokenDetails = await NFT.findAll({
            where:{
                "nftOwner": requestData.nftOwner,
                "collectionId": requestData.collectionId
            }
        })

        if(tokenDetails.length !== 0){

            let updateObj = {};

            
                updateObj = {
                    nftTokenId: requestData.nftTokenId,
                    status: requestData.status,
                }
           
            await NFT.update(
                updateObj,
                { where: { nftOwner: requestData.nftOwner,  collectionId: requestData.collectionId, isDeleted: false} },
            )
            return NFT.findAll({
                where: {
                    "collectionId": requestData.collectionId
                }
            });
        }
        else{
            return "No such token exists!"
        }
    }
}
