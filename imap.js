require("dotenv").config();

const Imap = require("imap"), inspect = require("util").inspect;
const { sendDownloadLink, sendReport } = require("./services/mail.service");
const Banking = require("./models/banking.model");
const { IMAP_USER, IMAP_PASS } = process.env;

const { initDatabase } = require("./configs");

const { simpleParser } = require("mailparser");

const RECEIVE_FROM = "support@timo.vn";

const REGEXS = {
    HTML: /(?=<!DOCTYPE html>)(.|\n)*?(?<=<\/html>)/g,
    DESCRIPTION: /(?<=(Mô tả: ))(.*)(?=\.)/g,
    AMOUNT: /(?<=tăng )(.*)(?= VND)/g,
    EMAIL: /[a-z][a-z0-9_\.]{5,32}(0a0|@)[a-z0-9]{2,}((0dot0|\.)[a-z0-9]{2,4}){1,3}/i,
    TYPE: /Word|Excel|PowerPoint|PPT/i
};

const imap = new Imap({
    user: IMAP_USER,
    password: IMAP_PASS,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
});

function openInbox(cb) {
    imap.openBox("Timo", true, cb);
}

imap.once("ready", function () {
    console.log("Imap Mail Service Running");

    openInbox(function (err, box) {
        if (err) throw err;

        imap.on("mail", (mail) => {
            console.log("new: ", mail);

            var f = imap.seq.fetch(box.messages.total + ":*", {
                bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE BODY)", "TEXT",],
            });

            f.on("message", function (msg, seqno) {
                let statusRead = false, date = false;
                msg.on("body", function (stream, info) {
                    simpleParser(stream, async (err, parsed) => {
                        const headers = parsed.headers;

                        if (headers.size) {
                            const from = headers.get("from");

                            if (parsed.date) date = parsed.date;

                            if (from) {
                                if (from.value.length && from.value[0].address == RECEIVE_FROM) {
                                    statusRead = true;
                                }
                            }

                            if (parsed.html && statusRead) {
                                const [match] = parsed.html.match(REGEXS.HTML);
                                let [description] = parsed.html.match(REGEXS.DESCRIPTION);
                                let [amount] = parsed.html.match(REGEXS.AMOUNT);

                                if (match) {
                                    if (amount) amount = +amount.replace(/\./g, "");

                                    if (description && amount && date) {
                                        description = description.replace(/Thanh toan QR |QR - (.*) Chuyen tien |QR - /g, "");

                                        const data = await Banking.create({
                                            description, amount, date,
                                        });

                                        try {
                                            if (description) {
                                                const [type] = REGEXS.TYPE.test(description) ? description.match(REGEXS.TYPE) : "";
                                                let to = "";
                                                if (REGEXS.EMAIL.test(description)) {
                                                    let [matcher] = description.match(REGEXS.EMAIL);

                                                    if (/.CT$/.test(matcher)) matcher = matcher.replace(/.CT$/, "");

                                                    to = matcher.replace(/0a0/i, "@").replace(/0dot0/i, ".");
                                                }

                                                console.log(`SEND FILE ${ type } to ${ to }`);

                                                const sendType = /WORD/i.test(type) ? "Word" : (/EXCEL/i.test(type) ? "Excel" : /PPT|POWERPOINT/i.test(type) ? "PowerPoint" : "");

                                                const isSend = await sendDownloadLink(to, {
                                                    title: sendType,
                                                    content: ``,
                                                });

                                                if (isSend) {
                                                    await Banking.updateOne({ _id: data._id }, {
                                                        $set: {
                                                            status: true,
                                                            email: to,
                                                            sendType
                                                        }
                                                    });
                                                }

                                            }
                                        } catch ({ message, stack }) {
                                            console.error(message, stack);
                                            sendReport({ message, stack, description });
                                        }
                                    }
                                }
                            }
                        }
                    });
                });

                msg.once("end", function () {
                    console.log("Finished");
                });
            });
            f.once("error", function (err) {
                sendReport(err);
                console.log("Fetch error: " + err);
            });
            f.once("end", function () {
                console.log("Done fetching all messages!");
            });
        });
    });
});

imap.once("error", function (err) {
    sendReport(err);
    console.log(err);
    imap.connect();
});

imap.once("end", function () {
    console.log("Connection ended");
    imap.connect();
});

imap.connect();
// connect DB
initDatabase();
