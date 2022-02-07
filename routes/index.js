/**
 * Created by AyushK on 18/09/20.
 */
import * as ValidationManger from "../middleware/validation";
import TestModule from "../app/modules/testModule";
import CreateContractModule from "../app/modules/createContract";
import {stringConstants} from "../app/common/constants";

module.exports = (app) => {
    app.get('/', (req, res) => res.send(stringConstants.SERVICE_STATUS_HTML));

    /**
     * route definition
     */
    app.get("/test-route", new TestModule().testRoute);
    app.post("/save-xrc20token-as-draft", ValidationManger.validateSaveXrc20TokenAsDraft, new CreateContractModule().saveXrc20TokenAsDraft);
    app.put("/update-xrc20token", ValidationManger.validateUpdateXrc20Token, new CreateContractModule().updateXRC20Token);
    app.post("/get-draft-failed-xrc20token", ValidationManger.validateGetDraftXrc20Token, new CreateContractModule().getDraftXRC20Token);
    app.delete("/delete-xrc20token/:id", ValidationManger.validateDeleteXrc20Token, new CreateContractModule().deleteXrc20Token);
    app.post("/get-xrc20Token-by-id", ValidationManger.validateGetXrc20TokenById, new CreateContractModule().getXrc20TokenById);
    app.post("/verify-xrc20-token", ValidationManger.validateVerifyXrc20Token, new CreateContractModule().verifyXrc20Token);
    app.post("/get-deployed-xrc20token", ValidationManger.validateGetDraftXrc20Token, new CreateContractModule().getDeployedXRC20Token);
    app.post("/mint-burn-xrc20Token", ValidationManger.validateMintBurnXrc20Token, new CreateContractModule().mintBurnXrc20Token);
    app.post("/pause-resume-xrc20-token", ValidationManger.validatePauseResumeXrc20Token, new CreateContractModule().pauseResumeXrc20Token);
    app.post("/transfer-ownership-xrc20-token", ValidationManger.validateTransferOwnershipXrc20Token, new CreateContractModule().transferOwnershipXrc20Token);

};
