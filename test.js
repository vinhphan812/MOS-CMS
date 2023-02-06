require('dotenv').config();
const { sendDownloadLink } = require("./services/mail.service");

const to = "vinhphan812@gmail.com";

(async () => {
    await sendDownloadLink(to, {
        title: "Excel", content: `<p>Link full Đề Thi : <a hre="https://bit.ly/3bRiPlF">https://bit.ly/3bRiPlF</a> (clip youtube - cách làm với đề xem trong này)</p>
                                                              <p class="danger">*Chú ý: </p>
                                                              <p>Project 05 xem thêm: <a href="https://youtu.be/4QZV1VWrtJM">https://youtu.be/4QZV1VWrtJM</a></p>
                                                              <p>Project 10 xem thêm: <a href="https://youtu.be/bGNlwmJsBX0">https://youtu.be/bGNlwmJsBX0</a></p>
                                                              <p>Project 11 xem thêm: <a href="https://youtu.be/bGNlwmJsBX0">https://youtu.be/bGNlwmJsBX0</a></p>
                                                              <p>File Project Excel: <a href="https://bit.ly/3A3ZcRD">https://bit.ly/3A3ZcRD</a> (download file về thực hành)</p>`,
    });

    await sendDownloadLink(to, {
        title: "Word", content: `<p>Link full Đề Thi: <a href="https://bit.ly/2NYrnKb">https://bit.ly/2NYrnKb</a> (clip youtube - cách làm với đề xem trong này)</p>
                              <p class="danger">*Chú ý: </p>
                              <p>Project 6 xem thêm: <a href="https://youtu.be/ynC06z_L_y0">https://youtu.be/ynC06z_L_y0</a> </p>
                              <p>Project 11 Xem Thêm: <a href="https://youtu.be/AA9wkeWk9-Q">https://youtu.be/AA9wkeWk9-Q</a> </p>
                              <p>Project 15  Xem thêm: <a href="https://youtu.be/5Y-pDN73Uzw">https://youtu.be/5Y-pDN73Uzw</a> </p>
                              <p>Project 16 Xem Thêm: <a href="https://youtu.be/LoSWzf_BwIw">https://youtu.be/LoSWzf_BwIw</a> </p>
                              <p>File Project Word : <a hre="https://bit.ly/3Cc1qBm">https://bit.ly/3Cc1qBm</a> (download file về thực hành)</p>`,
    });

    await sendDownloadLink(to, {
        title: "PowerPoint", content: `<p>Link full đề thi : <a href="https://bit.ly/3nXxC0v">https://bit.ly/3nXxC0v</a> (clip youtube - cách làm với đề xem trong này)</p>
                                                              <p>Link Project PPT : <a href="https://bit.ly/3pqKI9O">https://bit.ly/3pqKI9O</a> (download file về thực hành)</p>`,
    });
})()