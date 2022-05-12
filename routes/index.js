/**
 * Created by AyushK on 18/09/20.
 */
import * as ValidationManger from "../middleware/validation";
import TestModule from "../app/modules/testModule";
import CreateContractModule from "../app/modules/createContract";
import {stringConstants} from "../app/common/constants";
import * as UploadFileManager from "../middleware/uploadFiles"
import multer from "multer";
import * as auth from "../middleware/authentication"
import CreateERC721 from "../app/modules/createERC721";

const upload = multer();

module.exports = (app) => {
    app.get('/', (req, res) => res.send(stringConstants.SERVICE_STATUS_HTML));

    /**
     * route definition
     */
    app.get("/test-route", new TestModule().testRoute);

    // XRC20 apis

    // app.post("/save-xrc20token-as-draft", ValidationManger.validateSaveXrc20TokenAsDraft, new CreateContractModule().saveXrc20TokenAsDraft);
    // app.put("/update-xrc20token", ValidationManger.validateUpdateXrc20Token, new CreateContractModule().updateXRC20Token);
    // app.post("/get-draft-failed-xrc20token", ValidationManger.validateGetDraftXrc20Token, new CreateContractModule().getDraftXRC20Token);
    // app.delete("/delete-xrc20token/:id", ValidationManger.validateDeleteXrc20Token, new CreateContractModule().deleteXrc20Token);
    // app.post("/get-xrc20Token-by-id", ValidationManger.validateGetXrc20TokenById, new CreateContractModule().getXrc20TokenById);
    // app.post("/verify-xrc20-token", ValidationManger.validateVerifyXrc20Token, new CreateContractModule().verifyXrc20Token);
    // app.post("/get-deployed-xrc20token", ValidationManger.validateGetDraftXrc20Token, new CreateContractModule().getDeployedXRC20Token);
    // app.post("/mint-burn-xrc20Token", ValidationManger.validateMintBurnXrc20Token, new CreateContractModule().mintBurnXrc20Token);
    // app.post("/pause-resume-xrc20-token", ValidationManger.validatePauseResumeXrc20Token, new CreateContractModule().pauseResumeXrc20Token);
    // app.post("/transfer-ownership-xrc20-token", ValidationManger.validateTransferOwnershipXrc20Token, new CreateContractModule().transferOwnershipXrc20Token);
    // app.post("/update-social-media-urls", ValidationManger.validateUpdateSocialMediaUrls, new CreateContractModule().updateSocialMediaUrls);


    app.post("/save-xrc20token-as-draft",auth.validatingUser, ValidationManger.validateSaveXrc20TokenAsDraft, new CreateContractModule().saveXrc20TokenAsDraft);
    app.put("/update-xrc20token",auth.validatingUser, ValidationManger.validateUpdateXrc20Token, new CreateContractModule().updateXRC20Token);
    app.post("/get-draft-failed-xrc20token",auth.validatingUser, ValidationManger.validateGetDraftXrc20Token, new CreateContractModule().getDraftXRC20Token);
    app.delete("/delete-xrc20token/:id",auth.validatingUser, ValidationManger.validateDeleteXrc20Token, new CreateContractModule().deleteXrc20Token);
    app.post("/get-xrc20Token-by-id",auth.validatingUser, ValidationManger.validateGetXrc20TokenById, new CreateContractModule().getXrc20TokenById);
    app.post("/verify-xrc20-token",auth.validatingUser, ValidationManger.validateVerifyXrc20Token, new CreateContractModule().verifyXrc20Token);
    app.post("/get-deployed-xrc20token",auth.validatingUser, ValidationManger.validateGetDraftXrc20Token, new CreateContractModule().getDeployedXRC20Token);
    app.post("/mint-burn-xrc20Token",auth.validatingUser, ValidationManger.validateMintBurnXrc20Token, new CreateContractModule().mintBurnXrc20Token);
    app.post("/pause-resume-xrc20-token",auth.validatingUser, ValidationManger.validatePauseResumeXrc20Token, new CreateContractModule().pauseResumeXrc20Token);
    app.post("/transfer-ownership-xrc20-token",auth.validatingUser, ValidationManger.validateTransferOwnershipXrc20Token, new CreateContractModule().transferOwnershipXrc20Token);
    app.post("/update-social-media-urls",auth.validatingUser, ValidationManger.validateUpdateSocialMediaUrls, new CreateContractModule().updateSocialMediaUrls);

    //api for uploading files to S3

    app.post("/upload-xrc20-file-to-s3", UploadFileManager.uploadImage, new CreateContractModule().uploadFileToS3);


    // XRC721 apis

    //app.get("/create-nft-collection", new CreateContractModule().createNftCollection);
    // app.post("/create-nft-collection",ValidationManger.validateCreateNftCollection,new CreateERC721().createNftCollection)
    // app.post("/update-token-721",ValidationManger.validateUpdateToken721,new CreateERC721().updateToken721)
    // app.post("/create-nft",ValidationManger.validateCreaterNFT,new CreateERC721().createrNFT)
    // app.post("/update-nft",ValidationManger.validateUpdateNft,new CreateERC721().updateNft)
    // app.post("/find-721-token",ValidationManger.validateFind721TokenAndNft,new CreateERC721().find721TokenAndNft)
    // app.post("/find-nft",ValidationManger.validateFindNft,new CreateERC721().findNft)
    // app.post("/delete-nft",ValidationManger.validateDeletingNft,new CreateERC721().deletingNft)
    // app.post("/tranfer-nft",ValidationManger.validateNftTransfer,new CreateERC721().nftTransfer)
    // app.post("/xrc-721-token-by-owner",ValidationManger.validateXrcTokenByOwner,new CreateERC721().xrcTokenByOwner);
    // app.post("/get-drafted-and-failed-tokens",ValidationManger.validateGetDraftedAndFailedTokens, new CreateERC721().getDraftedAndFailedTokens);
    // app.post("/get-drafted-and-failed-tokens-by-type",ValidationManger.validateGetDraftedAndFailedTokensByType, new CreateERC721().getDraftedAndFailedTokensByType);
    // app.post("/get-xrc721-and-xrc20-tokens-by-network",ValidationManger.validateNetworkBasedSearch, new CreateERC721().getXRC721AndXRC20TokensByNetwork);
    // app.post("/get-deployed-tokens",ValidationManger.validateGetDeployedTokens, new CreateERC721().getDeployedTokens);

    // app.post("/get-ipfs-url", upload.single('files'), ValidationManger.validateGetIpfsUrl,  new CreateERC721().getIpfsUrl);
    // app.post("/delete-collection",ValidationManger.validateDeleteCollection,new CreateERC721().deleteCollection)



    app.post("/create-nft-collection",auth.validatingUser,ValidationManger.validateCreateNftCollection,new CreateERC721().createNftCollection)
    app.post("/update-token-721",auth.validatingUser,ValidationManger.validateUpdateToken721,new CreateERC721().updateToken721)
    app.post("/create-nft",auth.validatingUser,ValidationManger.validateCreaterNFT,new CreateERC721().createrNFT)
    app.post("/update-nft",auth.validatingUser,ValidationManger.validateUpdateNft,new CreateERC721().updateNft)
    app.post("/find-721-token",auth.validatingUser,ValidationManger.validateFind721TokenAndNft,new CreateERC721().find721TokenAndNft)
    app.post("/find-nft",auth.validatingUser,ValidationManger.validateFindNft,new CreateERC721().findNft)
    app.post("/delete-nft",auth.validatingUser,ValidationManger.validateDeletingNft,new CreateERC721().deletingNft)
    app.post("/tranfer-nft",auth.validatingUser,ValidationManger.validateNftTransfer,new CreateERC721().nftTransfer)
    app.post("/xrc-721-token-by-owner",auth.validatingUser,ValidationManger.validateXrcTokenByOwner,new CreateERC721().xrcTokenByOwner);
    app.post("/get-drafted-and-failed-tokens",auth.validatingUser,ValidationManger.validateGetDraftedAndFailedTokens, new CreateERC721().getDraftedAndFailedTokens);
    app.post("/get-drafted-and-failed-tokens-by-type",auth.validatingUser,ValidationManger.validateGetDraftedAndFailedTokensByType, new CreateERC721().getDraftedAndFailedTokensByType);
    app.post("/get-xrc721-and-xrc20-tokens-by-network",auth.validatingUser,ValidationManger.validateNetworkBasedSearch, new CreateERC721().getXRC721AndXRC20TokensByNetwork);
    app.post("/get-deployed-tokens",auth.validatingUser,ValidationManger.validateGetDeployedTokens, new CreateERC721().getDeployedTokens);

    app.post("/get-ipfs-url",auth.validatingUser, upload.single('files'), ValidationManger.validateGetIpfsUrl,  new CreateERC721().getIpfsUrl);
    app.post("/delete-collection",auth.validatingUser,ValidationManger.validateDeleteCollection,new CreateERC721().deleteCollection)

 //NFT and XRC721 tables migrations into Production DB
};
