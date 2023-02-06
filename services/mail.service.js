const Mailer = require("../modules/mailer");
const moment = require("moment");
const pug = require("pug");

const mailer = new Mailer();

const { APP_NAME, MAIL_CONTACT } = process.env;

function send(to, data) {
    if (!to) throw new Error("To address is not required");

    mailer.send(data.subject, pug.renderFile("./modules/mail.pug", { ...data, APP_NAME, MAIL_CONTACT }), to);
}

module.exports = {
    registerSuccess: (to, { name }) => {
        send(to, {
            subject: "Yêu cầu đăng ký đang được xử lý",
            content: `<p style="margin-top: 0;">Chào <strong>${ name }</strong>,</p><p>Yêu cầu đăng ký thi MOS của bạn sẽ sớm được duyệt.</p>`
        });
    },
    approveRegister: (to, { name, exams }) => {
        exams = exams.filter((e) => e._doc).map(e => ({ ...e._doc, alias: e.alias }));

        exams.sort((a, b) => {
            const [aH, aM] = a.time.split(":");
            const [bH, bM] = b.time.split(":");

            return new Date(a.date.setHours(aH, aM, 0, 0)) - new Date(b.date.setHours(bH, bM, 0, 0));
        });

        const text = exams.map((e) => {
            return `<tr>
                <td>${ e.alias }</td>
                <td>${ e.time }</td>
                <td>${ moment(e.date).format("DD-MM-YYYY") }</td>
            </tr>`
        }).join("");

        const table = !text ? "" : `<table>
            <thead>
                <tr>
                    <th>Môn thi</th>
                    <th>Giờ thi</th>
                    <th>Ngày thi</th>
                </tr>    
            </thead>
            <tbody>${ text }</tbody>
        </table>`

        console.log(table);

        send(to, {
            subject: "Yêu cầu đăng ký đã được duyệt",
            content: `<p style="margin-top: 0;">Chào <strong>${ name }</strong>,</p><p>Yêu cầu đăng ký thi MOS của đã được duyệt.</p>${ table }`
        });
    },
    denyRegister: (to, { name, reason }) => {
        send(to, {
            subject: "Yêu cầu đăng ký đã bị tù chối",
            content: `<p style="margin-top: 0;">Chào <strong>${ name }</strong>,</p><p>Yêu cầu đăng ký thi MOS của đã bị từ chối vì lý do: <strong>${ reason }</strong>.</p>`
        });
    },
    sendDownloadLink: (to, { content, title }) => {
        send(to, {
            subject: `Ôn luyện ${ title }`,
            content: `<p>Xin chân thành cảm ơn bạn đã ủng hộ. Sau đây là nội dung bạn cần: </p><p>${ content }</p>`
        });
    },
    sendReport: async (to, { message, stack, description }) => {
        send(to, {
            subject: `Xảy ra lỗi ${ message }`,
            content: `<p>${ message }</p><p>Nội dung: ${ description }</p><code>${ stack }</code>`
        });
    }
}