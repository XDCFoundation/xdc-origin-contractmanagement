import multer from "multer";
// const fs = require('fs');
import fs from 'fs'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("req======================", req)
        console.log("file==========================", file)
        fs.mkdir('./uploads/',(err)=>{
            cb(null, './uploads/');
        });
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const uploadImage = multer({storage: storage}).single('image');

module.exports = {
    uploadImage
};
