
const { authenticate } = require("@google-cloud/local-auth");

const {google} = require('googleapis');


(async () => {
    const auth = new google.auth.GoogleAuth({
        scopes: "https://www.googleapis.com/auth/gmail",
        credentials: {
            client_email: "vinhphan812@gmail.com",
            private_key: "uyaixmfdkqwfklfo",
        },
    });

    const gmail = google.gmail({
        auth: {
            credentials: {
                client_email: "vinhphan812@gmail.com",
                private_key: "uyaixmfdkqwfklfo",
            },
        }
    })

    console.log(gmail);


})();

