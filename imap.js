require("dotenv").config();

const Imap = require("imap"),
    inspect = require("util").inspect;
const Banking = require("./models/banking.model");

const { initDatabase } = require("./configs");

const { simpleParser } = require('mailparser');

const fs = require("fs");

const RECEIVE_FROM = "support@timo.vn";

const REGEXS = {
    HTML: /(?=<!DOCTYPE html>)(.|\n)*?(?<=<\/html>)/g,
    DESCRIPTION: /(?<=Mô tả:)(.*)(?=\.)/g,
    AMOUNT: /(?<=tăng )(.*)(?= VND)/g
}


var imap = new Imap({
    user: "Vonguyenthuyanh0304@gmail.com",
    password: "xmotfosmzcxpmnqf",
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
});

function openInbox(cb) {
    imap.openBox("INBOX", true, cb);
}

imap.once("ready", function () {
    console.log("Imap Mail Service Running");
    openInbox(function (err, box) {
        if (err) throw err;

        imap.on('mail', (mail) => {
            console.log("new: ", mail);

            var f = imap.seq.fetch(box.messages.total + ":*", {
                bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE BODY)", "TEXT"],
            });


            f.on("message", function (msg, seqno) {
                let statusRead = false, date = false;
                msg.on("body", function (stream, info) {
                    simpleParser(stream, async (err, parsed) => {
                        const headers = parsed.headers;
                        console.log(parsed);

                        if (headers.size) {
                            const from = headers.get("from");

                            if (parsed.date)
                                date = parsed.date;

                            if (from) {
                                if (from.value.length && from.value[0].address == RECEIVE_FROM) {
                                    statusRead = true;
                                }
                            }
                            console.log("statusRead: ", statusRead);
                            console.log("html: ", parsed.html);

                            if (parsed.html && statusRead) {
                                const [match] = parsed.html.match(REGEXS.HTML);
                                const [description] = parsed.html.match(REGEXS.DESCRIPTION);
                                let [amount] = parsed.html.match(REGEXS.AMOUNT);

                                if (match) {

                                    if (amount)
                                        amount = +amount.replace(/\./g, "");

                                    console.log(description, amount, date);

                                    if (description && amount && date)
                                        Banking.create({ description, amount, date });

                                    fs.writeFileSync("index.html", match);
                                }
                            }
                        }
                    })
                });

                msg.once("attributes", function (attrs) {
                    console.log("Attributes: %s", inspect(attrs, false, 8));
                });
                msg.once("end", function () {
                    console.log("Finished");
                });
            });
            f.once("error", function (err) {
                console.log("Fetch error: " + err);
            });
            f.once("end", function () {
                console.log("Done fetching all messages!");
                // imap.end();
            });

        });
    })
});


imap.once("error", function (err) {
    console.log(err);
});

imap.once("end", function () {
    console.log("Connection ended");
});

imap.connect();
// connect DB
initDatabase();
