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
    EMAIL: /^[a-z][a-z0-9_\.]{5,32}(0a0|@)[a-z0-9]{2,}((0dot0|.)[a-z0-9]{2,4}){1,3}/i,
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

                                        console.log(description);

                                        const data = await Banking.create({
                                            description, amount, date,
                                        });
                                        const arrDescription = description.split(" ");
                                        try {
                                            if (arrDescription.length > 1) {
                                                const [type] = description.shift(1).match(/Word|Excel|PowerPoint|PPT/i);
                                                let to = "";
                                                if (REGEXS.EMAIL.test(description)) {
                                                    let [matcher] = description.match(REGEXS.EMAIL);

                                                    if (/.CT$/.test(matcher)) matcher = matcher.replace(/.CT$/, "");

                                                    to = matcher.replace(/0a0/i, "@").replace(/0dot0/i, ".");
                                                }

                                                console.log(`SEND FILE ${ type } to ${ to }`);

                                                let isSend = false,
                                                    sendType = "";
                                                if (/WORD/i.test(type)) {
                                                    await sendDownloadLink(to, {
                                                        title: "Word",
                                                        content: `<p>Link full Đề Thi: <a href="https://bit.ly/2NYrnKb">https://bit.ly/2NYrnKb</a> (clip youtube - cách làm với đề xem trong này)</p>
                                                              <p class="danger">*Chú ý: </p>
                                                              <p>Project 6 xem thêm: <a href="https://youtu.be/ynC06z_L_y0">https://youtu.be/ynC06z_L_y0</a> </p>
                                                              <p>Project 11 Xem Thêm: <a href="https://youtu.be/AA9wkeWk9-Q">https://youtu.be/AA9wkeWk9-Q</a> </p>
                                                              <p>Project 15  Xem thêm: <a href="https://youtu.be/5Y-pDN73Uzw">https://youtu.be/5Y-pDN73Uzw</a> </p>
                                                              <p>Project 16 Xem Thêm: <a href="https://youtu.be/LoSWzf_BwIw">https://youtu.be/LoSWzf_BwIw</a> </p>
                                                              <p>File Project Word : <a href="https://bit.ly/3Cc1qBm">https://bit.ly/3Cc1qBm</a> (download file về thực hành)</p>`,
                                                    });
                                                    isSend = true;
                                                    sendType = "Word";

                                                } else if (/EXCEL/i.test(type)) {
                                                    await sendDownloadLink(to, {
                                                        title: "Excel",
                                                        content: `<p>Link full Đề Thi : <a href="https://bit.ly/3bRiPlF">https://bit.ly/3bRiPlF</a> (clip youtube - cách làm với đề xem trong này)</p>
                                                              <p class="danger">*Chú ý: </p>
                                                              <p>Project 05 xem thêm: <a href="https://youtu.be/4QZV1VWrtJM">https://youtu.be/4QZV1VWrtJM</a></p>
                                                              <p>Project 10 xem thêm: <a href="https://youtu.be/bGNlwmJsBX0">https://youtu.be/bGNlwmJsBX0</a></p>
                                                              <p>Project 11 xem thêm: <a href="https://youtu.be/bGNlwmJsBX0">https://youtu.be/bGNlwmJsBX0</a></p>
                                                              <p>File Project Excel: <a href="https://bit.ly/3A3ZcRD">https://bit.ly/3A3ZcRD</a> (download file về thực hành)</p>`,
                                                    });

                                                    isSend = true;
                                                    sendType = "Excel";
                                                } else if (/PPT|POWERPOINT/i.test(type)) {
                                                    await sendDownloadLink(to, {
                                                        title: "PowerPoint",
                                                        content: `<p>Link full đề thi : <a href="https://bit.ly/3nXxC0v">https://bit.ly/3nXxC0v</a> (clip youtube - cách làm với đề xem trong này)</p>
                                                              <p>Link Project PPT : <a href="https://bit.ly/3pqKI9O">https://bit.ly/3pqKI9O</a> (download file về thực hành)</p>`,
                                                    });
                                                    isSend = true;
                                                    sendType = "PowerPoint";
                                                }

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
                                            sendReport("vinhphan812@gmail.com", { message, stack, description });
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
                console.log("Fetch error: " + err);
            });
            f.once("end", function () {
                console.log("Done fetching all messages!");
            });
        });
    });
});

imap.once("error", function (err) {
    console.log(err);
});

imap.once("end", function () {
    console.log("Connection ended");
    imap.connect();
});

imap.connect();
// connect DB
initDatabase();
