import {Op} from "sequelize";

const db = require('../../../database/models/index');
const XRC20Token = db.XRC20Token;
const XRC721Token = db.XRC721Token;
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


    
    

}
