const crypto = require("crypto");


module.exports = {
    hashShortLink: (url) => {
        return crypto.createHash("md5").update(url).digest("base64").slice(0, 10);
    }
}