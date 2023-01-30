const multer = require("multer");

const storage = (base = "") => {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./public/uploads/${base}`);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    });
};

module.exports = { upload: (base) => multer({ storage: storage(base) }) };