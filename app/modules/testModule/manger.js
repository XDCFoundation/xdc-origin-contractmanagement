const db = require('../../../database/models/index');
const user = db.User;
export default class Manger {
    testMethod = async (requestData) => {
        // API business logic
        // let newUser = {  //this is a dummy data
        //     userId: "3333",
        //     xdcPayAddress: "Shivani3",
        // }

        //FOR CREATING A NEW RECORD IN THE TABLE

        // let userDetails = await user.create(newUser);
        //
        // console.log("userDetails =====", userDetails);
        //
        // return userDetails;



        //FOR FINDING RECORDS BASED ON A QUERY FROM THE TABLE

        // let userDetails = await user.findAll({
        //     where: {
        //         "userId": "3333"
        //     }
        // });

        // console.log("userDetails =====", userDetails);

        return {};

    }
}
