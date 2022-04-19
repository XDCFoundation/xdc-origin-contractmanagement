import multer from "multer";
// const fs = require('fs');
import fs from 'fs'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        
        fs.mkdir('./uploads/',(err)=>{
            cb(null, './uploads/');
        });
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploadImage = multer({storage: storage}).single('image');

module.exports = {
    uploadImage
};
