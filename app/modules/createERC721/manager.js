const db = require('../../../database/models/index');
const XRC721Token = db.XRC721Token;
const XRC20Token = db.XRC20Token;
const NFT=db.NFT;
import solc from 'solc';
import fileReader from "../fileReader/index"
import ejs from "ejs";
import {apiFailureMessage, contractConstants, httpConstants} from '../../common/constants'
import Utils from "../../utils";
import HttpService from "../../service/http-service";
import Config from "../../../config";
import { Op } from "sequelize";
import fs from 'fs';
import ipfsClient from "ipfs-http-client";



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
            tokenName: requestData.tokenName,
            tokenSymbol: requestData.tokenSymbol,
            'inherits': inherits
        }, (err, data) => {

            if (err)
                console.log(err,"error");
            
            tokenContractCode = data;
              output = solc.compile(data).contracts[':Coin'];
            
              contractAbi = output.interface;
            
              byteCode = output.bytecode;
            


        });
    
        const newXRC721Token = {
            tokenOwner: requestData.tokenOwner ,
             tokenName: requestData.tokenName ,
             tokenSymbol: requestData.tokenSymbol ,
             tokenImage: requestData.tokenImage,
             website: requestData.website ? requestData.website : "",
             twitter: requestData.twitter ? requestData.twitter : "",
             telegram: requestData.telegram ? requestData.telegram : "",
             tokenDescription: requestData.tokenDescription,
             network: requestData.network,
             contractAbiString: (contractAbi.length !== 0) ? contractAbi : JSON.stringify(contractConstants.DUMMY_CONTRACT_ABI),
             tokenContractCode: tokenContractCode,
             byteCode: byteCode,
        }

        return XRC721Token.create(newXRC721Token);
    
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
                "id": requestData.id
            }
        })

        if(tokenDetails.length !== 0){

            if(requestData.smartContractAddress !== ""){
                const [errorSocialMediaUpdate, getSocialMediaUpdateRes] = await Utils.parseResponse(this.saveSocialMediaUrlsInObservatory(requestData.smartContractAddress, tokenDetails[0], {}))

                if(!getSocialMediaUpdateRes){
                    console.log("update721Token =======> ERROR WHILE UPDATING SOCIAL MEDIA URLS!")
                }
                else{
                    console.log("update721Token =======> SOCIAL MEDIA URLS FOR THE TOKEN UPDATED!")
                }
            }

            let verifyRequest = {
                id: requestData.id,
                contractAddress: requestData.smartContractAddress
            }

            const [error, getVerificationRes] = await Utils.parseResponse(this.verify721Token(verifyRequest))


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


            // updateObj = {
            //             smartContractAddress: requestData.smartContractAddress,
            //             status: requestData.status,
            //             isVerified: true
            //         }



            await XRC721Token.update(
                updateObj,
                { where: { tokenOwner: requestData.tokenOwner,  id: requestData.id, isDeleted: false} },
            )
            return XRC721Token.findAll({
                where: {
                    "id": requestData.id
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

    verify721Token = async (requestData) => {
        try{
            console.log("verify721Token requestData =======>", requestData);
            const token = await XRC721Token.findAll({
                where: {
                    "id": requestData.id,
                    "isDeleted": false
                }
            });

            const [error, getRes] = await Utils.parseResponse(this.verify721TokenManager(requestData.contractAddress, token[0].tokenContractCode, token[0].network, token[0].contractAbiString, token[0].tokenName));
            if (!getRes) {
                throw error;
            }
            else{
                return getRes;
            }
        }
        catch(err){
            console.log("ERROR IN verify721Token =======>", err);
        }

    }

    verify721TokenManager = async (address, code, network, abi, tokenName) => {
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

            console.log("verification response in verify721TokenManager =======>", response);

            if (!response || !response.responseData || !response.success)
                throw Utils.error({}, apiFailureMessage.COULD_NOT_VERIFY_TOKEN, httpConstants.RESPONSE_CODES.FORBIDDEN);

            return response;
        }
        catch(err){
            console.log("ERROR IN verify721TokenManager =======>", err);
        }
    }

    updateNft =async(requestData) =>{
        const tokenDetails = await NFT.findAll({
            where:{
                "nftOwner": requestData.nftOwner,
                "collectionId": requestData.collectionId,
                "id":requestData.id
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
                { where: { nftOwner: requestData.nftOwner,  collectionId: requestData.collectionId, isDeleted: false, id:requestData.id} },
            )
            return NFT.findAll({
                where: {
                    "collectionId": requestData.collectionId,
                    "id":requestData.id
                }
            });
        }
        else{
            return "No such token exists!"
        }
    }

    

    find721TokenAndNft = async (requestData) => {
        const tokensFromDB = await XRC721Token.findAll({
            where:{
                id:requestData.id

            }  
        });
        const NftFromDB = await NFT.findAll({
            where:{
                collectionId:requestData.id,
                isDeleted:false

            }  
        });
        return {tokensFromDB,"NftFromDB":NftFromDB};

    }


    findNft = async (requestData) => {
        const tokensFromDB = await NFT.findAll({
            where:{
                nftTokenId:requestData.nftTokenId,
                collectionId:requestData.collectionId,
                id:requestData.id,
                isDeleted:false
            }
            
        });
        if(tokensFromDB.length!==0)
            return tokensFromDB;
        else
            return "No data found"
            
    }

    deletingNft = async(requestData) =>{
        

        await NFT.update(
            {isDeleted:true},
            {where:{
                nftTokenId:requestData.nftTokenId
            }}
        )

        return "NFT deleted successfully"

    }


    nftTransfer = async (requestData) => {
        const transferDB = await NFT.findAll({
          where: {
            nftTokenId: requestData.nftTokenId,
            id: requestData.id,
          },
        });
    
        let transfersArray = {};
        transfersArray.to = requestData.to;
        transfersArray.from = requestData.from;
        transfersArray.date = requestData.when;
    
        let data = transferDB[0].transfers;
        
        data.push(transfersArray);
    
    
        await NFT.update(
          { transfers: data ,
            nftOwner: requestData.to
        },
          {
            where: {
              nftTokenId: requestData.nftTokenId,
              id: requestData.id,
            },
          }
        );
    
        
        const tokensFromDB = await NFT.findAll({
          where: {
            nftTokenId: requestData.nftTokenId,
            id: requestData.id,
          },
        });
        
        return tokensFromDB;
      };
    
      
    xrcTokenByOwner = async(requestData)=>{
            try{
    
                const token721= await XRC721Token.findAll(
                {
                  attributes:["id","tokenName","status"],   
                where: {
                    tokenOwner: requestData.tokenOwner,
                }
              });
              return token721
    
            }
            catch(e){
                console.log("error",e)
            }
            
    }


    getDraftedAndFailedTokens = async (requestData) => {
        let newArray = [];
        const draftedTokens721 = await XRC721Token.findAll({
          where: {
            [Op.or]: [{status: "FAILED"}, {status: "DRAFT"}],
            tokenOwner: requestData.tokenOwner,
            network: requestData.network
          }
        });
    
        const draftedTokens20 = await XRC20Token.findAll({
          where: {
            [Op.or]: [{status: "FAILED"}, {status: "DRAFT"}],
            tokenOwner: requestData.tokenOwner,
            network: requestData.network
          }
        });
        newArray=draftedTokens721.concat(draftedTokens20)

        if(newArray.length!==0)
            return {draftedTokens721,draftedTokens20,newArray}
        else
            return "no data found"
        
      };
    
      getXRC721AndXRC20TokensByNetwork = async (requestData) => {
        let newArray = [];
        let type=requestData.type
        const tokens721 = await XRC721Token.findAll({
          where: {
            tokenOwner: requestData.tokenOwner,
            network: requestData.network,
            status:"DEPLOYED"
          }
        });
    
        const tokens20 = await XRC20Token.findAll({
          where: {
            tokenOwner: requestData.tokenOwner,
            network: requestData.network,
            status:"DEPLOYED"
          },
        });

        newArray=tokens721.concat(tokens20)

        if(type==="XRC721"){
            if(tokens721.length!==0)
            return {tokens721}
        else
            return "no data found"
        }
        else if(type==="XRC20"){
            if(tokens20.length!==0)
            return {tokens20}
            else
            return "no data found"
        }
        else if(type==="ALL"){
            if(newArray.length!==0)
            return {newArray}
            else
            return "no data found"
        }

        


        };


        getDeployedTokens = async (requestData) => {
            let newArray = [];
            const tokens721 = await XRC721Token.findAll({
              where: {
                status:"DEPLOYED",
                tokenOwner: requestData.tokenOwner,
                network: requestData.network
                
              }
            });
        
            const tokens20 = await XRC20Token.findAll({
              where: {
                status:"DEPLOYED",
                tokenOwner: requestData.tokenOwner,
                network: requestData.network

              }
            });
            newArray=tokens721.concat(tokens20)
    
            if(newArray.length!==0)
                return {tokens721,tokens20,newArray}
            else
                return "no data found"
    
    
            };



            uploadContent = async (requestData) => {
                try {
                    let contentUploadResponse = await this.parseRequestAndUploadFile(requestData, requestData.tokenOwner)
                    return {contentUploadResponse}
                } catch (err) {
                    throw new Error(err)
                }
            }


            getFileHash = async (file, path) => {

                try {
                    const ipfs = await ipfsClient.create({
                        host: Config.IPFS_IP,
                        port: Config.IPFS_PORT,
                        protocol: Config.IPFS_PROTOCOL,
                    });
        
                    const fileAdded = await ipfs.add({path, content: file}, {onlyHash: true});
                    if (!fileAdded || !fileAdded.cid) {
                        throw "failed to generate file hash"
                    }
                    return fileAdded.cid;
                } catch (error) {
                    throw (error)
                }
            }

            addFileToIPFS =  async (file, path) => {
                
                try {
                    const ipfs = await ipfsClient.create({
                        host: Config.IPFS_IP,
                        port: Config.IPFS_PORT,
                        protocol: Config.IPFS_PROTOCOL,
                    });
                    
                    const fileAdded = await ipfs.add({path, content: file});
                    if (!fileAdded || !fileAdded.cid) {
                        throw "failed to upload file to IPFS"
                    }
                    return fileAdded.cid;
                } catch (error) {
                    throw (error)
                }
            }
        
        
            parseRequestAndUploadFile = async (uploadObj, userId) => {
                try {
                    let requestData = uploadObj

                    let fileName = (requestData.fileName).replace(/\s/g, '')

                    let key = `${userId}/${Config.FOLDER_NAME}/${fileName}`;

                    let content = fs.readFileSync(__dirname + `/uploads/${fileName}`)

                    await fs.renameSync(__dirname + `/uploads/${fileName}`, __dirname + `/uploads/XDCNFT.mp4`)
                    let keyForValidation = 'CIDs/XDCNFT.mp4'
                    let renamedFile = fs.readFileSync(__dirname + `/uploads/XDCNFT.mp4`)

                    let newFileHash = await this.getFileHash(renamedFile, keyForValidation);

                    const contentAddress = newFileHash.toString()
        
                    let fileUploadToIPFSResponse = await this.addFileToIPFS(content, key);

        
                    let ipfsUrl = Config.IPFS_HOST_URL + fileUploadToIPFSResponse.toString() + `/${Config.FOLDER_NAME}/` + fileName

                    let metadata = JSON.stringify({
                        name:requestData.name,
                        description: requestData.description,
                        ipfsImageUrl:ipfsUrl
                    })


                    fileName = `${Date.now()}_${requestData.tokenOwner}_metadata.json`;
                    key = `${userId}/${Config.FOLDER_NAME}/${fileName}`;

                    fs.writeFileSync(fileName, metadata)
                    let uploadMetaDataResponse = await this.addFileToIPFS(fs.readFileSync(fileName), key)

                    let metadataUrl = Config.IPFS_HOST_URL + uploadMetaDataResponse.toString() + `/${Config.FOLDER_NAME}/` + fileName


                    fs.unlinkSync(fileName)
        
                    return {
                        ...requestData,
                        ipfsUrl,
                        metadataUrl,
                    }
        
                } catch (err) {
                    throw new Error(err);
                }
            }
        

    
}





