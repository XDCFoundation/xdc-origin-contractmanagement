const db = require('../../../database/models/index');
// const solc = require('solc');
const XRC20Token = db.XRC20Token;
import solc from 'solc';
import fileReader from "../fileReader/index"
import ejs from "ejs";
export default class Manager {
    saveXrc20TokenAsDraft = async (requestData) => {

        //NEED TO ADD A FIELD FOR CONTRACT ABI TO THE XRC20Token TABLE (might be an object or an array), AS THAT NEEDS TO BE STORED FOR THE DRAFTED CONTRACTS GETTING DEPLOYED LATER.

        // API business logic

        // let MinterRole = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/Coin.sol');

        // let Roles = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/Roles.sol');
        // let ERC20 = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/ERC20.sol');
        // let ERC20Detailed = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/ERC20Detailed.sol');
        // let IERC20 = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/IERC20.sol');
        // let Ownable = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/Ownable.sol');
        // let SafeERC20 = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/SafeERC20.sol');
        // let SafeMath = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/SafeMath.sol');
        // let SignerRole = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/SignerRole.sol');
        // let isPausable = true;
        // let isBurnable = false;
        // let isMintable = true;
        // let isUpgradeable = false;
        // let ERC20CappedSign = "";
        //
        // let ERC20Burnable;
        // let Pausable;
        // let PauserRole;
        // let ERC20Pausable;
        // let MinterRole;
        // let ERC20Capped;
        // let ERC20Mintable;
        // let CapperRole;
        // let Upgradable;
        //
        // let inherits = "";
        //
        // let decimalInZero = "";
        // for (let index = 0; index < 8; index++) { //for (let index = 0; index < req.body.token_decimals; index++) {
        //     decimalInZero += '0';
        // }
        //
        // if (isBurnable) {
        //     ERC20Burnable = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/ERC20Burnable.sol');
        //     inherits += ", ERC20Burnable";
        // }
        // if (isPausable) {
        //     Pausable = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/Pausable.sol');
        //     PauserRole = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/PauserRole.sol');
        //     ERC20Pausable = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/ERC20Pausable.sol');
        //     inherits += " , ERC20Pausable";
        // }
        // if (isMintable) {
        //     MinterRole = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/MinterRole.sol');
        //     ERC20Capped = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/ERC20Capped.sol');
        //     ERC20Mintable = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/ERC20Mintable.sol');
        //     CapperRole = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/CapperRole.sol');
        //     // let ERC20Capped = await fileReader.readEjsFile(__dirname + '/ERC20contracts/ERC20Capped.sol');
        //     const amnt_cap = 1000  * 10; //parseFloat(parseFloat(req.body.token_supply)  * 10);
        //     ERC20CappedSign = "ERC20Capped(" + amnt_cap + "000000000000000000)"
        //     inherits += ", ERC20Mintable,ERC20Capped";
        // }
        // if (isUpgradeable) {
        //     Upgradable = await fileReader.readEjsFile(__dirname + '/contracts/ERC20contracts/Upgradable.sol');
        //     inherits += " , Upgradeable";
        // }
        //
        // ejs.renderFile(__dirname + '/contracts/ERC20contracts/Coin.sol', {
        //     "SafeERC20": SafeERC20,
        //     "SafeMath": SafeMath,
        //     "IERC20": IERC20,
        //     "ERC20": ERC20,
        //     "ERC20Capped": ERC20Capped,
        //     "ERC20Detailed": ERC20Detailed,
        //     "MinterRole": MinterRole,
        //     "Ownable": Ownable,
        //     "Pausable": Pausable,
        //     "PauserRole": PauserRole,
        //     "Roles": Roles,
        //     "CapperRole": CapperRole,
        //     "SignerRole": SignerRole,
        //     "ERC20Burnable": ERC20Burnable,
        //     "ERC20Pausable": ERC20Pausable,
        //     "Upgradable": Upgradable,
        //     "ERC20Mintable": ERC20Mintable,
        //     "inherits": inherits,
        //     //data from form
        //     totalSupply: 1000, //req.body.token_supply,
        //     name: "Meta1", //req.body.token_name,
        //     symbol: "M1", //req.body.token_symbol,
        //     decimal: 8, //req.body.token_decimals,
        //     decimalInZero: decimalInZero, //"000000000000000000",
        //     ERC20CappedSign: ERC20CappedSign
        // }, async (err, data) => {
        //     if(err){
        //         console.log("errrrrror -=-=-=-=-=-=-=", err);
        //     }
        //     let input_json = {
        //         language: "Solidity",
        //         sources:
        //             {file: {"content": data} },
        //         settings: {
        //             optimizer: {
        //                 // disabled by default
        //                 enabled: true,
        //                 runs: 200
        //             },
        //             outputSelection: {
        //                 "*": {
        //                     "*": [ "*" ]
        //                 }
        //             }
        //         }
        //     }
        //
        //     let output = await solc.compile(data); //await solc.compile(JSON.stringify(input_json));
        //
        //     // let output = JSON.stringify(await solc.compile(JSON.stringify(input_json)));
        //
        //     console.log("output -=-=-=-=-=-=-=-=-=-=", output);

            const newXRCToken = { //need to store the abi of the contract too, also add a status key here very importantly.
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
                burnable: requestData.burnable,
                mintable: requestData.mintable,
                pausable: requestData.pausable
            }

            const response = await XRC20Token.create(newXRCToken); //here, the details of the drafted contracts of a user can be fetched using the "tokenOwner" value which is the xdcpay address here

            // return {"service": "running"};

            return response;
        // });



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
                { where: { tokenOwner: requestData.tokenOwner,  id: requestData.tokenId} },
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
}
