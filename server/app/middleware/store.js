const multer = require('multer');

const storagePath = require('path').resolve(__dirname, '..','..','..','public_html','storage','store-products')
// const storagePath = require('path').resolve(__dirname, '..','..','storage','store-products')


// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storagePath);
  },
  filename: (req, file, cb) => {

    if (req.fileIndex === undefined) {
      req.fileIndex = 1;
    }

    const name = `${req.body.serie}-${req.fileIndex}.webp`


    const fileName = name
    req.fileIndex += 1;
    cb(null, fileName);
  }
});

let uploadFiles = multer({
  storage: storage,
});

// let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFiles;


