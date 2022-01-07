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
};
