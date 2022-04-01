const db = require("../../../database/models/index");
const XRC721Token = db.XRC721Token;
const XRC20Token = db.XRC20Token;
const NFT = db.NFT;
import solc from "solc";
import fileReader from "../fileReader/index";
import ejs from "ejs";
import {
  apiFailureMessage,
  contractConstants,
  httpConstants,
} from "../../common/constants";
import Utils from "../../utils";
import HttpService from "../../service/http-service";
import Config from "../../../config";



export default class Manager {
  createNftCollection = async (requestData) => {
    let SafeMath = await fileReader.readEjsFile(
      __dirname + "/../createContract/contracts/ERC721contracts/SafeMath.sol"
    );
    let Roles = await fileReader.readEjsFile(
      __dirname + "/../createContract/contracts/ERC721contracts/Roles.sol"
    );
    let ERC721Holder = await fileReader.readEjsFile(
      __dirname +
        "/../createContract/contracts/ERC721contracts/ERC721Holder.sol"
    );
    let Address = await fileReader.readEjsFile(
      __dirname + "/../createContract/contracts/ERC721contracts/Address.sol"
    );
    let ERC165 = await fileReader.readEjsFile(
      __dirname + "/../createContract/contracts/ERC721contracts/ERC165.sol"
    );
    let ERC721Mintable = await fileReader.readEjsFile(
      __dirname +
        "/../createContract/contracts/ERC721contracts/ERC721Mintable.sol"
    );
    let ERC721Enumerable = await fileReader.readEjsFile(
      __dirname +
        "/../createContract/contracts/ERC721contracts/ERC721Enumerable.sol"
    );
    let ERC721Metadata = await fileReader.readEjsFile(
      __dirname +
        "/../createContract/contracts/ERC721contracts/ERC721Metadata.sol"
    );
    let isPausable = false;
    let isBurnable = false;
    let isOwnable = false;
    let ERC721Burnable,
      ERC721Pausable,
      Ownable,
      inherits = "";

    if (isBurnable) {
      ERC721Burnable = await fileReader.readEjsFile(
        __dirname +
          "/../createContract/contracts/ERC721contracts/ERC721Burnable.sol"
      );
      inherits += ", Burnable";
    }

    if (isPausable) {
      ERC721Pausable = await fileReader.readEjsFile(
        __dirname +
          "/../createContract/contracts/ERC721contracts/ERC721Pausable.sol"
      );
      inherits += ", Pausable";
    }
    if (isOwnable) {
      Ownable = await fileReader.readEjsFile(
        __dirname + "/../createContract/contracts/ERC721contracts/Ownable.sol"
      );
      inherits += ", Ownable";
    }

    let output = {};
    //let oData = {};
    let contractAbi = [];
    let tokenContractCode = "";
    let byteCode = "";

    ejs.renderFile(
      __dirname + "/../createContract/contracts/ERC721contracts/Coin.sol",
      {
        SafeMath: SafeMath,
        Roles: Roles,
        ERC721Holder: ERC721Holder,
        Address: Address,
        ERC165: ERC165,
        ERC721Enumerable: ERC721Enumerable,
        ERC721Metadata: ERC721Metadata,
        ERC721Burnable: ERC721Burnable,
        ERC721Mintable: ERC721Mintable,
        ERC721Pausable: ERC721Pausable,
        Ownable: Ownable,
        tokenName: requestData.tokenName,
        tokenSymbol: requestData.tokenSymbol,
        inherits: inherits,
      },
      (err, data) => {
        if (err) console.log(err, "error");

        tokenContractCode = data;
        output = solc.compile(data).contracts[":Coin"];

        contractAbi = output.interface;

        byteCode = output.bytecode;
      }
    );

    const newXRC721Token = {
      tokenOwner: requestData.tokenOwner,
      tokenName: requestData.tokenName,
      tokenSymbol: requestData.tokenSymbol,
      tokenImage: requestData.tokenImage,
      website: requestData.website ? requestData.website : "",
      twitter: requestData.twitter ? requestData.twitter : "",
      telegram: requestData.telegram ? requestData.telegram : "",
      tokenDescription: requestData.tokenDescription,
      network: requestData.network,
      contractAbiString:
        contractAbi.length !== 0
          ? contractAbi
          : JSON.stringify(contractConstants.DUMMY_CONTRACT_ABI),
      tokenContractCode: tokenContractCode,
      byteCode: byteCode,
    };

    return XRC721Token.create(newXRC721Token);
  };

  findToken = async (requestData) => {
    const tokensFromDB = await XRC721Token.findAll({
      where: {
        id: 2,
      },
      limit: 10,
    });
    return tokensFromDB;
  };
  createrNFT = async (requestData) => {
    const newNFT = {
      collectionId: requestData.collectionId,
      nftOwner: requestData.nftOwner,
      nftName: requestData.nftName,
      nftDescription: requestData.nftDescription,
      ipfsUrl: requestData.ipfsUrl,
      network: requestData.network,
    };

    return NFT.create(newNFT);
  };

  updateToken721 = async (requestData) => {
    const tokenDetails = await XRC721Token.findAll({
      where: {
        tokenOwner: requestData.tokenOwner,
        id: requestData.id,
      },
    });

    if (tokenDetails.length !== 0) {
      // if(requestData.smartContractAddress !== ""){
      //     const [errorSocialMediaUpdate, getSocialMediaUpdateRes] = await Utils.parseResponse(this.saveSocialMediaUrlsInObservatory(requestData.smartContractAddress, tokenDetails[0], {}))

      //     if(!getSocialMediaUpdateRes){
      //         console.log("update721Token =======> ERROR WHILE UPDATING SOCIAL MEDIA URLS!")
      //     }
      //     else{
      //         console.log("update721Token =======> SOCIAL MEDIA URLS FOR THE TOKEN UPDATED!")
      //     }
      // }

      // let verifyRequest = {
      //     tokenId: requestData.tokenId,
      //     contractAddress: requestData.smartContractAddress
      // }

      // const [error, getVerificationRes] = await Utils.parseResponse(this.verify721Token(verifyRequest))

      let updateObj = {};

      // if(!getVerificationRes){
      //     updateObj = {
      //         smartContractAddress: requestData.smartContractAddress,
      //         status: requestData.status,
      //         isVerified: false
      //     }
      // }
      // else{
      //     updateObj = {
      //         smartContractAddress: requestData.smartContractAddress,
      //         status: requestData.status,
      //         isVerified: true
      //     }
      // }

      updateObj = {
        smartContractAddress: requestData.smartContractAddress,
        status: requestData.status,
        isVerified: true,
      };

      await XRC721Token.update(updateObj, {
        where: {
          tokenOwner: requestData.tokenOwner,
          id: requestData.id,
          isDeleted: false
        }
      });
      return XRC721Token.findAll({
        where: {
          id: requestData.id
        }
      });
    } else {
      return "No such token exists!";
    }
  };

  saveSocialMediaUrlsInObservatory = async (
    contractAddress,
    tokenDetails,
    updateObj
  ) => {
    let url =
      Config.OBSERVATORY_BASE_URL + "/update-contracts/" + contractAddress;

    let data;

    if (Object.keys(updateObj).length === 0) {
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
    } else {
      data = updateObj;
    }

    let response = await HttpService.executeHTTPRequest(
      httpConstants.METHOD_TYPE.POST,
      url,
      "",
      data
    );

    console.log(
      "saveSocialMediaUrlsInObservatory response =======>",
      url,
      contractAddress,
      response
    );

    if (!response || !response.success)
      throw Utils.error(
        {},
        apiFailureMessage.COULD_NOT_UPDATE_TOKEN_SOCIAL_MEDIA_URLS,
        httpConstants.RESPONSE_CODES.FORBIDDEN
      );

    return response;
  };

  verify721Token = async (requestData) => {
    try {
      console.log("verify721Token requestData =======>", requestData);
      const token = await XRC721Token.findAll({
        where: {
          id: requestData.tokenId,
          isDeleted: false
        }
      });

      const [error, getRes] = await Utils.parseResponse(
        this.verify721TokenManager(
          requestData.contractAddress,
          token[0].tokenContractCode,
          token[0].network,
          token[0].contractAbiString,
          token[0].tokenName
        )
      );
      if (!getRes) {
        throw error;
      } else {
        return getRes;
      }
    } catch (err) {
      console.log("ERROR IN verify721Token =======>", err);
    }
  };

  verify721TokenManager = async (address, code, network, abi, tokenName) => {
    try {
      let url = Config.OBSERVATORY_BASE_URL + "/verify-contract";
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

      const headers = {
        "content-type": "application/json",
        "X-API-KEY": Config.OBSERVATORY_X_API_KEY
      };

      let response = await HttpService.executeHTTPRequest(
        httpConstants.METHOD_TYPE.POST,
        url,
        "",
        data,
        headers
      );

      console.log(
        "verification response in verify721TokenManager =======>",
        response
      );

      if (!response || !response.responseData || !response.success)
        throw Utils.error(
          {},
          apiFailureMessage.COULD_NOT_VERIFY_TOKEN,
          httpConstants.RESPONSE_CODES.FORBIDDEN
        );

      return response;
    } catch (err) {
      console.log("ERROR IN verify721TokenManager =======>", err);
    }
  };

  updateNft = async (requestData) => {
    const tokenDetails = await NFT.findAll({
      where: {
        nftOwner: requestData.nftOwner,
        collectionId: requestData.collectionId,
        id: requestData.id,
      }
    });

    if (tokenDetails.length !== 0) {
      let updateObj = {};

      updateObj = {
        nftTokenId: requestData.nftTokenId,
        status: requestData.status,
      };

      await NFT.update(updateObj, {
        where: {
          nftOwner: requestData.nftOwner,
          collectionId: requestData.collectionId,
          isDeleted: false,
          id: requestData.id,
        },
      });
      return NFT.findAll({
        where: {
          collectionId: requestData.collectionId,
          id: requestData.id,
        },
      });
    } else {
      return "No such token exists!";
    }
  };

  find721TokenAndNft = async (requestData) => {
    const tokensFromDB = await XRC721Token.findAll({
      where: {
        id: requestData.id
      }
    });
    const NftFromDB = await NFT.findAll({
      where: {
        collectionId: requestData.id,
        isDeleted: false
      }
    });
    return { tokensFromDB, NftFromDB: NftFromDB };
  };

  findNft = async (requestData) => {
    const tokensFromDB = await NFT.findAll({
      where: {
        nftTokenId: requestData.nftTokenId,
        collectionId: requestData.collectionId,
        id: requestData.id,
        isDeleted: false
      }
    });
    if (tokensFromDB.length !== 0) return tokensFromDB;
    else return "No data found";
  };

  deletingNft = async (requestData) => {
    await NFT.update(
      { isDeleted: true },
      {
        where: {
          nftTokenId: requestData.nftTokenId,
          id: requestData.id
        }
      }
    );

    return "NFT deleted successfully";
  };

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
      { transfers: data },
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

  draftedTokens = async (requestData) => {
    let newArray = [];
    const draftedTokens721 = await XRC721Token.findAll({
      where: {
        status: requestData.status,
      },
      limit: requestData.limit,
    });

    const draftedTokens20 = await XRC20Token.findAll({
      where: {
        status: requestData.status,
      },
      limit: requestData.limit,
    });
    newArray=draftedTokens721
    //console.log("draftedTokens721====",newArray)
    console.log("draftedTokens20",draftedTokens20)
    newArray.push(draftedTokens20)
    //console.log("newArray.aggregate(draftedTokens20)====",newArray.aggregate(draftedTokens20))

    return {newArray}
    // newArray = (await draftedTokens721) + draftedTokens20;
    // console.log(newArray, "00900");
    // if (draftedTokens721.length !== 0 && draftedTokens20.length !== 0)
    //   return await { newArray };
    // //,draftedTokens20}
    // else return "no data found";
  };

  networkBasedSearch = async (requestData) => {
    let newArray = [];
    const tokens721 = await XRC721Token.findAll({
      where: {
        network: requestData.network,
      },
      limit: requestData.limit,
    });

    const tokens20 = await XRC20Token.findAll({
      where: {
        network: requestData.network,
      },
      limit: requestData.limit,
    });

    newArray=tokens721

    newArray.push(tokens20)

    return {newArray}
    //newArray= await draftedTokens721+draftedTokens20;
    //console.log(newArray, "00900");
    // if (draftedTokens721.length !== 0 && draftedTokens20.length !== 0)
    //   return await { newArray };
    // //,draftedTokens20}
    // else return "no data found";
    };


    xrcTokenByOwner = async(requestData)=>{
        try{

            const token721= await XRC721Token.findAll(
            // {select:{tokenType:1.0}},
            {
              attributes:["id","tokenName"],   
            where: {
                tokenOwner: requestData.tokenOwner,
            },
            limit: requestData.limit,
          });
          return token721

        }
        catch(e){
            console.log("error",e)
        }
        
    }
}
