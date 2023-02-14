const Mailer = require("../modules/mailer");
const moment = require("moment");
const pug = require("pug");

const mailer = new Mailer();
const ADMIN_MAIL = "vinhphan812@gmail.com"

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
    sendDownloadLink: async (to, { title, description }) => {
        if (!to) {
            this.sendReport({ message: "Không thể lấy được email", description });
            return false;
        }

        console.log(title);

        if(title == "") title = "Word";

        let content = `<p>Link full Đề Thi: <a href="https://bit.ly/2NYrnKb">https://bit.ly/2NYrnKb</a> (clip youtube - cách làm với đề xem trong này)</p>
                      <p class="danger">*Chú ý: </p>
                      <p>Project 6 xem thêm: <a href="https://youtu.be/ynC06z_L_y0">https://youtu.be/ynC06z_L_y0</a> </p>
                      <p>Project 11 Xem Thêm: <a href="https://youtu.be/AA9wkeWk9-Q">https://youtu.be/AA9wkeWk9-Q</a> </p>
                      <p>Project 15  Xem thêm: <a href="https://youtu.be/5Y-pDN73Uzw">https://youtu.be/5Y-pDN73Uzw</a> </p>
                      <p>Project 16 Xem Thêm: <a href="https://youtu.be/LoSWzf_BwIw">https://youtu.be/LoSWzf_BwIw</a> </p>
                      <p>File Project Word : <a href="https://bit.ly/3Cc1qBm">https://bit.ly/3Cc1qBm</a> (download file về thực hành)</p>`

        if (/Excel/i.test(title))
            content = `<p>Link full Đề Thi: <a href="https://bit.ly/3bRiPlF">https://bit.ly/3bRiPlF</a> (clip youtube - cách làm với đề xem trong này)</p>
                      <p class="danger">*Chú ý: </p>
                      <p>Project 05 xem thêm: <a href="https://youtu.be/4QZV1VWrtJM">https://youtu.be/4QZV1VWrtJM</a></p>
                      <p>Project 10 xem thêm: <a href="https://youtu.be/bGNlwmJsBX0">https://youtu.be/bGNlwmJsBX0</a></p>
                      <p>Project 11 xem thêm: <a href="https://youtu.be/bGNlwmJsBX0">https://youtu.be/bGNlwmJsBX0</a></p>
                      <p>File Project Excel: <a href="https://bit.ly/3A3ZcRD">https://bit.ly/3A3ZcRD</a> (download file về thực hành)</p>`

        if(/PowerPoint|PPT/i.test(title))
            content = `<p>Link full đề thi : <a href="https://bit.ly/3nXxC0v">https://bit.ly/3nXxC0v</a> (clip youtube - cách làm với đề xem trong này)</p>
                      <p>Link Project PPT : <a href="https://bit.ly/3pqKI9O">https://bit.ly/3pqKI9O</a> (download file về thực hành)</p>`

        await send(to, {
            subject: `Ôn luyện ${ title } - ${ to }`,
            content: `<p>Xin chân thành cảm ơn bạn đã ủng hộ. Sau đây là nội dung bạn cần: </p><p>${ content }</p>`
        });
        return true;
    },
    sendReport: async ({ message, stack, description }) => {
        send(ADMIN_MAIL, {
            subject: `Xảy ra lỗi ${ message }`,
            content: `<p>${ message }</p>${ description ? `<p>Nội dung: ${ description }</p>` : "" }<code>${ stack || "" }</code>`
        });
    }
}